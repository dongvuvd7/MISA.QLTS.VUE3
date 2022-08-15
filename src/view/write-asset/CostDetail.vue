<template>
  <div id="costDetail">
    <div class="dialog-modal"></div>
    <div class="dialog">
      <div class="dialog-body">
        <div class="dialog-title">
          <div class="dialog-title-text">Sửa tài sản {{ asset.assetName }}</div>
          <div class="icon-x" @click="$emit('closeCostDetail')"></div>
        </div>
        <!-- end dialog title -->
        <div class="dialog-content">
          <v-row>
            <!-- Mã chứng từ -->
            <v-col cols="10">
              <div class="dialog-content-label">Bộ phận sử dụng</div>
              <base-input :disabled="true" :value="asset.departmentName" />
            </v-col>
          </v-row>
          <h3>Nguyên giá</h3>
          <div class="source-container">
            <!-- Title -->
            <v-row class="title-row">
              <v-col cols="6">
                <div class="dialog-content-label">Nguồn hình thành</div>
              </v-col>
              <v-col cols="6">
                <div class="dialog-content-label">Giá trị</div>
              </v-col>
            </v-row>
            <!-- Input bar -->
            <div v-for="(source, index) in listSource" :key="index">
              <v-row>
                <v-col cols="6">
                  <!-- Hàm itemOnClick có tham số index là lấy từ v-for, dùng
                  làm biến cho hàm bên component cha, mà nó cũng lấy cả các biến
                  từ component con gửi về nên cần phải viết ...arguments để phân biệt
                   biến dùng cho cha, biến dùng cho con: nghĩa là
                  các biến do con gửi về cha sẽ tập hợp hết vào argument -->
                  <license-combobox
                    :items="listSourceName"
                    :value="listSource[index].source"
                    :indexSpec="index"
                    :required="true"
                    :showError="showError"
                    :errorMsg="'Không được bỏ trống thông tin này'"
                    @itemOnClick="itemOnClick(index, ...arguments)"
                  />
                </v-col>
                <v-col cols="4">
                  <input
                    type="text"
                    class="costsource-value-input"
                    v-model.lazy="listSource[index].value"
                    v-money="money"
                    style="text-align: right"
                    maxlength="18"
                    :class="{
                      'error-input': showError && listSource[index].source == '',
                    }"
                  />
                  <!-- Thông báo lỗi -->
                  <div class="error-msg">Không được bỏ trống ô này!</div>
                </v-col>
                <v-col cols="2" class="row-btn-group">
                  <div class="icon-plus" @click="btnPlusOnClick"></div>
                  <div
                    class="icon-minus"
                    v-if="listSource.length > 1"
                    @click="btnMinusOnClick(index)"
                  ></div>
                </v-col>
              </v-row>
            </div>
          </div>
          <!-- end source container -->
          <v-row>
            <v-col cols="6">
              <base-input :value="'Tổng'" :disabled="true" />
            </v-col>
            <v-col cols="4">
              <input
                type="text"
                class="costsource-total-value-input"
                :value="formatNumber(sumValueOfCostSource())"
                disabled
                style="text-align: right"
              />
            </v-col>
          </v-row>
        </div>
        <!-- end dialog content -->
      </div>
      <!-- end dialog-body -->
      <div class="dialog-footer">
        <base-button-text
          :text="'Huỷ'"
          :btnType="'white-btn'"
          @click="btnCancelOnClick"
        />
        <base-button-text :text="'Lưu'" @click="saveCostSourceData" />
      </div>
      <!-- end dialog-footer -->
    </div>
    <!-- end dialog -->
  </div>
</template>

<script>
import axios from "axios";
import numeral from "numeral";

import Resources from "../../components/common/resource.js";

import BaseButtonText from "../../components/base/BaseButtonText.vue";
import BaseInput from "../../components/base/BaseInput.vue";
import LicenseCombobox from "../../components/base/LicenseCombobox.vue";

import { VMoney } from "v-money";

export default {
  components: {
    BaseButtonText,
    BaseInput,
    LicenseCombobox,
  },

  props: {
    //Mã tài sản đang xem chi tiết nguyên giá
    assetId: {
      type: String,
      default: null,
    },
    //Mã chứng từ chứa tài sản đang xem chi tiết nguyên giá
    licenseId: {
      type: String,
      default: null,
    },
    //Vị trí của tài sản đang xem chi tiết nguyên giá trong list các tài sản
    index: {
      type: Number,
      default: null,
    },
    //Chuỗi JSON chứa thông tin chi tiết nguyên giá, [{"value":100000000,"source":"Ngân sách Trung ương"}]
    costDetail: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      //Mảng danh sách chi tiết nguyên giá (tên nguồn-giá trị) của tài sản đang xét
      listSource: [
        {
          value: 0, //Giá trị
          source: "", //Nguồn nguyên giá
        },
      ],
      listSourceName: [], //Mảng danh sách tên các nguồn nguyên giá
      asset: {}, //Tài sản đang xem chi tiết nguyên giá
      showError: false, //Biến validate combobox (show lỗi hay không)

      money: {
        thousands: ".",
        precision: 0,
        masked: false /* doesn't work with directive */,
      },

    };
  },

  directives: { money: VMoney },

  created() {
    var me = this;
    //Lấy thông tin tài sản đang xem chi tiết nguyên giá
    axios
      .get(Resources.API.GetAssetById + `${this.assetId}`)
      .then((response) => {
        me.asset = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    //Lấy dữ liệu các tên nguồn hình thành đẩy vào combobox
    axios
      .get(Resources.API.GetCostSource)
      .then((response) => {
        var listSourceName = response.data;
        listSourceName.forEach((item) => {
          var id = item.costSourceId;
          var name = item.costSourceName;
          me.listSourceName.push({ id: id, value: name, des: null }); //Push theo định dạng của base combobox
        });
      })
      .catch((error) => {
        console.log(error);
      });

    //Xử lý các nguồn nguyên giá (tên-giá trị) từ trước để render ra form (khi ở form sửa)
    if (this.costDetail != null && this.costDetail != "") {
      // console.log(this.costDetail + typeof(this.costDetail)); //string
      //JSON.parse là hàm chuyển đổi chuỗi JSON thành đối tượng trong JS
      this.listSource = JSON.parse(this.costDetail);
      // console.log("listSource: ", this.listSource); //object
    } else {
      //Nếu không có chi tiết nguyên giá trước đó, thì khởi tạo mặc định
      this.listSource = [
        {
          value: 0, //Giá trị
          source: "", //Nguồn nguyên giá
        },
      ];
    }
  },

  methods: {
    /**
     *Lưu dữ liệu chi tiết nguyên giá cho tài sản đang xét
     *Created by: VDDong (11/05/2022)
     */
    saveCostSourceData() {
      //Validate tên nguồn hình thành không được để trống
      var valid = true;
      this.listSource.forEach((item) => {
        if (item.source == "") {
          this.showError = true;
          valid = false;
          ///focus chuột vào ô input combobox
          //get thẻ input có valuename rỗng
          var inputs = document.querySelectorAll("input[valuename='']");
          console.log(inputs);
          //focus vào thẻ input đầu tiên
          inputs[0].focus();
        }
      });
      //Validate tên nguồn nguyên giá không được trùng
      if (valid) {
        //Duyệt từ cuối mảng listSource về đầu mảng, nếu listSource.source đã tồn tại thì focus vào ô input đó
        for (var i = this.listSource.length - 1; i >= 0; i--) {
          for (var j = 0; j < this.listSource.length; j++) {
            console.log(this.listSource[i].source, ' ', this.listSource[j].source);
            if (i != j && this.listSource[i].source == this.listSource[j].source) {
              //Lấy ô input cuối có tên nguồn nguyên giá trùng
              var inputs = document.querySelectorAll("input[valuename='" + this.listSource[j].source + "']");
              //Thêm class error-input vào ô input cuối có tên nguồn nguyên giá trùng
              inputs[inputs.length - 1].classList.add("error-input");
              //Đổi text của class error-msg liền ngay sau ô input đó thành "Nguồn chi phí đã tồn tại!"
              inputs[inputs.length - 1].nextElementSibling.innerHTML = "Nguồn chi phí đã tồn tại!";
              //Focus vào ô input cuối có tên nguồn nguyên giá trùng
              inputs[inputs.length - 1].focus();
              return;
            }
          }
        }
      }
      //Pass validate
      if (valid) {
        //JSON.stringify là hàm chuyển đổi đối tượng JS thành chuỗi JSON
        this.$emit(
          "saveCostDetail",
          JSON.stringify(this.listSource),
          this.index
        ); //this.index là vị trí của tài sản, sang bên LicenseDetail còn biết đế gán thuộc tính costDetail cho tài sản đó
        this.$emit("closeCostDetail");
      }
    },

    /**
     * Hàm tính tổng giá trị các nguồn hình thành
     * Created by: VDDong (11/05/2022)
     */
    sumValueOfCostSource() {
      var total = 0;
      for (var i = 0; i < this.listSource.length; i++) {
        console.log(
          this.listSource[i].value,
          "value of listSource [" + i + "]"
        );
        //remove . from string
        var value = this.listSource[i].value.toString().replace(/\./g, "");
        total += +value;
      }
      return total;
    },

    /**
     * Click vào 1 item của combobox thì cập nhật giá trị source(nguồn giá trị)
     * Created by: VDDong (11/05/2022)
     */
    itemOnClick(index, value) {
      console.log(index, "index");
      console.log(value, "value");
      //Lấy text ở thanh input có attribute indexSpec là index
      //Đợi sau 0,5 giây rồi mới cập nhật giá trị (tránh lỗi bất động bộ khi element combobox chưa kịp cập nhật attribute valueName)
      setTimeout(() => {
        var costsourceName = document
          .querySelectorAll(`[indexSpec="${index}"]`)[0]
          .getAttribute("valueName");
        console.log(costsourceName, "costsourceName");
        //Cập nhật giá trị listSource[index].source theo giá trị ở thanh input
        this.listSource[index].source = costsourceName;
      }, 500);
    },

    /**
     * Update lại giá trị input (giá trị của nguồn hình thành) khi thay đổi input đầu vào
     * Created by: VDDong (11/05/2022)
     */
    update(index, fieldName, value) {
      //Update thuộc tính [fieldName] của asset
      this.listSource[index].value = value;
    },

    /**
     * Nhấn nút + thêm nguồn nguyên giá và giá trị
     * Created by: VDDong (11/05/2022)
     */
    btnPlusOnClick() {
      //Thêm nguồn nguyên giá-giá trị vào mảng listSource chứa các nguồn nguyên giá-giá trị
      this.listSource.push({
        source: "",
        value: 0,
      });
      this.showError = false; //Mặc định là không có lỗi validate combobox
    },

    /**
     * Nhấn nút - xóa nguồn nguyên giá và giá trị
     * Created by: VDDong (11/05/2022)
     */
    btnMinusOnClick(index) {
      this.listSource.splice(index, 1);
    },

    /**
     * Nhấn nút huỷ
     * Created by: VDDong (11/05/2022)
     */
    btnCancelOnClick() {
      this.$emit("closeCostDetail");
    },

    /**
     * Định dạng số
     * Created by: VDDong (09/08/2022)
     */
    formatNumber: function (value) {
      return numeral(value).format("0,0");
    },

  },
};
</script>

