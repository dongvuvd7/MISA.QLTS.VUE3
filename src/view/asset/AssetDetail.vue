<template>
  <div @keydown.esc="$emit('closeDialog')">
    <div class="dialog-modal"></div>

    <div class="dialog">
      <div class="dialog-body">
        <div class="dialog-title">
          <div class="dialog-title-text">
            {{ formMode == "edit" ? "Sửa tài sản" : "Thêm tài sản" }}
          </div>
          <div class="icon-x" @click="$emit('closeDialog')" title="Đóng (Esc)"></div>
        </div>
        <div class="dialog-content">
          <!-- Dòng 1 -->
          <v-row>
            <!-- Mã tài sản -->
            <v-col cols="4">
              <div class="dialog-content-label">
                Mã tài sản
                <span style="color: red">*</span>
              </div>
              <base-input
                :placeholder="'Nhập mã tài sản'"
                :value="asset.assetCode"
                :fieldName="'assetCode'"
                @updated="update"
                :required="true"
                :errorMsg="'Mã tài sản không hợp lệ'"
                ref="assetCode"
                :maxLength="50"
              />
            </v-col>
            <!-- Tên tài sản -->
            <v-col cols="8">
              <div class="dialog-content-label">
                Tên tài sản
                <span style="color: red">*</span>
              </div>
              <base-input
                :placeholder="'Nhập tên tài sản'"
                :value="asset.assetName"
                :fieldName="'assetName'"
                @updated="update"
                :required="true"
                :errorMsg="'Tên tài sản không được phép để trống'"
                :maxLength="255"
              />
            </v-col>
          </v-row>
          <!-- Dòng 2 -->
          <v-row>
            <!-- Mã bộ phận sử dụng -->
            <v-col cols="4">
              <div class="dialog-content-label">
                Mã bộ phận sử dụng
                <span style="color: red">*</span>
              </div>
              <base-combobox
                :placeholder="'Chọn mã bộ phận sử dụng'"
                :items="listDepartmentCode"
                @itemOnClick="loadDepartmentName"
                :value="asset.departmentCode"
                :fieldName="'departmentCode'"
                @updated="update"
                :required="true"
                :errorMsg="'Mã bộ phận sử dụng không được phép để trống'"
              />
            </v-col>
            <!-- Tên bộ phận sử dụng -->
            <v-col cols="8">
              <div class="dialog-content-label">Tên bộ phận sử dụng</div>
              <base-input
                :disabled="true"
                :value="asset.departmentName"
                :fieldName="'departmentName'"
                @updated="update"
              />
            </v-col>
          </v-row>
          <!-- Dòng 3 -->
          <v-row>
            <!-- Mã loại tài sản -->
            <v-col cols="4">
              <div class="dialog-content-label">
                Mã loại tài sản
                <span style="color: red">*</span>
              </div>
              <base-combobox
                :placeholder="'Chọn mã loại tài sản'"
                :items="listCategoryCode"
                @itemOnClick="loadCategoryName"
                :value="asset.assetCategoryCode"
                :fieldName="'assetCategoryCode'"
                @updated="update"
                :required="true"
                :errorMsg="'Mã loại tài sản không được phép để trống'"
              />
            </v-col>
            <!-- Tên loại tài sản -->
            <v-col cols="8">
              <div class="dialog-content-label">Tên loại tài sản</div>
              <base-input
                :disabled="true"
                :value="asset.assetCategoryName"
                :fieldName="'assetCategoryName'"
                @updated="update"
              />
            </v-col>
          </v-row>
          <!-- Dòng 4 -->
          <v-row>
            <!-- Số lượng -->
            <v-col cols="4">
              <div class="dialog-content-label">
                Số lượng
                <span style="color: red">*</span>
              </div>
              <base-input
                :textAlign="'right'"
                :value="asset.quantity"
                :fieldName="'quantity'"
                :formatNumber="true"
                :type="'text'"
                @increase="asset.quantity++"
                @decrease="asset.quantity = Math.max(1, asset.quantity - 1)"
                @updated="update"
                :arrowButton="true"
                :maxLength="18"
                :required="true"
                :errorMsg="'Số lượng không được phép để trống'"
              />
            </v-col>
            <!-- Nguyên giá -->
            <v-col cols="4">
              <div class="dialog-content-label">
                Nguyên giá
                <span style="color: red">*</span>
              </div>
              <base-input
                :textAlign="'right'"
                :value="asset.cost"
                :fieldName="'cost'"
                :formatNumber="true"
                @updated="update"
                :errorMsg="'Hao mòn năm phải nhỏ hơn hoặc bằng nguyên giá'"
                :required="true"
                :maxLength="18"
              />
            </v-col>
            <!-- Số năm sử dụng -->
            <v-col cols="4">
              <div class="dialog-content-label">
                Số năm sử dụng
                <span style="color: red">*</span>
              </div>
              <base-input
                :textAlign="'right'"
                :value="asset.lifeTime"
                :fieldName="'lifeTime'"
                :formatNumber="true"
                :type="'text'"
                @increase="asset.lifeTime++"
                @decrease="asset.lifeTime = Math.max(0, asset.lifeTime - 1)"
                @updated="update"
                :maxLength="18"
                :required="true"
              />
            </v-col>

          </v-row>
          <!-- Dòng 5 -->
          <v-row>
            <!-- Tỉ lệ hao mòn -->
            <v-col cols="4">
              <div class="dialog-content-label">
                Tỉ lệ hao mòn (%)
                <span style="color: red">*</span>
              </div>
              <base-input
                :textAlign="'right'"
                :value="asset.depreciationRate * 100"
                :fieldName="'depreciationRate'"
                :formatNumber="true"
                @updated="update"
                :errorMsg="'Tỉ lệ hao mòn phải bằng 1/Số năm sử dụng'"
                :arrowButton="true"
                :maxLength="18"
                :required="true"
              />
            </v-col>
            <!-- Giá trị hao mòn năm -->
            <v-col cols="4">
              <div class="dialog-content-label">
                Giá trị hao mòn năm
                <span style="color: red">*</span>
              </div>
              <base-input
                :textAlign="'right'"
                :value="asset.annualDepreciation"
                :fieldName="'annualDepreciation'"
                :formatNumber="true"
                @updated="update"
                :required="true"
                :maxLength="18"
              />
            </v-col>

            <!-- Năm theo dõi -->
            <v-col cols="4">
              <div class="dialog-content-label">Năm theo dõi</div>
              <base-input
                :disabled="true"
                :value="asset.trackedYear"
                :textAlign="'right'"
                :fieldName="'trackedYear'"
              />
            </v-col>
          </v-row>
          <!-- Dòng 6 -->
          <v-row>
            <!-- Ngày mua -->
            <v-col cols="4">
              <div class="dialog-content-label">
                Ngày mua
                <span style="color: red">*</span>
              </div>
              <date-picker
                v-model="asset.purchaseDate"
                valueType="date"
                format="DD/MM/YYYY"
                :editable="true"
                :clearable="false"
                :disabled-date="disabledAfterToday"
              ></date-picker>
              <div class="date-icon">
                <div class="input-icon icon-calendar"></div>
              </div>
            </v-col>
            <!-- Ngày bắt đầu sử dụng -->
            <v-col cols="4">
              <div class="dialog-content-label">
                Ngày bắt đầu sử dụng
                <span style="color: red">*</span>
              </div>
              <date-picker
                v-model="asset.useDate"
                valueType="date"
                format="DD/MM/YYYY"
                :editable="true"
                :clearable="false"
                :disabled-date="disabledAfterTodayAndBeforePurchaseDate"
              ></date-picker>
              <div class="date-icon">
                <div class="input-icon icon-calendar"></div>
              </div>
            </v-col>
            
          </v-row>
        </div>
      </div>
      <!-- End dialog-body -->

      <div class="dialog-footer">
        <base-button-text
          :text="'Lưu'"
          :btnType="'main-btn btn-save-dialog'"
          @click="saveData"
        />
        <base-button-text
          :text="'Huỷ'"
          :btnType="'white-btn btn-cancel-dialog'"
          @click="btnCancelOnClick"
        />
      </div>
      <!-- End dialog-footer -->
    </div>
    <!-- End dialog -->
  </div>
</template>

<script>
import { bus } from "../../main";
import axios from "axios";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import {vi} from "vue2-datepicker/locale/vi";

import Enums from "../../components/common/enum.js";
import Resources from "../../components/common/resource.js";

import BaseInput from "../../components/base/BaseInput.vue";
import BaseCombobox from "../../components/base/BaseCombobox.vue";
import BaseButtonText from "../../components/base/BaseButtonText.vue";

export default {
  components: {
    BaseInput,
    BaseCombobox,
    BaseButtonText,
    DatePicker,
  },

  props: {
    //Form mode (thêm, sửa, nhân bản)
    formMode: {
      type: String,
      default: Enums.FormMode.Add,
    },
    //Id đã chọn
    selectedId: {
      type: String,
      default: null,
    },
    //Danh sách combobox bộ phận
    listDepartmentCode: {
      type: Array,
      default: null,
    },
    //Danh sách combobox loại tài sản
    listCategoryCode: {
      type: Array,
      default: null,
    },
  },

  data() {
    return {
      //Thông tin tài sản trên form
      asset: {
        purchaseDate: new Date(), //Ngày mua - Ngày bắt đầu sử dụng (Do đề và database không nói rõ nên tạm thời để 2 trường này giống nhau)
        useDate: new Date(), //Ngày bắt đầu sử dụng
        annualDepreciation: 0, //Giá trị hao mòn năm
        // assetCategoryId: null, //Id loại tài sản
        assetCategoryCode: "", //Mã loại tài sản
        assetCategoryName: "", //Tên loại tài sản
        assetCode: "", //Mã tài sản
        assetName: "", //Tên tài sản
        cost: 0, //Nguyên giá
        // departmentId: null, //Id bộ phận sử dụng
        departmentCode: "", //Mã bộ phận sử dụng
        departmentName: "", //Tên bộ phận sử dụng
        depreciationRate: 0, //Tỷ lệ hao mòn
        lifeTime: 0, //Số năm sử dụng
        quantity: 1, //Số lượng
        trackedYear: 2022, //Năm theo dõi
      },
      assetOrigin: {}, //Tài sản ban đầu khi mở form detail 
      vi: vi, //Ngôn ngữ datepicker

    };
  },

  created() {
    //Khai báo sự kiến saveData ở bus
    bus.$on("saveData", this.saveData);
    //Nếu có id truyền vào (form sửa) thì call API lấy dữ liệu theo id đó truyền lên form
    if (this.selectedId != null) {
      var me = this;
      //Gọi api lấy dữ liệu
      axios
        .get(Resources.API.GetAssetById + `${this.selectedId}`)
        .then(function (response) {
          var asset = response.data;
          //Nếu formMode là nhân bản thì lấy mã mới
          if (me.formMode == Enums.FormMode.Copy) {
            asset.assetCode = me.getNewCode();
          }
          var rate = asset.depreciationRate;
          var cost = asset.cost;
          asset.purchaseDate = new Date(asset.purchaseDate);
          asset.purchaseDate.setHours(asset.purchaseDate.getHours() + 7); //Giờ trong database là +0
          asset.useDate = new Date(asset.useDate);
          asset.useDate.setHours(asset.useDate.getHours() + 7); //Giờ trong database là +0
          asset.annualDepreciation = Math.round(rate * cost); //Tính giá trị hao mòn năm
          me.asset = asset;
          me.assetOrigin = { ...asset }; //Lưu tài sản ban đầu khi mở form detail
        })
        .catch((error) => {
          console.log(error);
        });
    }
    //Nếu formMode là thêm hoặc nhân bản thì lấy mã mới
    if (
      this.formMode != Enums.FormMode.Edit &&
      this.formMode != Enums.FormMode.View
    ) {
      this.asset.assetCode = this.getNewCode();
    }
  },

  mounted() {
    //Focus vào ô mã tài sản khi bật form lên
    this.$refs.assetCode.$refs.input.focus();

    /*
     * Nếu formMode là view thì disable tất cả các input
     * Created by: VDDong (27/06/2022)
     */
    if (this.formMode == Enums.FormMode.View) {
      //disable tất cả các input
      var inputs = document.querySelectorAll(".dialog .base-input");
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
      }
      //disable input date and prevent event click
      var inputsDate = document.querySelectorAll('.dialog [name="date"]');
      for (var j = 0; j < inputsDate.length; j++) {
        inputsDate[j].disabled = true;
      }
      //disable date-icon
      var inputsDateIcon = document.querySelectorAll(".dialog .date-icon");
      for (var k = 0; k < inputsDateIcon.length; k++) {
        inputsDateIcon[k].style.backgroundColor = "#f3f3f3";
      }
      //disable button hủy, thêm
      var buttons = document.querySelectorAll(".dialog .base-button-text");
      for (var l = 0; l < buttons.length; l++) {
        //gán attribute disabled cho button hủy, thêm
        buttons[l].disabled = true;
        //thêm class disabled-button để đặt màu cho button hủy, thêm
        buttons[l].classList.add("disabled-button");
      }

    }


  },

  methods: {
    /**
     * Lấy tên bộ phận sử dụng tương ứng sau khi chọn mã
     * CreatedBy: VDDong (13/07/2022)
     */
    loadDepartmentName(id, value, des) {
      this.asset.departmentId = id; //gán id bộ phận sử dụng vào trường id bpsd của tài sản đang xét
      this.asset.departmentName = des; //gán tên bộ phận sử dụng vào trường tên bpsd của tài sản đang xét
    },
    /**
     * Lấy tên loại tài sản khi chọn mã
     * CreatedBy: VDDong (13/07/2022)
     */
    loadCategoryName(id) {
      var me = this;
      this.asset.assetCategoryId = id; //gán id loại tài sản vào trường id lts của tài sản đang xét
      //Lấy các thông tin tên loại tài sản, tỉ lệ hao mòn, số năm sử dụng
      axios
        .get(Resources.API.GetAssetCategories + `/${id}`)
        .then(function (response) {
          var category = response.data;
          me.asset.assetCategoryName = category.assetCategoryName;
          me.asset.depreciationRate = category.depreciationRate;
          me.asset.lifeTime = category.lifeTime;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    /**
     * Validate không cho phép chọn ngày sau ngày hiện tại
     * CreatedBy: VDDong (13/07/2022)
     */
    disabledAfterToday(date) {
      return date > new Date();
    },
    disabledAfterTodayAndBeforePurchaseDate(date) {
      return date > new Date() || date < new Date(this.asset.purchaseDate);
    },

    /**
     * Update data khi thay đổi input
     * CreatedBy: VDDong (13/07/2022)
     */
    update(fieldName, value) {
      //Update thuộc tính [fieldName] của asset
      this.asset[fieldName] = value;
      if (fieldName == "cost" || fieldName == "depreciationRate") {
        //Nếu thay đổi nguyên giá hoặc tỉ lệ thì tính lại hao mòn năm
        var rate = this.asset.depreciationRate;
        var cost = this.asset.cost;
        this.asset.annualDepreciation = Math.round(rate * cost);
      }
    },

    /**
     * Lấy mã tài sản mới
     * CreatedBy: VDDong (13/07/2022)
     */
    getNewCode() {
      var me = this;
      //Gọi api lấy mã tài sản mới
      axios
        .get(Resources.API.GetNewAssetCode)
        .then(function (response) {
          me.asset.assetCode = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    /**
     * Validate bắt buộc nhập
     * CreatedBy: VDDong (13/07/2022)
     */
    requiredValidate() {
      //get all input with class m-input-required
      var inputs = this.$el.querySelectorAll(".m-input-required");
      //loop all input
      for (var i = 0; i < inputs.length; i++) {
        //get value of input
        var value = inputs[i].value;
        //if value is empty
        if (value == "") {
          //show error
          bus.$emit("validate");
          //focus on input
          inputs[i].focus();
          //break loop
          return false;
        }
      }

      //get all input with name is date
      var inputsDate = this.$el.querySelectorAll('.dialog .dialog-content input[name="date"]');
      //loop all input name is date
      for (var j = 0; j < inputsDate.length; j++) {
        //get value of input
        var valueInputDate = inputsDate[j].value;
        //if value is empty
        if (valueInputDate == "") {
          //show error by add class error-input to that elemnt
          inputsDate[j].classList.add("error-input");
          //add title = "Bạn cần nhập trường này."
          inputsDate[j].title = Resources.Notice.RequiredField;
          //focus on input
          inputsDate[j].focus();
          //break loop
          return false;
        }
        else {
          //remove class error-input
          inputsDate[j].classList.remove("error-input");
        }
      }

      //if all input is not empty
      return true;
    },

    /**
     * Validate nghiệp vụ
     * CreatedBy: VDDong (13/07/2022)
     */
    bussinessValidate() {
      var me = this;
      //Mảng chứa danh sách lỗi
      var msgs = [];
      var valid = true;
      if (
        (1.0 / me.asset.lifeTime).toFixed(4) != me.asset.depreciationRate &&
        me.asset.lifeTime != 0
      ) {
        //Validate tỉ lệ hao mòn phải bằng 1/Số năm sử dụng
        msgs.push(Resources.ErrorMsg.DepreciationRate);
        valid = false;
        //Focus vào tỉ lệ hao mòn
        me.$el
          .querySelectorAll(".m-input-depreciationRate-lifeTime")[0]
          .focus();
        //add class error to inputs
        me.$el
          .querySelectorAll(".m-input-depreciationRate-lifeTime")[0]
          .classList.add("error-input"); //thanh input tỉ lệ hao mòn
        me.$el
          .querySelectorAll(".m-input-depreciationRate-lifeTime")[1]
          .classList.add("error-input"); //thanh input số năm sử dụng
      } else {
        //remove class error from inputs
        me.$el
          .querySelectorAll(".m-input-depreciationRate-lifeTime")[0]
          .classList.remove("error-input"); //thanh input tỉ lệ hao mòn
        me.$el
          .querySelectorAll(".m-input-depreciationRate-lifeTime")[1]
          .classList.remove("error-input"); //thanh input số năm sử dụng
      }
      if (me.asset.annualDepreciation > me.asset.cost) {
        //Validate hao mòn năm phải nhỏ hơn hoặc bằng nguyên giá
        msgs.push(Resources.ErrorMsg.AnnualDepreciation);
        valid = false;
        //Focus vào nguyên giá
        me.$el.querySelectorAll(".m-input-cost-annualDepreciation")[0].focus();
        //add class error to input
        me.$el
          .querySelectorAll(".m-input-cost-annualDepreciation")[0]
          .classList.add("error-input"); //thanh input nguyên giá
        me.$el
          .querySelectorAll(".m-input-cost-annualDepreciation")[1]
          .classList.add("error-input"); //thanh input hao mòn năm
      } else {
        //remove class error from inputs
        me.$el
          .querySelectorAll(".m-input-cost-annualDepreciation")[0]
          .classList.remove("error-input"); //thanh input nguyên giá
        me.$el
          .querySelectorAll(".m-input-cost-annualDepreciation")[1]
          .classList.remove("error-input"); //thanh input hao mòn năm
      }
      if (!valid) {
        //Hiển thị lỗi
        //Emit event validateError
        // me.$emit("validateError", msgs);
      }
      return valid;
    },

    /**
     * Lưu dữ liệu
     * CreatedBy: VDDong (13/07/2022)
     */
    saveData() {
      var me = this;
      var valid = true;

      /* Validate */
      valid = me.requiredValidate();
      if (valid) {
        valid = me.bussinessValidate();
      }
      /* End Validate */

      /* Call API xử lý thêm mới hoặc sửa */
      if (valid) {
        if (me.formMode == Enums.FormMode.Edit) {
          // debugger;
          //Nếu formMode là sửa thì gọi api sửa dữ liệu
          axios
            .put(Resources.API.GetAssetById + `${me.selectedId}`, me.asset)
            .then(function () {
              //Load lại dữ liệu
              me.$emit("loadData");
              //Show thông báo thành công
              me.$emit("showToast", Resources.ToastMsg.EditSuccess);
              //Đóng form chi tiết
              me.$emit("closeDialog");
              //Hightlight row vừa sửa
              // bus.$emit("hightLightRow", [me.asset.assetCode], 8000);
            })
            .catch(function (error) {
              console.log(error);
              //Emit event validateError
              me.$emit(
                "validateError",
                error.response.data.exception.errorMsgs
              );
            });
        } else {
          //Nếu formMode là thêm hoặc nhân bản thì gọi api thêm dữ liệu
          axios
            .post(Resources.API.GetAssetById, this.asset)
            .then(function () {
              //Load lại dữ liệu
              me.$emit("loadData");
              //Show thông báo thành công
              me.$emit("showToast", Resources.ToastMsg.AddSuccess);
              //Đóng form chi tiết
              me.$emit("closeDialog");
              //Highlight row vừa thêm mới
              // bus.$emit("hightLightRow", [me.asset.assetCode], 8000);
            })
            .catch(function (error) {
              console.log(error);
              //Emit event validateError
              me.$emit(
                "validateError",
                error.response.data.exception.errorMsgs
              );
            });
        }
      } else {
        //Emit event validateError
        // me.$emit("validateError", msgs);
      }
    },

    /**
     * Nhấn nút huỷ
     * CreatedBy: VDDong (13/07/2022)
     */
    btnCancelOnClick() {
      var me = this;
      const assetInit = JSON.parse(JSON.stringify(me.assetOrigin));
      const assetNow = JSON.parse(JSON.stringify(me.asset));
      //Emit event btnCancelOnClick cho component cha show popup
      if (me.formMode == Enums.FormMode.Edit){
        //Nếu có thay đổi dữ liệu thì bật popup hỏi có muốn hủy không, nếu không thay đổi dữ liệu thì đóng form detail luôn
        if(me.compareTwoObject(assetNow, assetInit)){
          me.$emit("btnCancelOnClick", Enums.Action.Put);
        }
        else me.$emit('closeDialog');
      }
        
      else me.$emit("btnCancelOnClick", Enums.Action.Post);
    },

    /**
     * So sánh 2 object để kiểm tra có thay đổi hay không
     * Created by: VDDong (27/06/2022)
     */
    compareTwoObject(obj1, obj2) {
      for(let i in obj1){
        if(obj1[i] !== obj2[i]){
          return true;
        }
      }
      return false
    }

  },
};
</script>