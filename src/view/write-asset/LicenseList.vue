<template>
  <div id="content">
    <div class="content-top">
      <div class="content-top-left">
        <h1>Ghi tăng tài sản</h1>
      </div>
      <div class="content-top-right">
        <!-- Nút thêm chứng từ -->
        <base-button-text :text="'Thêm'" @click="btnAddOnClick" />
        <!-- Nút đổi giao diện -->
        <button class="base-button-icon">
          <div class="icon-horizontal"></div>
          <div class="icon-chevron-down-black"></div>
        </button>
      </div>
    </div>
    <!-- Bảng hiện thị Danh sách chứng từ và tài sản tương ứng -->
    <div class="content-main">
      <license-table
        :licenses="listLicenses"
        :totalRows="totalRecords"
        @search="search"
        @btnEditOnClick="btnEditOnClick"
        @btnDeleteOnClick="btnDeleteOnClick"
        @btnDeleteOneOnClick="btnDeleteOneOnClick"
        @changePageSize="changePageSize"
        @changePageNumber="changePageNumber"
        @showToast="showToastMessage"
        ref="table"
      />
    </div>

    <!-- Form chi tiết thêm/sửa chứng từ -->
    <license-detail 
      v-if="showDialog"
      :formMode="formMode"
      :selectedId="selectedId"
      @btnCancelOnClick="btnCancelOnClick"
      @closeDialog="showDialog = false"
      @validateError="showValidateError"
      @loadData="loadData"
      @showToast="showToastMessage"
    />

    <!-- Popup cảnh báo -->
    <base-popup
      v-if="popupInfo.displayed"
      :subBtn="popupInfo.subBtn"
      :outlineBtn="popupInfo.outlineBtn"
      :outlineBtnText="popupInfo.outlineBtnText"
      :subBtnText="popupInfo.subBtnText"
      :mainBtnText="popupInfo.mainBtnText"
      :action="popupInfo.action"
      :text="popupInfo.text"
      @closePopup="popupInfo.displayed = false"
      @closeDialog="showDialog = false"
    />
    <!-- Loader -->
    <base-loader v-if="showLoader" />
    <!-- Toast message -->
    <base-toast v-if="showToast" :text="toastMsg" />
  </div>
</template>

<script>
import { bus } from "../../main";
import axios from "axios";

import Enums from "../../components/common/enum.js";
import Resources from "../../components/common/resource.js";

import BaseButtonText from "../../components/base/BaseButtonText.vue";
import BaseLoader from "../../components/base/BaseLoader.vue";
import BasePopup from "../../components/base/BasePopup.vue";
import BaseToast from "../../components/base/BaseToast.vue";

import LicenseTable from "../write-asset/LicenseTable.vue";
import LicenseDetail from "../write-asset/LicenseDetail.vue";

export default {
  components: {
    BaseButtonText,
    LicenseTable,
    BaseLoader,
    BasePopup,
    BaseToast,
    LicenseDetail,

  },

  data() {
    return {
      showDialog: false, // Hiển thị dialog detail
      formMode: null, //Trạng thái khi mở dialog detail (add/edit)
      selectedId: null, //id của chứng từ chọn để sửa (truyền vào dialog detail)
      listLicenses: [], // Danh sách chứng từ
      searchText: "", // Từ khóa tìm kiếm chứng từ
      pageSize: 10, // Số lượng chứng từ trên một trang
      pageNumber: 1, // Trang hiện tại
      totalRecords: 0, // Tổng số chứng từ
      showLoader: false, // Hiển thị loader
      showToast: false, // Hiển thị toast message
      toastMsg: "", // Nội dung toast message
      //Thông tin của popup
      popupInfo: {
        displayed: false, //Biến mở/đóng popup
        outlineBtn: true, //Btn outline
        subBtn: false, //Popup có dùng sub btn hay không
        outlineBtnText: null, //Text của btn outline
        subBtnText: null, //Text của btn sub
        mainBtnText: null, //Text của btn main
        action: null, //Action của btn main
        text: [], //Thông điệp hiển thị trong popup
      },
    };
  },

  created() {
    //Khai báo event loadData tại bus
    bus.$on("loadData", this.loadData);

    //Load data
    this.loadData();
  },

  methods: {
    /**
     * Hàm lấy dữ liệu
     * Created by: VDDong (09/08/2022)
     */
    loadData() {
      //Show loader
      this.showLoader = true;
      //Call API get data
      var me = this;
      me.listLicenses = [];
      axios
        .get(
          Resources.API.GetLicenseFilter +
            `${this.searchText}` +
            `&pageSize=${this.pageSize}&pageNumber=${this.pageNumber}`
        )
        .then((response) => {
          var listLicenses = response.data.data;
          listLicenses.forEach((license) => {
            license.selected = false; //Chưa tích checkbox
            license.licenseDate = new Date(license.licenseDate); //Ngày bắt đầu sử dụng
            license.licenseDate.setHours(license.licenseDate.getHours() + 7); //Trong database là giờ +0 nên cần +7 chuyển về giờ Việt Nam
            license.writeDate = new Date(license.writeDate); //Ngày ghi tăng
            license.writeDate.setHours(license.writeDate.getHours() + 7);
            me.listLicenses.push(license);
          });
          me.totalRecords = response.data.totalRecords;
          me.showLoader = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    /**
     * Click nút thêm mới Chứng từ
     * Created by: VDDong (09/08/2022)
     */
    btnAddOnClick() {
      this.showDialog = true;
      this.formMode = Enums.FormMode.Add;
      this.selectedId = null;
    },

    /**
     * Click nút sửa Chứng từ
     * Created by: VDDong (09/08/2022)
     */
    btnEditOnClick(licenseId) {
      this.showDialog = true;
      this.formMode = Enums.FormMode.Edit;
      this.selectedId = licenseId;
    },

    /**
     * Click nút xóa nhiều Chứng từ
     * Created by: VDDong (10/08/2022)
     */
    btnDeleteOnClick() {
      //Đếm số bản ghi đã chọn
      var count = this.$refs.table.countSelected;
      //Lấy ra bản ghi (trong trường hợp chọn 1 bản ghi)
      var license = this.$refs.table.selectedLicense;
      //Nếu có chọn bản ghi để xóa
      if(count > 0) {
        var popupText;
        if(count > 1){
          //Xóa nhiều bản ghi
          popupText = [
            `${count} ` +
              Resources.Notice.License_ConfirmMultiDelete,
          ];
        }
        else {
          //Xóa 1 bản ghi
          popupText = [Resources.Notice.ConfirmSingleDelete + ` chứng từ có mã ${license.licenseCode}?`];
        }
        //Hiển thị popup
        this.popupInfo.displayed = true;
        this.popupInfo.text = popupText;
        this.popupInfo.subBtn = false;
        this.popupInfo.outlineBtn = true;
        this.popupInfo.mainBtnText = Resources.TextBtn.Delete;
        this.popupInfo.outlineBtnText = Resources.TextBtn.No;
        this.popupInfo.action = Enums.Action.DeleteLicense;
      }
    },

    /**
     * Click vào nút xóa đơn lẻ trên 1 dòng chứng từ
     * Created by: VDDong (16/08/2022)
     */
    btnDeleteOneOnClick(license) {
      var me = this;
      var popupText = [Resources.Notice.ConfirmSingleDelete + ` chứng từ có mã ${license.licenseCode}?`];
      //Hiển thị popup
      me.popupInfo.displayed = true;
      me.popupInfo.text = popupText;
      me.popupInfo.subBtn = false;
      me.popupInfo.outlineBtn = true;
      me.popupInfo.mainBtnText = Resources.TextBtn.Delete;
      me.popupInfo.outlineBtnText = Resources.TextBtn.No;
      me.popupInfo.action = Enums.Action.DeleteLicense;
    },

    /**
     * Click nút hủy ở dialog detail Chứng từ
     * Created by: VDDong (10/08/2022)
     */
    btnCancelOnClick(action) {
      if(action == Enums.Action.Put){
        this.popupInfo.displayed = true;
        this.popupInfo.text = [
          Resources.Notice.ConfirmCancelEdit,
        ];
        this.popupInfo.subBtn = true;
        this.popupInfo.outlineBtn = true;
        this.popupInfo.mainBtnText = Resources.TextBtn.Save;
        this.popupInfo.subBtnText = Resources.TextBtn.DontSave;
        this.popupInfo.outlineBtnText = Resources.TextBtn.Cancel;
        this.popupInfo.action = "put-license";
      }
      else {
        this.popupInfo.displayed = true;
        this.popupInfo.text = [Resources.Notice.License_ConfirmCancelAdd];
        this.popupInfo.subBtn = false;
        this.popupInfo.outlineBtn = true;
        this.popupInfo.mainBtnText = Resources.TextBtn.Cancel;
        this.popupInfo.outlineBtnText = Resources.TextBtn.No;
        this.popupInfo.action = "post-license";
      }
    },

    /**
     * Hiển thị popup validate dữ liệu không hợp lệ
     * msgs bao gồm cả lỗi từ backend và client (validate client trước)
     * Created by: VDDong (09/08/2022)
     */
    showValidateError(msgs) {
      //Hiển thị popup gồm các cảnh báo về các dữ liệu không hợp lệ
      this.popupInfo.displayed = true;
      this.popupInfo.text = [];
      msgs.forEach((msg) => {
        this.popupInfo.text.push(msg);
      });
      this.popupInfo.subBtn = false;
      this.popupInfo.outlineBtn = false;
      this.popupInfo.mainBtnText = Resources.TextBtn.Close;
      this.popupInfo.action = Enums.Action.ValidateError;
    },

    /**
     * Tìm kiếm Chứng từ
     * Created by: VDDong (09/08/2022)
     */
    search(searchText) {
      this.searchText = searchText;
      this.loadData();
    },

    /**
     * Hàm thay đổi số lượng bản ghi trên một trang
     * pageSize truyền từ LicenseTable sang
     * Created by: VDDong (09/08/2022)
     */
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.loadData();
    },

    /**
     * Hàm thay đổi trang
     * pageNumber truyền từ LicenseTable sang
     * Created by: VDDong (09/08/2022)
     */
    changePageNumber(pageNumber) {
      this.pageNumber = pageNumber;
      this.loadData();
    },

    /**
     * Show toast message
     * Created by: VDDong (09/08/2022)
     */
    showToastMessage(msg) {
      //Show toast message
      this.showToast = true;
      this.toastMsg = msg;
      //Ẩn sau 4s
      setTimeout(() => {
        this.showToast = false;
      }, 4000);
    },
  },
};
</script>

<style scoped>
.base-button-icon {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 80px;
}
</style>