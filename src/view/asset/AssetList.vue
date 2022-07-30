<template>
  <div id="content">
    <div class="content-top">
      <div class="content-top-left">
        <!-- Input tìm kiếm -->
        <base-input
          :placeholder="'Tìm kiếm tài sản'"
          :withIcon="true"
          :icon="'icon-search-black'"
          :fieldName="'searchAssets'"
          :value="searchText"
          @searching="typingSearch"
        />
        <!-- Combobox loại tài sản -->
        <base-combobox
          :placeholder="'Loại tài sản'"
          :withIcon="true"
          :icon="'icon-filter'"
          :items="listCategoryName"
          @itemOnClick="filterCategory"
        />
        <!-- Combobox bộ phận sử dụng -->
        <base-combobox
          :placeholder="'Bộ phận sử dụng'"
          :withIcon="true"
          :icon="'icon-filter'"
          :items="listDepartmentName"
          @itemOnClick="filterDepartment"
        />
      </div>
      <div class="content-top-right">
        <!-- Nút thêm tài sản -->
        <base-button-text :text="'+ Thêm tài sản'" @click="btnAddOnClick" />
        <!-- Nút import dữ liệu -->
        <base-button-icon 
          :icon="'icon-excel'" 
          id="btn-excel-tool" 
          @showPopupConfirmAddRecordsFromExcel="showPopupConfirmAddRecordsFromExcel"
          @showPopupNotice="showPopupNoticeFromExcel"
          @loadData="loadData"
          @showLoading="showLoading"
        />
        <!-- Nút xoá  -->
        <base-button-icon :icon="'icon-delete'" @click="btnDeleteOnClick" title="Xóa dữ liệu" />
        <!-- Nút Refresh -->
        <!-- <base-button-icon :icon="'icon-refresh'" @click="btnRefreshOnClick()" /> -->
      </div>
    </div>

    <div class="content-main">
      <!-- Bảng dữ liệu -->
      <base-table
        :assets="listAssets"
        :totalRows="totalRecords"
        ref="table"
        @btnAddOnClick="btnAddOnClick"
        @btnEditOnClick="btnEditOnClick"
        @btnCopyOnClick="btnCopyOnClick"
        @btnViewOnClick="btnViewOnClick"
        @changePageSize="changePageSize"
        @changePageNumber="changePageNumber"
        @showToast="showToastMessage"
      />
    </div>

    <!-- Dialog chi tiết -->
    <asset-detail
      v-if="showDialog"
      :formMode="formMode"
      :listDepartmentCode="listDepartmentCode"
      :listCategoryCode="listCategoryCode"
      :selectedId="selectedId"
      @btnCancelOnClick="btnCancelOnClick"
      @validateError="showValidateError"
      @closeDialog="showDialog = false"
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
    <base-loader v-if="showLoader"/>

    <!-- Toast message -->
    <base-toast v-if="showToast" :text="toastMsg"/>

  </div>
</template>


<script>
import axios from "axios";
import { bus } from "../../main";

import Enums from "../../components/common/enum.js";
import Resources from "../../components/common/resource.js";

import BaseButtonIcon from "../../components/base/BaseButtonIcon.vue";
import BaseButtonText from "../../components/base/BaseButtonText.vue";
import BaseInput from "../../components/base/BaseInput.vue";
import BaseCombobox from "../../components/base/BaseCombobox.vue";
import BaseTable from "../asset/AssetTable.vue"
import AssetDetail from "../asset/AssetDetail.vue"
import BasePopup from "../../components/base/BasePopup.vue";
import BaseLoader from "../../components/base/BaseLoader.vue";
import BaseToast from "../../components/base/BaseToast.vue";

export default {
  components: {
    BaseButtonIcon,
    BaseButtonText,
    BaseInput,
    BaseCombobox,
    BaseTable,
    AssetDetail,
    BasePopup,
    BaseLoader,
    BaseToast,

  },

  data() {
    return {
      showDialog: false, //Biến mở/đóng AssetDetail
      formMode: null, //add, edit, copy
      selectedId: null, //Biến hứng id của tài sản được chọn gửi về từ AssetTable

      listAssets: [], // Danh sách tài sản
      totalRecords: 0, // Tổng số bản ghi
      pageSize: 20, // Số bản ghi trên 1 trang
      pageNumber: 1, //Trang hiện tại
      searchText: "", // Từ khóa tìm kiếm
      listCategoryName: [], // Danh sách tên loại tài sản truyền vào combobox
      listCategoryCode: [], // Danh sách mã loại tài sản truyền vào asset-detail
      assetCategoryName: "", //Tên loại tài sản được chọn từ combobox, lấy ra để lọc
      assetCategoryId: "", //Mã loại tài sản được chọn từ combobox, lấy ra để lọc (nên lọc theo id thay vì tên)
      listDepartmentName: [], // Danh sách tên bộ phận truyền vào combobox ở asset-list
      listDepartmentCode: [], // Danh sách mã bộ phận truyền vào combobox ở asset-detail
      departmentName: "", //Bộ phận được chọn từ combobox, lấy ra để lọc
      departmentId: "", //Mã bộ phận được chọn từ combobox, lấy ra để lọc (nên lọc theo id thay vì tên)

      //Thông tin popup
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

      showLoader: false, //Hiển thị loader
      showToast: false, //Hiển thị toast message
      toastMsg: "", //Thông điệp hiển thị ở toast
      timer: 1, //Khoảng thời gian ngừng gõ text thì sẽ tìm kiếm

    };
  },

  created() {
    //Khởi tạo sự kiện loadData trên bus
    bus.$on("loadData", this.loadData);
    var me = this;
    //Lấy dữ liệu combobox bộ phận sử dụng
    axios
      .get(Resources.API.GetDepartments)
      .then(function (response) {
        var listDepartment = response.data;
        listDepartment.forEach((item) => {
          var id = item.departmentId;
          var code = item.departmentCode;
          var name = item.departmentName;
          me.listDepartmentName.push({ id: id, value: name, des: null });
          me.listDepartmentCode.push({ id: id, value: code, des: name });
        });
      })
      .catch((error) => {
        console.log(error);
      });
    //Lấy dữ liệu combobox loại tài sản
    axios
      .get(Resources.API.GetAssetCategories)
      .then(function (response) {
        var listCategory = response.data;
        listCategory.forEach((item) => {
          var id = item.assetCategoryId;
          var code = item.assetCategoryCode;
          var name = item.assetCategoryName;
          me.listCategoryName.push({ id: id, value: name, des: null });
          me.listCategoryCode.push({ id: id, value: code, des: name });
        });
      })
      .catch((error) => {
        console.log(error);
      });

    //Lấy dữ liệu từ server render ra table
    this.loadData();
  },

  methods: {
    /**
     * Hàm lấy dữ liệu
     * CreatedBy: VDDong (03/06/2022)
     */
    loadData() {
      //Hiển thị loader
      this.showLoader = true;

      //Gọi api lấy dữ liệu
      var me = this;
      this.listAssets = [];
      axios
        .get(
          Resources.API.GetAssetsFilters + `${this.searchText}` +
            `&assetCategory=${this.assetCategoryId}&department=${this.departmentId}` +
            `&pageSize=${this.pageSize}&pageNumber=${this.pageNumber}`
        )
        .then(function (response) {
          var listAssets = response.data.data;
          listAssets.forEach((asset) => {
            //Set các thuộc tính
            var startUseYear = asset.useDate.substring(0, 4); //Năm mua
            var currentYear = new Date().getFullYear(); //Năm hiện tại
            var rate = asset.depreciationRate; //Tỷ lệ hao mòn
            var cost = asset.cost; //Nguyên giá
            asset.selected = false; //Tích checkbox hay không (mặc định là không)
            asset.annualDepreciation = rate * cost; //Giá trị hao mòn năm
            asset.accumulatedDepreciation =
              (currentYear - startUseYear) * rate * cost; //Khấu hao lũy kế = (Năm hiện tại - năm bắt đầu sử dụng) * giá trị hao mòn năm
            asset.remainingValue = asset.cost - asset.accumulatedDepreciation; //Giá trị còn lại
            me.listAssets.push(asset);
          });
          me.totalRecords = response.data.totalRecords;
          // setTimeout(function () {
          //   me.showLoader = false;
          // }, 500);
          me.showLoader = false;
        })
        .catch(function (e) {
          console.log(e);
        });
    },

    btnRefreshOnClick(){
      // var me = this;
      
      // me.formMode = null, //add, edit, copy
      // me.selectedId = null, //Biến hứng id của tài sản được chọn gửi về từ AssetTable

      // me.pageSize = 20,
      // me.pageNumber = 1,
      // me.searchText = "", // Từ khóa tìm kiếm
      // me.assetCategoryName = "", //Tên loại tài sản được chọn từ combobox, lấy ra để lọc
      // me.assetCategoryId = "", //Mã loại tài sản được chọn từ combobox, lấy ra để lọc
      // me.departmentName = "", //Bộ phận được chọn từ combobox, lấy ra để lọc
      // me.departmentId = "", //Mã bộ phận được chọn từ combobox, lấy ra để lọc


      // me.toastMsg = "", //Thông điệp hiển thị ở toast

      // me.loadData();

      //Refesh lại trang
      window.location.reload();

    },

    /**
     * Nhấn vào btn Xóa
     * CreatedBy: VDDong (26/06/2022)
     */
    btnDeleteOnClick() {
      //Đếm số bản ghi đã chọn
      var count = this.$refs.table.selectedAsset.length;
      //Lấy ra bản ghi (trong trường hợp chọn 1 bản ghi)
      var asset = this.$refs.table.selectedAsset[0]; //Bên AssetTable đang làm cách tích vào đúng checkbox mới tính là chọn bản ghi nên chuyển selectedAsset thành mảng (nên xóa 1 cần lấy [0]), nếu đổi về cách làm kiểu chọn dòng là tự tích checkbox thì bỏ [0] đi

      if (count > 0) { //Có chọn bản ghi để xóa
        var popupText;
        if (count > 1){ //Xóa nhiều bản ghi
          if(count < 10) popupText = [`0${count} ${Resources.Notice.ConfirmMultiDelete}`,];
          else popupText = [
            `${count} ` + Resources.Notice.ConfirmMultiDelete,
          ];
        }
        else //Xóa 1 bản ghi
          popupText = [
            Resources.Notice.ConfirmSingleDelete + ` ${asset.assetCode} - ${asset.assetName}?`,
          ];
        //Hiển thị popup
        this.popupInfo.displayed = true;
        this.popupInfo.text = popupText;
        this.popupInfo.subBtn = false;
        this.popupInfo.outlineBtn = true;
        this.popupInfo.mainBtnText = Resources.TextBtn.Delete;
        this.popupInfo.outlineBtnText = Resources.TextBtn.No;
        this.popupInfo.action = Enums.Action.Delete;
      }
      else { //Không có bản ghi nào được chọn
        this.popupInfo.displayed = true;
        this.popupInfo.text = [Resources.Notice.AlertClickToDelete];
        this.popupInfo.subBtn = false;
        this.popupInfo.outlineBtn = false;
        this.popupInfo.mainBtnText = Resources.TextBtn.Close;
        this.popupInfo.action = "";

      }
    },


    /**
     * Nhắn vào btn Thêm
     * CreatedBy: VDDong (26/06/2022)
     */
    btnAddOnClick() {
      //Hiển thị form chi tiết
      this.showDialog = true;
      this.formMode = Enums.FormMode.Add;
      this.selectedId = null;
    },

    /**
     * Nhắn vào btn Thêm
     * CreatedBy: VDDong (13/07/2022)
     */
    btnEditOnClick(assetId) {
      //Hiển thị form chi tiết
      this.showDialog = true;
      this.formMode = Enums.FormMode.Edit;
      this.selectedId = assetId;
    },

    /**
     * Nhắn vào btn Nhân bản
     * CreatedBy: VDDong (13/07/2022)
     */
    btnCopyOnClick(assetId) {
      //Hiển thị form chi tiết
      this.showDialog = true;
      this.formMode = Enums.FormMode.Copy;
      this.selectedId = assetId;
    },

    /**
     * Double click vào dòng để xem chi tiết bản ghi (chế độ chỉ xem)
     * Created by: VDDong (27/06/2022)
     */
    btnViewOnClick(assetId) {
      //Hiển thị form chi tiết
      this.showDialog = true;
      this.formMode = Enums.FormMode.View;
      this.selectedId = assetId;
    },

    /**
     * Nút hủy ở dialog AssetDetail
     * CreatedBy: VDDong (13/07/2022)
     */
    btnCancelOnClick(action){
      //Popup cảnh báo có sự thay đổi dữ liệu
      if (action == Enums.Action.Put) {
        this.popupInfo.displayed = true;
        this.popupInfo.text = [
          Resources.Notice.ConfirmCancelEdit,
        ];
        this.popupInfo.subBtn = true;
        this.popupInfo.outlineBtn = true;
        this.popupInfo.mainBtnText = Resources.TextBtn.Save;
        this.popupInfo.subBtnText = Resources.TextBtn.DontSave;
        this.popupInfo.outlineBtnText = Resources.TextBtn.Cancel;
        this.popupInfo.action = Enums.Action.Put;
      } 
      //Show cảnh báo trong trường hợp khai báo tài sản mới
      else {
        this.popupInfo.displayed = true;
        this.popupInfo.text = [Resources.Notice.ConfirmCancelAdd];
        this.popupInfo.subBtn = false;
        this.popupInfo.outlineBtn = true;
        this.popupInfo.mainBtnText = Resources.TextBtn.Cancel;
        this.popupInfo.outlineBtnText = Resources.TextBtn.No;
        this.popupInfo.action = Enums.Action.Post;
      }
    },

   /**
   * Hiển thị popup validate dữ liệu không hợp lệ
   * msgs bao gồm cả lỗi từ backend và client (validate client trước)
   * CreatedBy: VDDong (13/07/2022)
   */
    showValidateError(msgs){
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
     * Hiện thị popup thông báo xác nhận thêm các bản ghi từ file excel
     * Created by: VDDong (24/06/2022)
     */
    showPopupConfirmAddRecordsFromExcel(totalRecords, fileName) {
      //Hiển thị popup
      this.popupInfo.displayed = true;
      this.popupInfo.text = [
        `Bạn có muốn thêm ${totalRecords} bản ghi từ file ${fileName} không?`,
      ];
      this.popupInfo.subBtn = false;
      this.popupInfo.outlineBtn = true;
      this.popupInfo.mainBtnText = "Thêm";
      this.popupInfo.outlineBtnText = Resources.TextBtn.No;
      this.popupInfo.action = Enums.Action.AddRecordsFromExcel;
    },

    /**
     * Hiển thị popup thông báo sau khi thêm các bản ghi từ file excel
     * Created by: VDDong (27/06/2022)
     */
    showPopupNoticeFromExcel(listMsgs) {
      //Hiển thị popup
      this.popupInfo.displayed = true;
      this.popupInfo.text = listMsgs;
      this.popupInfo.subBtn = false;
      this.popupInfo.outlineBtn = false;
      this.popupInfo.mainBtnText = Resources.TextBtn.Close;
      this.popupInfo.action = Enums.Action.ValidateError;
    },

    /**
     * Hàm thay đổi số lượng bản ghi trên một trang
     * pageSize truyền từ AssetTable sang
     * CreatedBy: VDDong (13/07/2022)
     */
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.loadData();
    },

    /**
     * Hàm thay đổi trang
     * pageNumber truyền từ AssetTable sang
     * CreatedBy: VDDong (13/07/2022)
     */
    changePageNumber(pageNumber){
      this.pageNumber = pageNumber;
      this.loadData();
    },

    /**
     * Hàm xử lý tìm kiếm
     * CreatedBy: VDDong (26/04/2022)
     */
    typingSearch(searchText) {
      console.log(searchText, "searchText");
      //Lấy ra giá trị từ khoá cần tìm kiếm
      this.searchText = searchText;
      //Quay về trang đầu tiên
      this.$refs.table.currentPage = 1;
      //Load lại dữ liệu sau khi dừng nhập 0,5s
      clearTimeout(this.timer);
      this.timer = setTimeout(this.loadData, 500);
      
    },

    /**
     * Lọc theo loại tài sản
     * CreatedBy: VDDong (26/06/2022)
     */
    filterCategory(id, value) {
      //Lấy ra giá trị của loại tài sản để lọc
      this.assetCategoryName = value;
      this.assetCategoryId = id;
      //Quay về trang đầu tiên
      this.$refs.table.currentPage = 1;
      //Load lại dữ liệu
      this.loadData();
    },
    /**
     * Lọc theo bộ phận sử dụng
     * CreatedBy: VDDong (26/06/2022)
     */
    filterDepartment(id, value) {
      //Lấy ra giá trị của bộ phận để lọc
      this.departmentName = value;
      this.departmentId = id;
      //Quay về trang đầu tiên
      this.$refs.table.currentPage = 1;
      //Load lại dữ liệu
      this.loadData();
    },

    /**
     * Show toast message
     * CreatedBy: VDDong (13/07/2022)
     */
    showToastMessage(msg){
      //Show toast message
      this.showToast = true;
      this.toastMsg = msg;
      //Ẩn sau 4s
      setTimeout(() => {
        this.showToast = false;
      }, 4000);
    },

    /**
     * Bật tắt show loading
     * Created by: VDDong (05/07/2022)
     */
    showLoading(status) {
      var me = this;
      me.showLoader = status;
    },

  },

};
</script>