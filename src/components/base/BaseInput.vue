<template>
  <div class="base-input-container">
    <!-- Icon bên trái -->
    <div class="base-input-icon" v-if="withIcon">
      <div class="input-icon" :class="icon"></div>
    </div>
    <!-- Ô nhập liệu -->
    <input
      :type="type"
      class="base-input"
      :placeholder="placeholder"
      v-model="displayValue"
      :class="{
        'input-with-icon': withIcon,
        'error-input': error,
        'with-arrow-button': arrowButton,
        'm-input-required': required,
        'm-input-assetCode': fieldName == 'assetCode',
        'm-input-assetName': fieldName == 'assetName',
        'm-input-cost-annualDepreciation':
          fieldName == 'cost' || fieldName == 'annualDepreciation',
        'm-input-depreciationRate-lifeTime':
          fieldName == 'depreciationRate' || fieldName == 'lifeTime',
        'm-input-search-assets': fieldName == 'searchAssets',
        'm-input-search-licenses': fieldName == 'searchLicenses',
        'm-input-licenseCode': fieldName == 'licenseCode',
      }"
      :disabled="disabled"
      :style="{ 'text-align': textAlign }"
      :required="required"
      ref="input"
      :maxlength="maxLength"
      @keypress="isNumber($event)"
      @keydown="increaseOrDecreaseArrowButton($event)"
      v-on:keyup.enter="onEnter"
    />
    <!-- Thông báo lỗi -->
    <div class="error-msg">{{ errorMsg }}</div>
    <!-- Nút tăng giảm số -->
    <div class="arrows" v-if="arrowButton">
      <div class="icon-arrow-up" @click="$emit('increase')"></div>
      <div class="icon-arrow-down" @click="$emit('decrease')"></div>
    </div>
  </div>
</template>


<script>
import { bus } from "../../main";

import numeral from "numeral";
numeral.register("locale", "vn", {
  delimiters: {
    thousands: ".",
    decimal: ",",
  },
});
numeral.locale("vn");

export default {
  props: {
    //Placeholder
    placeholder: {
      type: String,
      default: null,
    },
    //Giá trị ban đầu
    value: {
      default: null,
    },
    //Có icon hay không
    withIcon: {
      type: Boolean,
      default: false,
    },
    //Class mô tả icon
    icon: {
      type: String,
      default: null,
    },
    //Có bị disabled hay không
    disabled: {
      type: Boolean,
      default: false,
    },
    //Căn lề
    textAlign: {
      type: String,
      default: "left",
    },
    //Kiểu input
    type: {
      type: String,
      default: "text",
    },
    //Tên trường của đối tượng từ component cha
    fieldName: {
      type: String,
      default: "",
    },
    //Có yêu cầu định dạng số hay không
    formatNumber: {
      type: Boolean,
      default: false,
    },
    //Có bắt buộc nhập hay không
    required: {
      type: Boolean,
      default: false,
    },
    //Thông báo lỗi
    errorMsg: {
      type: String,
      default: "",
    },
    //Độ dài tối đa
    maxLength: {
      type: Number,
      default: 99999999,
    },
    //Button tăng giảm
    arrowButton: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      error: false, //Có lỗi hay không để thêm class error-input báo lỗi
    };
  },

  created() {
    //Khai báo sự kiện validate tại bus
    bus.$on("validate", this.validate);
  },

  mounted() {
    /**
     * Nếu giá trị khởi tạo khi mở form detail ở ô input số là 0 thì chắn người dùng xóa
     * Created by: VDDong (13/07/2022)
     */
    if (this.formatNumber && this.value == 0 && this.required) {
      //prevent user press delete or backspace
      this.preventDeleteOrBackspace();
    } else if (this.formatNumber && this.value != 0 && this.required) {
      //continue allow user press delete or backspace
      this.continueAllowDeleteOrBackspace();
    }
  },

  watch: {
    //Khi giá trị hiển thị thay đổi thì validate
    displayValue(value) {
      //Nếu là formatNumber và value đang là 0 thì không cho người dùng xóa nữa
      if (this.formatNumber && value == 0 && this.required) {
        //prevent user press delete or backspace
        this.preventDeleteOrBackspace();
      } else if (this.formatNumber && value != 0 && this.required) {
        //continue allow user press delete or backspace
        this.continueAllowDeleteOrBackspace();
      }

      this.validate();
    },
  },

  computed: {
    /**
     * Format giá trị hiển thị
     * CreatedBy: VDDong (13/07/2022)
     */
    displayValue: {
      //get: Lấy giá trị của displayValue để đưa lên input
      get: function () {
        //Nếu fieldName là depreciationRate thì format dạng số thập phân
        if (this.fieldName == "depreciationRate")
          return numeral(this.value).format("0,0.[00]");
        //Nếu ô input cần for mat thì format dạng số nguyên
        if (this.formatNumber) return numeral(this.value).format("0,0");
        //Nếu không cần format thì giữ nguyên giá trị
        else return this.value;
      },
      //set: Thay đổi ô input thì set lại giá trị cho displayValue
      set: function (modifiedValue) {
        let newValue;
        //Nếu ô input yêu cầu format
        if (this.formatNumber) {
          //Format ngược lại so với bên trên
          if (this.type != "number") {
            modifiedValue = modifiedValue.replaceAll(".", "");
            modifiedValue = modifiedValue.replaceAll(",", ".");
          }
          //Parse sang float
          newValue = parseFloat(modifiedValue);
          //Nếu không phải dạng số thì gán mặc định bằng 0 để tránh bị NaN
          if (isNaN(newValue)) {
            newValue = 0;
          }
        }
        //Nếu ô input không yêu cầu format thì giữ nguyên giá trị
        else newValue = modifiedValue;
        //Emit event updated cho component cha
        if (this.fieldName == "depreciationRate")
          this.$emit("updated", this.fieldName, (newValue / 100).toFixed(4));
        else this.$emit("updated", this.fieldName, newValue);
      },
    },
  },

  methods: {
    /**
     * Kiểm tra và báo lỗi nếu để trống ô input bắt buộc
     * Created by: VDDong (13/07/2022)
     */
    validate() {
      if (this.displayValue == "" && this.required) {
        this.error = true;
      } else this.error = false;
    },

    /**
     * Hàm không cho nhập text vào trường có format số
     * Created by: VDDong (20/06/2022)
     */
    isNumber: function (evt) {
      //Nếu là trường tỉ lệ hao mòn thì cho phép người dùng nhập dấu ,
      if (this.fieldName == "depreciationRate") {
        evt = evt ? evt : window.event;
        var charCodeFieldDepreciationRate = evt.which ? evt.which : evt.keyCode;
        //Nếu fileldName là depreciationRate thì chỉ cho nhập số và dấu ,
        if (
          charCodeFieldDepreciationRate > 31 &&
          (charCodeFieldDepreciationRate < 48 ||
            charCodeFieldDepreciationRate > 57) &&
          charCodeFieldDepreciationRate !== 44
        ) {
          evt.preventDefault();
        } else {
          return true;
        }
      } else if (this.formatNumber) {
        //Nếu là các trường số khác thì chỉ cho nhập số
        evt = evt ? evt : window.event;
        var charCode = evt.which ? evt.which : evt.keyCode;
        if (
          charCode > 31 &&
          (charCode < 48 || charCode > 57) &&
          charCode !== 46
        ) {
          evt.preventDefault();
        } else {
          return true;
        }
      }
    },

    /**
     * Hàm bắt sự kiện nhắn nút arrow up/down thì tăng giảm giá trị ô input có arrowButton
     * Created by: VDDong (13/07/2022)
     */
    increaseOrDecreaseArrowButton(evt) {
      var me = this;
      //Nếu là arrowButton thì bắt sự kiện nhấn nút arrow up arrow down để tăng giảm giá trị
      if (me.arrowButton && me.formatNumber) {
        if (evt.keyCode == 38) {
          me.$emit("increase");
        } else if (evt.keyCode == 40) {
          me.$emit("decrease");
        }
      }
    },

    /**
     * Hàm không cho người dùng nhấn nút delete hoặc backspace ở ô input số khi giá trị là 0
     * Created by: VDDong (13/07/2022)
     */
    preventDeleteOrBackspace() {
      var me = this;

      me.$refs.input.onkeydown = function (e) {
        if (e.keyCode == 8 || e.keyCode == 46) {
          e.preventDefault();
        }
      };
    },

    /**
     * Hàm tiếp tục cho người dùng có thể sử dụng nút delete hoặc backspace
     * Created by: VDDong (13/07/2022)
     */
    continueAllowDeleteOrBackspace() {
      var me = this;
      me.$refs.input.onkeydown = function (e) {
        if (e.keyCode != 8 && e.keyCode != 46) {
          return true;
        }
      };
    },

    /**
     * Bấm enter thì mới search tài sản (chỉ dùng cho input search
     * Created by: VDDong (28/07/2022)
     */
    onEnter() {
      if (this.fieldName == "searchAssets") {
        //Lấy giá trị từ ô input
        let value = document.getElementsByClassName("m-input-search-assets")[0].value;
        this.$emit("searching", value);
      }
      if (this.fieldName == "searchLicenses") {
        //Lấy giá trị từ ô input
        let value = document.getElementsByClassName(
          "m-input-search-licenses"
        )[0].value;
        this.$emit("searching", value);
      }
    },
  },
};
</script>
