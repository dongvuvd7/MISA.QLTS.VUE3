<template>
  <div
    class="table-wrapper"
    :style="{
      'min-height': assets.length == 0 ? 'calc(100% - 20px)' : 'unset',
    }"
  >
    <!-- Nếu không có dữ liệU thì hiện text 'Không có dữ liệu' -->
    <div class="no-content" v-if="assets.length == 0">Không có dữ liệu</div>

    <!-- Nếu có dữ liệu thì hiện table -->
    <table
      id="tblAsset"
      cellpadding="0"
      :class="{ 'table-empty': assets.length == 0 }"
    >
      <thead>
        <tr>
          <th class="text-center" style="width: 40px">
            <input
              type="checkbox"
              v-model="selectAll"
              @click="toggleSelectAll"
              title="Chọn tất cả bản ghi của trang"
            />
          </th>
          <th style="width: 50px" class="text-center" title="Số thứ tự">STT</th>
          <th style="min-width: 90px; max-width: 90px" class="text-left">
            Mã tài sản
          </th>
          <th style="min-width: 150px" class="text-left">Tên tài sản</th>
          <th style="max-width: 150px" class="text-left">Loại tài sản</th>
          <th style="min-width: 180px" class="text-left">Bộ phận sử dụng</th>
          <th style="min-width: 80px; max-width: 80px" class="text-right">
            Số lượng
          </th>
          <th style="min-width: 110px; max-width: 110px" class="text-right">
            Nguyên giá
          </th>
          <th
            style="min-width: 110px; max-width: 110px"
            class="text-right"
            title="Hao mòn/Khấu hao lũy kế = (Năm hiện tại - Năm bắt đầu sử dụng) x Giá trị hao mòn năm"
          >
            HM/KH luỹ kế
          </th>
          <th
            style="min-width: 110px; max-width: 110px"
            class="text-right"
            title="Giá trị còn lại = Nguyên giá - HM/KH lũy kế"
          >
            Giá trị còn lại
          </th>
          <th class="text-center">Chức năng</th>
        </tr>
      </thead>

      <tbody>
        <!-- <tr
          v-for="(asset, index) in assets"
          :key="index"
          @click.ctrl="ctrlSelectRow(asset, index)"
          @click.shift="shiftSelectRow(index)"
          @dblclick="btnViewOnClick(asset.assetId)"
          :class="{
            'selected-row': asset.selected,
            'highlight-row': highLightRowCode.includes(asset.assetCode),
          }"
          tabindex="0"
        > -->
        <tr
          v-for="(asset, index) in assets"
          :key="index"
          @click.ctrl="ctrlSelectRow(asset, index)"
          @click.shift="shiftSelectRow(index)"
          @dblclick="btnViewOnClick(asset.assetId)"
          :class="{
            'selected-row': asset.selected,
            'highlight-row': highLightRowCode.includes(asset.assetCode),
          }"
          @contextmenu.prevent="rowTableOnRightClick(asset, index)"
          tabindex="0"
        >
          <td class="text-center">
            <input
              type="checkbox"
              v-model="asset.selected"
              @click="checkboxRecordOnClick(asset, index)"
            />
          </td>
          <td class="text-center">
            {{ (currentPage - 1) * pageSize + index + 1 }}
          </td>
          <td class="text-left">{{ asset.assetCode }}</td>
          <td class="text-left" :title="asset.assetName">
            {{ asset.assetName }}
          </td>
          <td
            class="text-left"
            style="max-width: 170px"
            :title="asset.assetCategoryName"
          >
            {{ asset.assetCategoryName }}
          </td>
          <td
            class="text-left"
            style="max-width: 170px"
            :title="asset.departmentName"
          >
            {{ asset.departmentName }}
          </td>
          <td class="text-right">
            {{ formatNumber(asset.quantity) }}
          </td>
          <td class="text-right">
            {{ formatNumber(asset.cost) }}
          </td>
          <td class="text-right">
            {{ formatNumber(asset.accumulatedDepreciation) }}
          </td>
          <td class="text-right">
            {{ formatNumber(asset.remainingValue) }}
          </td>
          <td class="text-center" style="max-width: 90px">
            <div class="function-container">
              <div
                class="icon-edit"
                title="Sửa"
                @click="btnEditOnClick(asset.assetId)"
              ></div>
              <div
                class="icon-copy"
                title="Nhân bản"
                @click="btnCopyOnClick(asset.assetId)"
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

      <tfoot v-if="assets.length > 0">
        <tr>
          <td class="text-left" colspan="6">
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
                  <option value="100">100</option>
                </select>

                <!-- <template>
                  <el-select v-model="pageSize" placeholder="Select">
                    <el-option
                      v-for="item in pageSizeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </template> -->
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
          <!-- Các ô tính tổng -->
          <td class="text-right bold" title="Tổng số lượng">
            {{ formatNumber(sum("quantity")) }}
          </td>
          <td class="text-right bold" title="Tổng nguyên giá">
            {{ formatNumber(sum("cost")) }}
          </td>
          <td class="text-right bold" title="Tổng HM/KH lũy kế">
            {{ formatNumber(sum("accumulatedDepreciation")) }}
          </td>
          <td class="text-right bold" title="Tổng giá trị còn lại">
            {{ formatNumber(sum("remainingValue")) }}
          </td>
          <td></td>
        </tr>
      </tfoot>
    </table>

    <base-context-menu
      :isShowContextMenu="viewMenuContext"
      :mcTop="mcTop"
      :mcLeft="mcLeft"
      :rightClickedAsset="rightClickedAsset"
      :rightClickedIndex="rightClickedIndex"
      @closeMenuContext="closeMenuContext()"
      @menuContextAddOnClick="menuContextAddOnClick"
      @menuContextEditOnClick="menuContextEditOnClick"
      @menuContextCopyOnClick="menuContextCopyOnClick"
    >
    </base-context-menu>
  </div>
</template>

<script>
import axios from "axios";
import { bus } from "../../main";
import numeral from "numeral";
import Paginate from "vuejs-paginate";

import Resources from "../../components/common/resource.js";

import BaseContextMenu from "../../components/base/BaseContextMenu.vue";

export default {
  components: {
    Paginate,

    BaseContextMenu,
  },

  props: {
    //Mảng chứa các tài sản để đưa lên table
    assets: {
      type: Array,
      default: null,
    },
    //Tổng số bản ghi
    totalRows: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      selectedIndex: -1, // Dòng bản ghi đang chọn
      selectAll: false, // Checkbox chọn tất cả
      countSelected: 0, //Đếm số bản ghi đang tích
      selectedAsset: [], //Tài sản được chọn checkbox (lưu thông giữa các trang)
      pageSize: 20, //Số bản ghi trên một trang
      currentPage: 1, //Trang hiện tại
      totalPage: 1, //Tổng số trang

      listRecordsOfCurrentPage: [], //Mảng chứa các bản ghi của trang hiện tại

      viewMenuContext: false, //Biến mở/đóng menu context
      mcTop: "0px", //margin-top của menu context
      mcLeft: "0px", //margin-left của menu context
      rightClickedAsset: null, //Tài sản click chuột phải truyền vào menu context
      rightClickedIndex: null, //số thứ tự (tính từ 0) của tài sản click chuột phải trên table truyền vào menu context

      listCheckedRecords: [], //Mảng chứa các bản ghi được check checkbox của trang hiện tại

      highLightRowCode: [], //Mảng chứa các bản ghi được highlight

      //Các options chọn số bản ghi / 1 trang
      pageSizeOptions: [
        {
          value: 5,
          label: "5",
        },
        {
          value: 10,
          label: "10",
        },
        {
          value: 20,
          label: "20",
        },
        {
          value: 30,
          label: "30",
        },
        {
          value: 50,
          label: "50",
        },
        {
          value: 100,
          label: "100",
        },
      ],
    };
  },

  created() {
    //Khởi tạo sự kiện deleteAssets trên bus
    bus.$on("delete", this.deleteAssets);
    //Khởi tạo sự kiện highLight dòng vừa thêm hoặc sửa trên bus
    bus.$on("hightLightRow", this.hightLightRow);
  },

  updated() {
    var me = this;
    //Khi có cập nhật thì tính lại số trang
    me.totalPage = Math.ceil(me.totalRows / me.pageSize);
  },

  watch: {
    /**
     * Theo dõi biến đếm số dòng được chọn
     * CreatedBy: VDDong(13/07/2022)
     */
    countSelected(value) {
      //Nếu số dòng được chọn bằng kích thước của danh sách thì chọn checkbox chọn tất cả
      if (value == this.assets.length) this.selectAll = true;
      else this.selectAll = false;
    },
    /**
     * Theo dõi biến số trang hiện tại
     * CreatedBy: VDDong(13/07/2022)
     */
    currentPage(value) {
      var me = this;
      //Emit event changePageNumber cho component cha
      me.$emit("changePageNumber", value);
      // me.selectAll = false;
    },
    /**
     * Theo dõi biến kích thước trang
     * CreatedBy: VDDong(13/07/2022)
     */
    pageSize(value) {
      //Quay về trang đầu
      this.currentPage = 1;
      //Emit event changePageSize cho component cha
      this.$emit("changePageSize", value);
    },

    /**
     * Theo dõi mảng các tài sản, khi đổi trang thì mảng này sẽ thay đổi (cập nhật các checkbox theo)
     * CreatedBy: VDDong(13/07/2022)
     */
    assets(value) {
      var me = this;
      me.selectAll = false;
      me.listCheckedRecords = []; //khởi tại lại mảng
      me.countSelected = 0; //reset đếm số dòng tích checkbox của 1 trang
      //Mảng listCheckedRecords là mảng chứa các tài sản của trang hiện tại mà id của nó có trong mảng selectedAsset
      me.listCheckedRecords = value.filter((asset) =>
        me.selectedAsset.map((x) => x.assetId).includes(asset.assetId)
      );
      //Tích checkbox cho các tài sản có trong mảng listCheckedRecords
      me.assets.forEach((asset, index) => {
        if (
          me.listCheckedRecords.map((x) => x.assetId).includes(asset.assetId)
        ) {
          me.assets[index].selected = true;
          me.countSelected++;
        } else {
          me.assets[index].selected = false;
          me.countSelected--;
        }
      });
    },
  },

  methods: {
    /**
     * Highlight dòng vừa thêm mới hoặc sửa
     * Created by: VDDong (09/07/2022)
     */
    hightLightRow(dataCode, timeActive) {
      var me = this;
      me.highLightRowCode = dataCode;
      setTimeout(() => {
        //query selector class highlight-row and remove it
        var highlightRow = document.querySelector(".highlight-row");
        if (highlightRow) highlightRow.classList.remove("highlight-row");
        //reset highLightRowCode
        me.highLightRowCode = [];
      }, timeActive);
    },

    /**
     * Chọn 1 dòng
     * CreatedBy: VDDong(13/07/2022)
     */
    selectRow(clickedAsset, index) {
      this.selectedIndex = index;
      //Bỏ chọn tất cả
      this.assets.forEach((asset) => {
        asset.selected = false;
      });
      //Chọn dòng vừa click
      clickedAsset.selected = !clickedAsset.selected;
      this.selectedAsset = clickedAsset;
      if (this.selectedAsset.selected) this.countSelected = 1;
      else this.countSelected = 0;
    },
    /**
     * Chọn nhiều dòng bằng ctrl
     * CreatedBy: VDDong(13/07/2022)
     */
    ctrlSelectRow(clickedAsset, index) {
      var me = this;
      //Chọn dòng vừa click
      me.selectedIndex = index;
      //Ctrl chọn rồi lại ctrl vào dòng đó thì bỏ chọn
      clickedAsset.selected = !clickedAsset.selected;
      //Cập nhật số dòng được chọn
      if (!clickedAsset.selected) {
        //Xóa asset vừa bỏ tích checkbox ra khỏi danh sách selectedAsset
        me.selectedAsset = me.selectedAsset.filter(
          (asset) => asset.assetId !== clickedAsset.assetId
        );
        //Giảm biến đếm số dòng được chọn
        me.countSelected--;
      } else {
        //Thêm asset vừa chọn vào selectedAsset
        me.selectedAsset.push(clickedAsset);
        //Tăng biến đếm số dòng được chọn
        me.countSelected++;
      }
    },
    /**
     * Chọn nhiều dòng bằng shift
     * CreatedBy: VDDong(13/07/2022)
     */
    shiftSelectRow(index) {
      var me = this;
      //Chọn tất cả các dòng giữa 2 index
      if (index < me.selectedIndex) {
        //Nếu index vừa click nhỏ hơn index hiện tại
        for (var i = index; i < me.selectedIndex; i++) {
          //Nếu bản ghi chưa được chọn thì chọn
          if (!me.assets[i].selected) {
            me.assets[i].selected = true;
            me.countSelected++;
            me.selectedAsset.push(me.assets[i]);
          }
        }
      } else {
        //Nếu index vừa click lớn hơn index hiện tại
        for (i = index; i > me.selectedIndex; i--) {
          //Nếu bản ghi chưa được chọn thì chọn
          if (!me.assets[i].selected) {
            me.assets[i].selected = true;
            me.countSelected++;
            me.selectedAsset.push(me.assets[i]);
          }
        }
      }
      //Cập nhật index hiện tại
      me.selectedIndex = index;
    },
    /**
     * Click vào checkbox chọn tất cả
     * CreatedBy: VDDong(13/07/2022)
     */
    toggleSelectAll() {
      var me = this;
      me.selectAll = !me.selectAll;
      //Cập nhật số dòng được chọn
      if (me.selectAll) me.countSelected = me.assets.length;
      else me.countSelected = 0;
      //Chọn tất cả các dòng
      me.assets.forEach((asset) => {
        asset.selected = me.selectAll; //thuộc tính selected của asset được gán tùy theo giá trị của selectAll(true/false)
        //Nếu selectedAll là true thì thêm asset vào selectedAsset, không thì xóa asset đó khỏi selectedAsset
        if (me.selectAll) {
          //Nếu asset chưa được chọn thì thêm vào selectedAsset
          if (!me.selectedAsset.map((x) => x.assetId).includes(asset.assetId))
            me.selectedAsset.push(asset);
          // me.selectedAsset.push(asset);
        } else {
          me.selectedAsset = me.selectedAsset.filter(
            (asset) => asset.assetId !== asset.assetId
          );
          //Còn bug là nếu bỏ checkbox all thì selectedAsset sẽ bị xóa cả những bản ghi của trang khác, vì thế khi bỏ checkbox all
          //thì chỉ xóa những bản ghi của trang hiện tại thôi
        }
      });
    },

    /**
     * Click vào ô checkbox của mỗi dòng trong bảng
     * Created by: VDDong (20/06/2022)
     */
    checkboxRecordOnClick(clickedAsset, index) {
      var me = this;
      //Chọn dòng vừa click
      me.selectedIndex = index;
      //Chọn lại thì bỏ chọn
      clickedAsset.selected = !clickedAsset.selected;

      //Cập nhật số dòng được chọn
      if (!clickedAsset.selected) {
        //Xóa asset vừa bỏ tích checkbox ra khỏi danh sách selectedAsset
        me.selectedAsset = me.selectedAsset.filter(
          (asset) => asset.assetId !== clickedAsset.assetId
        );
        //Giảm biến đếm số dòng được chọn
        me.countSelected--;
      } else {
        //Thêm asset vừa chọn vào selectedAsset
        me.selectedAsset.push(clickedAsset);
        //Tăng biến đếm số dòng được chọn
        me.countSelected++;
      }
    },

    /**
     * Click chuột phải vào dòng trên bảng
     * Hiện menu context
     * Created by: VDDong (21/06/2022)
     */
    rowTableOnRightClick(clickedAsset, index) {
      var me = this;
      me.rightClickedAsset = clickedAsset;
      me.rightClickedIndex = index;
      me.viewMenuContext = true;
      //get position of right clicked and convert to pixel
      var x = event.clientX;
      var y = event.clientY;
      //set position of context menu
      me.mcTop = y + "px";
      me.mcLeft = x + 100 + "px";
    },
    /**
     * Đóng menu context
     * Created by: VDDong (21/06/2022)
     */
    closeMenuContext() {
      var me = this;
      me.viewMenuContext = false;
    },
    /**
     * Các hàm xử lý khi click vào menu context
     * Thêm, sửa, nhân bản thì gọi sang component cha là AssetList để thực hiện
     * Created by: VDDong (21/06/2022)
     */
    menuContextAddOnClick() {
      var me = this;
      me.$emit("btnAddOnClick");
    },
    menuContextEditOnClick(asset) {
      var me = this;
      me.$emit("btnEditOnClick", asset.assetId);
    },
    menuContextCopyOnClick(asset) {
      var me = this;
      me.$emit("btnCopyOnClick", asset.assetId);
    },

    /**
     * Click nút edit
     * CreatedBy: VDDong(13/07/2022)
     */
    btnEditOnClick: function (assetId) {
      //Emit event btnEditOnClick cho component cha
      this.$emit("btnEditOnClick", assetId);
    },
    /**
     * Click nút nhân bản
     * CreatedBy: VDDong(13/07/2022)
     */
    btnCopyOnClick: function (assetId) {
      //Emit event btnCopyOnClick cho component cha
      this.$emit("btnCopyOnClick", assetId);
    },
    /**
     * Double click để xem chi tiết bản ghi
     * Created by: VDDong (27/06/2022)
     */
    btnViewOnClick(assetId) {
      this.$emit("btnViewOnClick", assetId);
    },

    /**
     * Xoá dữ liệu
     * CreatedBy: VDDong(13/07/2022)
     */
    deleteAssets() {
      var me = this;
      //Khởi tạo mảng chứa các id cần xoá
      var idToDelete = [];
      //gán idToDelete là những id của asset trong list selectedAsset
      idToDelete = me.selectedAsset.map((asset) => asset.assetId);
      //Gọi api xoá dữ liệu
      axios
        .delete(Resources.API.DeleteAsset + `${idToDelete}`)
        .then(function () {
          //Xóa bản ghi vừa xóa ra khỏi danh sách selectedAsset
          me.selectedAsset = me.selectedAsset.filter(
            (asset) => !idToDelete.includes(asset.assetId)
          );

          //Emit event loadData để load lại trang
          bus.$emit("loadData");
          me.$emit("showToast", Resources.ToastMsg.DeleteSuccess);
        })
        .catch(function (error) {
          console.log(error);
        });
      me.countSelected = 0;
    },

    /**
     * Tính tổng các giá trị
     * CreatedBy: VDDong (13/07/2022)
     */
    sum(fieldName) {
      var res = 0;
      this.assets.forEach((asset) => {
        // if (fieldName != "quantity") res += asset[fieldName] * asset.quantity;
        // else res += asset[fieldName];
        res += asset[fieldName];
      });
      return res;
    },

    /**
     * Định dạng số
     * CreatedBy: VDDong (13/07/2022)
     */
    formatNumber: function (value) {
      return numeral(value).format("0,0");
    },

  },
};
</script>

<style>
/* Custom CSS Select option Chọn số bản ghi trên trang */
.el-select {
  margin-left: 24px !important;
}
.el-input--suffix .el-input__inner {
  padding-left: 8px !important;
  padding-right: 24px !important;
  width: 66px !important;
  height: 24px !important;
  text-align: center;
  color: #000;
}
.el-input__inner {
  border: 1px solid rgb(182, 182, 182);
}
.el-input__icon {
  height: 100% !important;
  width: 16px !important;
  text-align: center !important;
  transition: all 0.3s !important;
  line-height: 24px !important;
}
.el-scrollbar__bar.is-vertical > div {
  display: none;
}
.el-select-dropdown__item.hover {
  background-color: rgba(26, 164, 200, 0.2);
}
.el-select-dropdown .el-popper {
  top: 500px !important;
}
.el-select-dropdown__item {
  font-size: 13px !important;
  height: 28px !important;
  line-height: 28px !important;
}
.el-select .el-input .el-select__caret {
  color: transparent;
}
.el-icon-arrow-up:before {
  background: url("../../assets/icon/qlts-icon.svg") no-repeat -28px -338px;
  width: 8px;
  height: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>