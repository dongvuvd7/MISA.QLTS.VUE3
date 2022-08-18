<template>
  <div>
    <!-- Table Chứng từ -->
    <div class="table-wrapper-top">
      <!-- Thanh chức năng bảng Chứng từ -->
      <div class="content-top">
        <div class="content-top-left">
          <!-- Input Tìm kiếm -->
          <base-input
            :placeholder="'Tìm kiếm theo số chứng từ, nội dung'"
            :withIcon="true"
            :icon="'icon-search-black'"
            :value="searchText"
            :fieldName="'searchLicenses'"
            @searching="typingSearch"
          />
        </div>
        <div class="content-top-right">
          <div
            class="icon-delete"
            v-if="countSelected > 1"
            @click="btnDeleteOnClick({})"
            title="Xóa nhiều chứng từ"
          ></div>
          <div class="icon-print" style="margin-left: 20px"></div>
          <div class="icon-vertical-dot" style="margin-left: 20px"></div>
        </div>
      </div>
      <!-- Table hiển thị thông tin Chứng từ -->
      <div
        class="table-wrapper"
        :style="{ 'min-height': licenses.length == 0 ? '100%' : 'unset' }"
      >
        <!-- Nếu không có dữ liệu thì hiển thị text 'Không có dữ liệu' -->
        <div class="no-content" v-if="licenses.length == 0">
          Không có dữ liệu
        </div>
        <!-- Table hiển thị danh sách Chứng từ -->
        <table
          id="tblLicense"
          cellpadding="0"
          :class="{ 'table-empty': licenses.length == 0 }"
        >
          <!-- Table header -->
          <thead>
            <tr>
              <th class="text-center" style="width: 40px">
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @click="toggleSelectAll"
                />
              </th>
              <th style="width: 50px" class="text-center" title="Số thứ tự">STT</th>
              <th style="width: 90px" class="text-left">Số chứng từ</th>
              <th style="width: 150px">Ngày chứng từ</th>
              <th style="width: 150px">Ngày ghi tăng</th>
              <th style="width: 180px" class="text-right">Tổng nguyên giá</th>
              <th class="text-left">Nội dung</th>
              <th style="width: 100px" class="text-center"></th>
            </tr>
          </thead>
          <!-- Table body -->
          <tbody>
            <tr
              v-for="(license, index) in licenses"
              :key="index"
              @dblclick="btnEditOnClick(license.licenseId)"
              @click.exact="selectRow(license, index)"
              @click.ctrl="ctrlSelectRow(license, index)"
              @click.shift="shiftSelectRow(index)"
              :class="{ 'selected-row': license.selected }"
            >
              <td class="text-center">
                <input type="checkbox" v-model="license.selected" />
              </td>
              <td class="text-center">
                {{ (currentPage - 1) * pageSize + index + 1 }}
              </td>
              <td class="text-left" style="color: #25a0ed">
                {{ license.licenseCode }}
              </td>
              <td class="text-center">
                {{ formatDate(license.licenseDate) }}
              </td>
              <td class="text-center">
                {{ formatDate(license.writeDate) }}
              </td>
              <td class="text-right" style="width: 150px">
                {{ formatNumber(license.totalCost) }}
              </td>
              <td class="text-left" :title="license.note">{{ license.note }}</td>
              <td class="text-center" style="width: 100px; overflow: visible">
                <div class="function-container">
                  <div
                    class="icon-edit"
                    @click="btnEditOnClick(license.licenseId)"
                    title="Sửa chứng từ"
                  ></div>
                  <div
                    class="icon-delete"
                    @click="btnDeleteOneOnClick(license)"
                    title="Xóa chứng từ"
                  ></div>
                </div>
              </td>
            </tr>
            <!-- Trick để ngăn phần paging co lên khi số bản ghi ít -->
            <tr id="tr-empty" style="height: 100%">
              <td
                colspan="11"
                style="background-color: #fff; padding: 0; border: none"
              ></td>
            </tr>
          </tbody>
          <!-- Table footer -->
          <tfoot v-if="licenses.length > 0">
            <tr style="position: sticky; bottom: 38px; height: 40px">
              <td class="text-left" colspan="5"></td>
              <td class="text-right bold">
                {{ formatNumber(sum("totalCost")) }}
              </td>
              <td></td>
              <td></td>
            </tr>

            <tr>
              <td class="text-left" colspan="5">
                <div class="table-footer-left">
                  <!-- Tổng số bản ghi -->
                  <div class="total-record">
                    <span>Tổng số: </span>
                    <span class="bold">{{ totalRows }}</span>
                    <span> bản ghi</span>
                  </div>
                  <!-- Kích thước trang -->
                  <div class="page-size">
                    <select name="pageSize" id="pageSize" v-model="pageSize">
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                  <!-- Phân trang -->
                  <div
                    class="btn-prev-page"
                    @click="currentPage = Math.max(1, currentPage - 1)"
                  >
                    <div class="icon-prev-page"></div>
                  </div>
                  <paginate
                    v-model="currentPage"
                    :page-count="totalPage"
                    :page-range="3"
                    :margin-pages="1"
                    :prev-text="''"
                    :next-text="''"
                    :container-class="'pagination'"
                    :page-class="'page-item'"
                  >
                  </paginate>
                  <div
                    class="btn-next-page"
                    @click="currentPage = Math.min(totalPage, currentPage + 1)"
                  >
                    <div class="icon-next-page"></div>
                  </div>
                </div>
              </td>
              <td colspan="3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <!-- Table Tài sản tương ứng Chứng từ -->
    <div class="table-wrapper-bottom">
      <div class="content-top">
        <div class="content-top-left">Thông tin chi tiết</div>
        <div class="content-top-right">
          <div class="icon-maximize"></div>
        </div>
      </div>
      <div
        class="table-wrapper"
        :style="{ 'min-height': listAssets.length == 0 ? '50%' : 'unset' }"
      >
        <table
          id="tblAsset"
          cellpadding="0"
          :class="{ 'table-empty': listAssets.length == 0 }"
        >
          <!-- Table header -->
          <thead>
            <tr>
              <th style="width: 50px" class="text-center" title="Số thứ tự">STT</th>
              <th style="min-width: 90px; max-width: 90px" class="text-left">
                Mã tài sản
              </th>
              <th style="min-width: 150px" class="text-left">Tên tài sản</th>
              <th style="max-width: 150px" class="text-left">Loại tài sản</th>
              <th style="min-width: 180px" class="text-left">
                Bộ phận sử dụng
              </th>
              <th style="min-width: 80px; max-width: 80px" class="text-right">
                Số lượng
              </th>
              <th style="min-width: 110px; max-width: 110px" class="text-right">
                Nguyên giá
              </th>
              <th style="min-width: 110px; max-width: 110px" class="text-right">
                Hao mòn năm
              </th>
              <th style="min-width: 110px; max-width: 110px" class="text-right">
                Giá trị còn lại
              </th>
            </tr>
          </thead>
          <!-- Table body -->
          <tbody>
            <tr v-for="(asset, index) in listAssets" :key="index">
              <td class="text-center">
                {{ index + 1 }}
              </td>
              <td class="text-left" :title="asset.assetCode">{{ asset.assetCode }}</td>
              <td class="text-left" :title="asset.assetName">{{ asset.assetName }}</td>
              <td class="text-left" style="max-width: 170px" :title="asset.assetCategoryName">
                {{ asset.assetCategoryName }}
              </td>
              <td class="text-left" style="max-width: 170px" :title="asset.departmentName">
                {{ asset.departmentName }}
              </td>
              <td class="text-right">{{ asset.quantity }}</td>
              <td class="text-right">
                {{ formatNumber(asset.cost) }}
              </td>
              <td class="text-right">
                {{ formatNumber(asset.annualDepreciation) }}
              </td>
              <td class="text-right">
                {{ formatNumber(asset.remainingValue) }}
              </td>
            </tr>
            <!-- Trick để ngăn phần paging co lên khi số bản ghi ít -->
            <tr id="tr-empty" style="height: 100%">
              <td
                colspan="11"
                style="background-color: #fff; padding: 0; border: none"
              ></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { bus } from "../../main";
import numeral from "numeral";
import moment from "moment";
import Paginate from "vuejs-paginate";

import Resource from "../../components/common/resource";

import BaseInput from "../../components/base/BaseInput.vue";

export default {
  components: {
    BaseInput,
    Paginate,
  },

  props: {
    //Mảng chứa các bản ghi Chứng từ
    licenses: {
      type: Array,
      default() {
        return [];
      },
    },
    //Tổng số bản ghi Chứng từ
    totalRows: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      selectedIndex: -1, //Vị trí chứng từ được chọn
      selectAll: false, //Chọn tất cả chứng từ
      countSelected: 0, //Đếm số chứng từ được chọn
      selectedLicense: {}, //Chứng từ được chọn
      pageSize: 10, //Số lượng bản ghi Chứng từ trên một trang
      currentPage: 1, //Trang hiện tại bảng Chứng từ
      totalPage: 1, //Tổng số trang bảng Chứng từ
      searchText: "", //Từ khóa tìm kiếm Chứng từ
      listAssets: [], //Danh sách tài sản
    };
  },

  created() {
    //Khai báo sự kiện deleteLicenses tại bus
    bus.$on("deleteLicenses", this.deleteLicenses);
  },

  updated() {
    /**
     * Khi có cập nhật thì tính lại số trang
     * Created by: VDDong (09/08/2022)
     */
    this.totalPage = Math.ceil(this.totalRows / this.pageSize);
  },

  watch: {
    /**
     * Theo dõi biến đếm số dòng được chọn
     * Created by: VDDong (09/08/2022)
     */
    countSelected(value) {
      //Nếu số dòng được chọn bằng kích thước của danh sách thì chọn checkbox chọn tất cả và ngược lại
      if (value == this.licenses.length) this.selectAll = true;
      else this.selectAll = false;
    },
    /**
     * Theo dõi biến số trang hiện tại
     * Created by: VDDong (09/08/2022)
     */
    currentPage(value) {
      //Reset bảng tài sản tương ứng bên dưới
      this.listAssets = [];
      //Emit event changePageNumber cho component cha
      this.$emit("changePageNumber", value);
      this.selectAll = false;
    },
    /**
     * Theo dõi biến kích thước trang
     * Created by: VDDong (09/08/2022)
     */
    pageSize(value) {
      //Reset bảng tài sản tương ứng bên dưới
      this.listAssets = [];
      //Quay về trang đầu
      this.currentPage = 1;
      //Emit event changePageSize cho component cha
      this.$emit("changePageSize", value);
    },
  },

  methods: {
    /**
     * Click vào dòng 1 bản ghi Chứng từ
     * Created by: VDDong (09/08/2022)
     */
    selectRow(clickedLicense, index) {
      //Vị trí dòng vừa click
      this.selectedIndex = index;
      //Bỏ chọn những dòng khác
      this.licenses.forEach((license) => {
        license.selected = false;
      });
      //Chọn dòng vừa click
      clickedLicense.selected = true;
      //Đếm số dòng được chọn
      this.countSelected = 1;
      //Load danh sách tài sản tương ứng với chừng từ vừa chọn và hiển thị xuống bảng bên dưới
      this.loadAssetListByLicense(clickedLicense.licenseId);
    },

    /**
     * Chọn nhiều dòng bằng ctrl
     * Created by: VDDong (09/08/2022)
     */
    ctrlSelectRow(clickedLicense, index) {
      //Chọn dòng vừa click
      this.selectedIndex = index;
      //ctrl vào dòng đó thì chọn, ctrl tiếp thì bỏ chọn
      clickedLicense.selected = !clickedLicense.selected;
      //Cập nhật số dòng được chọn
      if (!clickedLicense.selected) this.countSelected--;
      else this.countSelected++;
    },

    /**
     * Chọn nhiều dòng bằng shift
     * Created by: VDDong (09/08/2022)
     */
    shiftSelectRow(index) {
      //Chọn tất cả các dòng giữa 2 index
      if (index < this.selectedIndex)
        //Nếu index click nhỏ hơn index hiện tại
        for (var i = index; i < this.selectedIndex; i++) {
          if (!this.licenses[i].selected) {
            this.licenses[i].selected = true;
            this.countSelected++;
          }
        }
      //Nếu index click lớn hơn index hiện tại
      else
        for (i = index; i > this.selectedIndex; i--) {
          if (!this.licenses[i].selected) {
            this.licenses[i].selected = true;
            this.countSelected++;
          }
        }
      this.selectedIndex = index; //Cập nhật index hiện tại
    },

    /**
     * Click vào checkbox chọn tất cả
     * Created by: VDDong (09/08/2022)
     */
    toggleSelectAll() {
      this.selectAll = !this.selectAll;
      //Cập nhật số dòng được chọn
      if (this.selectAll) this.countSelected = this.licenses.length;
      else this.countSelected = 0;
      //Tích/bỏ tích tất cả các dòng
      this.licenses.forEach((asset) => {
        asset.selected = this.selectAll;
      });
    },

    /**
     * Gõ ô input tìm kiếm chứng từ
     * Created by: VDDong (09/08/2022)
     */
    typingSearch(searchText) {
      //Quay về trang đầu tiên
      this.currentPage = 1;
      //Emit sự kiện search bên LicenseList
      this.$emit("search", searchText);
    },

    /**
     * Click nút sửa trên từng dòng bản ghi Chứng từ
     * Created by: VDDong (09/08/2022)
     */
    btnEditOnClick(licenseId) {
      this.$emit("btnEditOnClick", licenseId);
    },

    /**
     * Click nút xóa nhiều
     * Created by: VDDong (09/08/2022)
     */
    btnDeleteOnClick(license) {
      this.selectedLicense = license;
      this.$emit("btnDeleteOnClick");
    },

    /**
     * Click vào nút xóa đơn trên từng dòng bản ghi chứng từ
     * Created by: VDDong (16/08/2022)
     */
    btnDeleteOneOnClick(license) {
      var me = this;
      me.selectedLicense = license;
      me.$emit("btnDeleteOneOnClick", license);
    },

    /**
     * Thực thi xóa dữ liệu Chứng từ
     * Created by: VDDong (12/08/2022)
     */
    deleteLicenses() {
      var me = this;
      //Khởi tạo mảng chứa các id muốn xóa
      var idToDelete = [];
      //Nếu chứng từ có chọn checkbox thì thêm id chứng từ đó vào mảng muốn xóa
      this.licenses.forEach((license) => {
        if (license.selected) idToDelete.push(license.licenseId);
      });
      //Call api xóa dữ liệu
      axios
        .delete(Resource.API.DeleteLicenseByIds + `${idToDelete}`)
        .then(() => {
          //Emit event loadData để load lại dữ liệu
          bus.$emit("loadData");
          //Reset bảng hiện danh sách tài sản tương ứng
          me.listAssets = [];
          me.$emit("showToast", Resource.ToastMsg.DeleteSuccess);
        })
        .catch((error) => {
          console.log(error);
        });

      //Reset biến đếm các bản ghi đã chọn checkbox
      me.countSelected = 0;
    },

    /**
     * Lấy ra danh sách tài sản theo chứng từ
     * Show danh sách tài sản tương ứng chứng từ vào bảng Tài sản
     * Created by: VDDong (12/08/2022)
     */
    loadAssetListByLicense(licenseId) {
      var me = this;
      me.listAssets = [];
      axios
        .get(Resource.API.GetAssetsByLicenseId + `${licenseId}`)
        .then((response) => {
          var listAssets = response.data || [];
          //Set các thuộc tính cho từng tài sản
          listAssets.forEach((asset) => {
            var startUseYear = asset.useDate.substring(0, 4); //Năm mua
            var currentYear = new Date().getFullYear(); //Năm hiện tại
            var rate = asset.depreciationRate; //Tỷ lệ hao mòn
            var cost = asset.cost; //Nguyên giá
            asset.annualDepreciation = rate * cost; //Giá trị hao mòn năm
            asset.accumulatedDepreciation =
              (currentYear - startUseYear) * rate * cost; //Khấu hao lũy kế = (Năm hiện tại - năm bắt đầu sử dụng) * giá trị hao mòn năm
            asset.remainingValue = asset.cost - asset.accumulatedDepreciation; //Giá trị còn lại
            me.listAssets.push(asset);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * Tính tổng các giá trị
     * (Ở đây tính Tổng nguyên giá)
     * Created by: VDDong (09/08/2022)
     */
    sum(fieldName) {
      var total = 0;
      this.licenses.forEach((license) => {
        total += license[fieldName];
      });
      return total;
    },
    /**
     * Định dạng số
     * Created by: VDDong (09/08/2022)
     */
    formatNumber: function (value) {
      return numeral(value).format("0,0");
    },
    /**
     * Định dạng ngày tháng
     * Created by: VDDong (09/08/2022)
     */
    formatDate: function (value) {
      return moment(value).format("DD/MM/YYYY");
    },
    
  },
};
</script>

<style scoped>
.table-wrapper-top {
  height: 56vh;
  background-color: #fff;
  margin: 0 20px;
}
.content-top {
  padding-top: 15px;
  /* content-top ăn cả css của AssetList.css */
}
.table-wrapper-top .content-top-left {
  /* margin-left: 0px; */
}
.table-wrapper-top .table-wrapper {
  margin: 0;
  height: calc(100% - 65px);
  border: unset;
  border-radius: 0;
  box-shadow: none;
}
.no-content {
  top: 30%;
}

.table-wrapper-bottom {
  height: 27vh;
  background-color: #fff;
  margin: 0 20px;
  margin-top: 10px;
}

.table-wrapper-bottom .table-wrapper {
  margin: 0;
  height: calc(100% - 49px);
  border: unset;
  border-radius: 0;
  box-shadow: none;
}

.table-wrapper-bottom .content-top {
  font-weight: bold;
  font-size: 16px;
}
</style>