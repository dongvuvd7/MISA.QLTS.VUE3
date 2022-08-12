<template>
  <div id="selectAsset">
    <div class="dialog-modal"></div>
    <div class="dialog">
      <div class="dialog-body">
        <div class="dialog-title">
          <div class="dialog-title-text">Chọn tài sản ghi tăng</div>
          <div class="icon-x" @click="$emit('closeSelectAsset')"></div>
        </div>
        <div class="dialog-content">
          <div class="dialog-table-header">
            <!--Thanh input tìm kiếm -->
            <base-input
              :placeholder="'Tìm kiếm theo Mã, tên tài sản'"
              :withIcon="true"
              :icon="'icon-search-black'"
              :value="searchText"
              :fieldName="'searchAssets'"
              @searching="typingSearch"
            />
          </div>
          <!-- end dialog-table-header -->
          <div
            class="table-wrapper"
            :style="{
              'min-height': listAssets.length == 0 ? '50%' : 'unset',
            }"
          >
            <!-- Nếu không có dữ liệU thì hiện text 'Không có dữ liệu' -->
            <div class="no-content" v-if="listAssets.length == 0">
              Không có tài sản nào
            </div>
            <!-- Table hiển thị danh sách tài sản -->
            <table
              id="tblAsset"
              cellpadding="0"
              :class="{ 'table-empty': listAssets.length == 0 }"
            >
              <!-- thead -->
              <thead>
                <tr>
                  <th class="text-center" style="width: 40px">
                    <input
                      type="checkbox"
                      v-model="selectAll"
                      @click="toggleSelectAll"
                    />
                  </th>
                  <th style="width: 50px" class="text-center">STT</th>
                  <th
                    style="min-width: 90px; max-width: 90px"
                    class="text-left"
                  >
                    Mã tài sản
                  </th>
                  <th style="min-width: 150px" class="text-left">
                    Tên tài sản
                  </th>
                  <th style="min-width: 180px" class="text-left">
                    Bộ phận sử dụng
                  </th>

                  <th
                    style="min-width: 110px; max-width: 110px"
                    class="text-right"
                  >
                    Nguyên giá
                  </th>
                  <th
                    style="min-width: 110px; max-width: 110px"
                    class="text-right"
                  >
                    Hao mòn năm
                  </th>
                  <th
                    style="min-width: 110px; max-width: 110px"
                    class="text-right"
                  >
                    Giá trị còn lại
                  </th>
                </tr>
              </thead>
              <!-- tbody -->
              <tbody>
                <tr
                  v-for="(asset, index) in listAssets"
                  :key="index"
                  :class="{ 'selected-row': asset.selected }"
                  @click.exact="selectRow(asset, index)"
                  @click.ctrl="ctrlSelectRow(asset, index)"
                  @click.shift="shiftSelectRow(index)"
                >
                  <td class="text-center">
                    <input type="checkbox" v-model="asset.selected" />
                  </td>
                  <td class="text-center">
                    {{ (currentPage - 1) * pageSize + index + 1 }}
                  </td>
                  <td class="text-left">{{ asset.assetCode }}</td>
                  <td class="text-left">{{ asset.assetName }}</td>
                  <td class="text-left" style="max-width: 170px">
                    {{ asset.departmentName }}
                  </td>
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
                    colspan="8"
                    style="background-color: #fff; padding: 0; border: none"
                  ></td>
                </tr>
              </tbody>
              <!-- tfoot -->
              <tfoot v-if="listAssets.length > 0">
                <tr>
                  <td class="text-left" colspan="8">
                    <div class="table-footer-left">
                      <!-- Tổng số bản ghi -->
                      <div class="total-record">
                        <span>Tổng số: </span>
                        <span class="bold">{{ totalRows }}</span>
                        <span> bản ghi</span>
                      </div>
                      <!-- Kích thước trang -->
                      <div class="page-size">
                        <select
                          name="pageSize"
                          id="pageSize"
                          v-model="pageSize"
                        >
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="30">30</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
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
                        @click="
                          currentPage = Math.min(totalPage, currentPage + 1)
                        "
                      >
                        <div class="icon-next-page"></div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <!-- end table-wrapper -->
        </div>
        <!-- end dialog-content -->
      </div>
      <!-- end dialog-body -->
      <div class="dialog-footer">
        <base-button-text
          :text="'Hủy bỏ'"
          :btnType="'white-btn'"
          @click="$emit('closeSelectAsset')"
        />
        <base-button-text :text="'Đồng ý'" @click="btnSaveOnClick" />
      </div>
      <!-- end dialog-footer -->
    </div>
    <!-- end dialog -->
  </div>
</template>

<script>
import axios from "axios";
import numeral from "numeral";
import Paginate from "vuejs-paginate";

import Resources from "../../components/common/resource.js";

import BaseInput from "../../components/base/BaseInput.vue";
import BaseButtonText from "../../components/base/BaseButtonText.vue";

export default {
  components: {
    BaseInput,
    Paginate,
    BaseButtonText,
  },

  props: {
    //Danh sách những tài sản liên kết với chứng từ đang xét
    currentSelectedAssets: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  data() {
    return {
      listAssets: [], //Danh sách tài sản
      selectedIndex: -1, //Vị trí tài sản đã chọn
      selectAll: false, //Check box chọn tất cả tài sản
      countSelected: 0, //Đếm số tài sản đã chọn
      pageSize: 20, //Số bản ghi / 1 trang
      currentPage: 1, //Trang hiện tại
      totalPage: 1, //Tổng số trang
      searchText: "", //Từ khóa tìm kiếm
      totalRows: 0, //Tổng số bản ghi
      selectedAssets: [], //Danh sách tài sản đã chọn
    };
  },

  created() {
    //Danh sách tài sản đã chọn từ trước truyền từ LicenseDetail sang (form sửa)
    this.selectedAssets = this.currentSelectedAssets;
    //Lấy danh sách tài sản hiển thị ra bảng
    this.loadData();
  },

  watch: {
    /**
     * Theo dõi biến đếm số dòng được chọn
     * Created by: VDDong (11/08/2022)
     */
    countSelected(value) {
      //Nếu số dòng được chọn bằng kích thước của danh sách thì chọn checkbox chọn tất cả
      if (value == this.listAssets.length) this.selectAll = true;
      else this.selectAll = false;
    },
    /**
     * Theo dõi biến số trang hiện tại
     * Nếu có sự thay đổi thì load lại data
     * Created by: VDDong (11/08/2022)
     */
    currentPage() {
      this.loadData(); //Load lại data
      this.selectAll = false; //Bỏ chọn checkbox chọn tất cả
    },
    /**
     * Theo dõi số bản ghi / 1 trang thì
     * Created by: VDDong (11/08/2022)
     */
    pageSize() {
      if (this.currentPage == 1) this.loadData(); //Nếu là trang đầu thì load lại data
      this.currentPage = 1; //Nếu không phải trang đầu thì set về trang đầu (thay đổi currentPage sẽ load lại data)
    },
  },

  methods: {
    /**
     * Load dữ liệu danh sách tài sản
     * Created by: VDDong (11/08/2022)
     */
    loadData() {
      //Gọi api lấy dữ liệu
      var me = this;
      me.listAssets = [];
      axios
        .get(
          Resources.API.GetAssetsFilters +
            `${this.searchText}` +
            `&pageSize=${this.pageSize}&pageNumber=${this.currentPage}`
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
            asset.costDetail = ""; //Chi tiết nguyên giá
            me.listAssets.push(asset);
            //Tự tích checkbox những tài sản đã chọn (khi sửa chứng từ)
            if (
              me.selectedAssets.filter((a) => a.assetCode === asset.assetCode)
                .length > 0
            ) {
              asset.selected = true;
            }
          });
          me.totalRows = response.data.totalRecords; //Tổng số bản ghi
          me.totalPage = Math.ceil((1.0 * me.totalRows) / me.pageSize); //Tổng số trang
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    /**
     * Chọn 1 dòng
     * Created by: VDDong (11/08/2022)
     */
    selectRow(clickedAsset, index) {
      this.selectedIndex = index; //Đánh dấu vị trí dòng đang chọn chọn
      //Bỏ chọn tất cả
      this.listAssets.forEach((asset) => {
        asset.selected = false;
      });
      //Chọn dòng vừa click
      clickedAsset.selected = true;
      this.countSelected = 1;
      //Cập nhật mảng chứa các tài sản đã chọn
      this.selectedAssets = [];
      this.selectedAssets.push(clickedAsset);
    },

    /**
     * Chọn nhiều dòng bằng Ctrl
     * Created by: VDDong (11/08/2022)
     */
    ctrlSelectRow(clickedAsset, index) {
      this.selectedIndex = index; //Đánh dấu vị trí dòng đang chọn chọn
      //Chọn dòng vừa click
      clickedAsset.selected = !clickedAsset.selected;
      //Cập nhật số dòng được chọn
      if (!clickedAsset.selected) {
        //Nếu bỏ chọn
        this.countSelected--;
        const removeIndex = this.selectedAssets.findIndex(
          (asset) => asset.assetCode === clickedAsset.assetCode
        );
        this.selectedAssets.splice(removeIndex, 1);
      } else {
        //Nếu chọn
        this.countSelected++;
        this.selectedAssets.push(clickedAsset);
      }
    },

    /**
     * Chọn nhiều dòng bằng Shift
     * Created by: VDDong (11/08/2022)
     */
    shiftSelectRow(index) {
      //Chọn tất cả các dòng giữa 2 index
      if (index < this.selectedIndex) {
        //Nếu index click nhỏ hơn index hiện tại
        for (var i = index; i < this.selectedIndex; i++) {
          //Nếu bản ghi chưa được chọn thì chọn
          if (!this.listAssets[i].selected) {
            this.listAssets[i].selected = true;
            this.countSelected++;
            this.selectedAssets.push(this.listAssets[i]); //cập nhật mảng các tài sản đã chọn
          }
        }
      } else {
        //Nếu index click lớn hơn index hiện tại
        for (i = index; i > this.selectedIndex; i--) {
          //Nếu bản ghi chưa được chọn thì chọn
          if (!this.listAssets[i].selected) {
            this.listAssets[i].selected = true;
            this.countSelected++;
            this.selectedAssets.push(this.listAssets[i]); //cập nhật mảng các tài sản đã chọn
          }
        }
      }
      //Cập nhật index hiện tại
      this.selectedIndex = index;
    },

    /**
     * Tích chọn checkbox chọn tất cả
     * Có thể ctrl chọn nhiều rồi sang trang khác chọn thì vẫn lưu các bản ghi đã tích chọn trước đó
     * (Chưa hiểu code này, hình như bug chọn hết rồi đổi trang bị lộn xộn là tại đây)
     * Created by: VDDong (11/08/2022)
     */
    toggleSelectAll() {
      this.selectAll = !this.selectAll;
      //Cập nhật số dòng được chọn
      if (this.selectAll) this.countSelected = this.listAssets.length;
      else this.countSelected = 0;
      //Chọn tất cả các dòng
      this.listAssets.forEach((asset) => {
        //? chưa hiểu đoạn này
        const removeIndex = this.listAssets.findIndex(
          (a) => a.assetCode === asset.assetCode
        );
        this.selectedAssets.splice(removeIndex, 1);
        asset.selected = this.selectAll;
        if (asset.selected) {
          this.selectedAssets.push(asset);
        }
      });
    },

    /**
     * Nhấn nút Lưu thì chọn các tài sản đã chọn checkbox (lưu trong mảng selectedAssets)
     * Created by: VDDong (12/08/2022)
     */
    btnSaveOnClick() {
      this.$emit("updateListAssets", this.selectedAssets);
      this.$emit("closeSelectAsset");
    },

    /**
     * Tìm kiếm tài sản
     * Created by: VDDong (11/08/2022)
     */
    typingSearch(searchText) {
      //Quay về trang đầu tiên
      this.currentPage = 1;
      //Từ khóa tìm kiếm
      this.searchText = searchText;
      //Load lại dữ liệu
      this.loadData();
    },

    /**
     * Định dạng số
     * Created by: VDDong (11/08/2022)
     */
    formatNumber(value) {
      return numeral(value).format("0,0");
    },
  },
};
</script>
