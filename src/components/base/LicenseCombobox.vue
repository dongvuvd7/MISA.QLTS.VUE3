<template>
  <div class="base-combobox">
    <!-- Icon bên trái -->
    <div class="base-input-icon">
      <div class="input-icon" :class="icon"></div>
    </div>

    <!-- Ô nhập liệu -->
    <input
      type="text"
      class="base-input"
      :placeholder="placeholder"
      :class="{
        'input-with-icon': withIcon,
        'error-input': error,
        'm-input-required': required,
      }"
      v-model="selectedValue"
      :required="required"
      @keyup="inputOnKeyUp"
      @click="showList = !showList"
      @blur="hideComboboxList()"
      :indexSpec="indexSpec"
      :valueName="selectedValue"
    />

    <!-- Text thông báo lỗi -->
    <div class="error-msg">{{ errorMsg }}</div>

    <!-- Nút đóng mở menu -->
    <div class="open-menu-button" @click="showList = !showList">
      <div class="open-menu-icon"></div>
    </div>

    <!-- Danh sách các item của combobox -->
    <div
      class="base-combobox-list"
      :style="{ 'max-height': showList ? '175px' : '0px' }"
    >
      <div
        class="base-combobox-item"
        v-for="(item, index) in items"
        :key="item.id"
        @click="itemOnClick(item.value)"
        :class="{
          selected: item.value == selectedValue,
          hovered: index == selectedIndex,
        }"
        :style="{ display: displayed(item.value) ? 'flex' : 'none' }"
        @mouseenter="enterClick()"
        @mouseleave="leaveClick()"
      >
        <div class="item-value" :title="item.value">{{ item.value }}</div>
        <div class="item-des" v-if="item.des != null" :title="item.des">
          {{ item.des }}
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { bus } from "../../main";

export default {
  props: {
    //Placeholder
    placeholder: {
      type: String,
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
    //Giá trị ban đầu
    value: {},
    //Các item
    items: {
      type: Array,
      default: null,
    },
    //Tên trường của đối tượng từ component cha
    fieldName: {
      type: String,
      default: "",
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
    //Hiển thị lỗi
    showError: {
      type: Boolean,
      default: false,
    },
    indexSpec: {
      type: Number,
      default: -1,
    },
  },

  data() {
    return {
      showList: false, //mở/đóng các options
      selectedIndex: -1, //vị trí của item được chọn
      selectedValue: "", //giá trị của item được chọn
      error: false, //có hiển thị lỗi hay không
      overClick: false, //biến kiểm tra xem chuột có di chuyển vào các option hay không ? -> phân biệt blur với click
    };
  },

  created() {
    //Gán giá trị ở ô input là giá trị của prop value
    this.selectedValue = this.value;
    //Bắt sự kiện validate từ bus
    bus.$on("validate", this.validate);
  },

  watch: {
    selectedValue(value) {
      this.selectedIndex = -1;
      if (value == "") {
        this.$emit("itemOnClick", "");
      }
      //Khi thay đổi giá trị được chọn thì validate
      this.validate();
    },
    showList() {
      this.selectedIndex = -1;
    },
    value(value) {
      this.selectedValue = value;
    },
    showError() {
      if (this.value == "") {
        this.error = true;
      } else this.error = false;
    },
  },

  methods: {
    /**
     * Khi di chuyển chuột vào các option
     * Created by: VDDong (09/07/2022)
     */
    enterClick() {
      //Gán overClick = true để tránh lỗi click và focusout overlapping (khi click thì focusout sẽ chạy trước mà không chạy click)
      this.overClick = true;
    },
    /**
     * Khi di chuyển chuột ra khỏi các option
     * Created by: VDDong (09/07/2022)
     */
    leaveClick() {
      this.overClick = false;
    },
    /**
     * Ẩn danh sách các option sổ xuống
     * Created by: VDDong (09/07/2022)
     */
    hideComboboxList() {
      if (!this.overClick) {
        this.showList = false;
      }
    },

    /**
     * Kiểm tra xem 1 item có chứa từ khoá đang search hay không
     * CreatedBy: VDDong (13/07/2022)
     */
    displayed(value) {
      //   return value.toLowerCase().includes(this.selectedValue.toLowerCase());
      return value;
    },
    /**
     * Đếm số item đang hiển thị
     * CreatedBy: VDDong (13/07/2022)
     */
    countDisplayed() {
      var res = this.items.length;
      this.items.forEach((item) => {
        var value = item.value;
        if (!this.displayed(value)) {
          res--;
        }
      });
      return res;
    },
    /**
     * Click vào 1 item
     * CreatedBy: VDDong (13/07/2022)
     */
    itemOnClick(value) {
      this.selectedValue = value;
      this.overClick = false;
      this.hideComboboxList();
      this.$emit("itemOnClick", this.selectedValue); //emit event cho component cha
    },
    /**
     * Nhấn các phím mũi tên và enter
     * CreatedBy: VDDong (13/07/2022)
     */
    inputOnKeyUp: function (event) {
      this.showList = true;
      var count = this.countDisplayed();
      if (event.key == "ArrowDown") {
        //Nhấn mũi tên xuống chọn item gần nhất phía dưới đang hiển thị nếu có
        if (count != 0) {
          do {
            this.moveDown();
          } while (!this.displayed(this.items[this.selectedIndex].value));
        }
      }
      if (event.key == "ArrowUp") {
        //Nhấn mũi tên lên chọn item gần nhất phía trên đang hiển thị nếu có
        if (count != 0) {
          do {
            this.moveUp();
          } while (!this.displayed(this.items[this.selectedIndex].value));
        }
      }
      if (event.key == "Enter") {
        //Nhấn enter thì chọn item hiện tại
        if (this.selectedIndex != -1) {
          //Gán vào selectedValue để đưa lên ô input
          this.selectedValue = this.items[this.selectedIndex].value;
          //   var id = this.items[this.selectedIndex].id;
          //   var value = this.items[this.selectedIndex].value;
          //   var des = this.items[this.selectedIndex].des;
          //Emit event itemOnClick cho component cha
          this.$emit("itemOnClick", this.selectedValue);
        }
        //Đóng menu
        this.showList = false;
      }

      //scroll đến item đang chọn
      const element = document.getElementsByClassName(
        "base-combobox-item hovered"
      );
      if (element.length > 0) {
        element[0].scrollIntoView({ behavior: "smooth" });
      }
    },
    /**
     * Điều hướng phím mũi tên item dưới/trên
     * CreatedBy: VDDong (13/07/2022)
     */
    moveDown: function () {
      if (this.selectedIndex < this.items.length - 1) this.selectedIndex += 1;
      else this.selectedIndex = 0;
      //scroll đến item đang chọn
      const element = document.getElementsByClassName(
        "base-combobox-item hovered"
      );
      if (element.length > 0) {
        element[0].scrollIntoView({ behavior: "smooth" });
      }
    },
    moveUp: function () {
      if (this.selectedIndex > 0) this.selectedIndex -= 1;
      else this.selectedIndex = this.items.length - 1;
      //scroll đến item đang chọn
      const element = document.getElementsByClassName(
        "base-combobox-item hovered"
      );
      if (element.length > 0) {
        element[0].scrollIntoView({ behavior: "smooth" });
      }
    },

    /**
     * Kiểm tra và báo lỗi để trống ô input required bắt buộc nhập
     * CreatedBy: VDDong (13/07/2022
     */
    validate() {
      if (this.required && this.selectedValue == "") {
        this.error = true;
      } else this.error = false;
    },
  },
};
</script>

