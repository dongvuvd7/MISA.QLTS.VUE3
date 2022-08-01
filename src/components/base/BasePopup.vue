<template>
  <div v-if="displayed">
    <div class="popup-modal"></div>
    <div class="popup">
      <div class="popup-content">
        <div class="icon-warning"></div>
        <div class="popup-text">
          <p v-for="line in text" :key="line">
            {{ line }}
          </p>
        </div>
      </div>
      <div class="popup-footer">
        <base-button-text
          :text="outlineBtnText"
          :btnType="'outline-btn'"
          v-if="outlineBtn"
          @click="$emit('closePopup')"
        />
        <base-button-text
          :text="subBtnText"
          :btnType="'sub-btn'"
          v-if="subBtn"
          @click="subBtnOnClick"
        />
        <base-button-text
          :text="mainBtnText"
          :btnType="'main-btn'"
          @click="mainBtnOnClick"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from "../../main";

import Enums from "../common/enum.js";

import BaseButtonText from "../../components/base/BaseButtonText.vue";

export default {
  components: {
    BaseButtonText,
  },

  props: {
    //Có hiển thị hay không
    displayed: {
      type: Boolean,
      default: true,
    },
    //Có hiển thị sub button hay không
    subBtn: {
      type: Boolean,
      default: false,
    },
    //Có hiển thị outline button hay không
    outlineBtn: {
      type: Boolean,
      default: true,
    },
    //Text ở outline button
    outlineBtnText: {
      type: String,
      default: "",
    },
    //Text ở sub button
    subBtnText: {
      type: String,
      default: "",
    },
    //Text ở main button
    mainBtnText: {
      type: String,
      default: "",
    },
    //Hành động đang thực hiện
    action: {
      type: String,
      default: "",
    },
    //Danh sách các message
    text: {
      type: Array,
      default: null,
    },
  },

  methods: {
    /**
     * Nhấn nút main button
     * CreatedBy: VDDong (13/07/2022)
     */
    mainBtnOnClick: function () {
      // var me = this;
      //Nếu đang xoá thì emit event deleteAssets
      if (this.action == Enums.Action.Delete) {
        bus.$emit("delete"); //asset vs license đang có cùng hàm tên delete (hiện tại thì chưa thấy gọi nhầm nhau)
        this.$emit("closePopup");
      }
      //Nếu đang sửa dữ liệu (Asset) thì lưu lại
      else if (this.action == Enums.Action.Put) {
        bus.$emit("saveData"); //bus đang khai báo 2 saveData(asset, license): đang để trùng tên không thấy vấn đề gì, nhưng nên tách riêng ra 2 hàm khác nhau cho đỡ trùng
        this.$emit("closePopup");
      }
      //Nếu đang khai báo tài sản mới thì huỷ khai báo
      else if (this.action == Enums.Action.Post) {
        this.$emit("closeDialog");
        this.$emit("closePopup");
      }
      //Nếu đang xóa tài sản từ menu context
      else if (this.action == Enums.Action.DeleteFromMenuContext) {
        this.$emit("mcConfirmDelete");
        this.$emit("closePopup");
      }
      //Nếu popup xác nhận thêm các bản ghi từ file excel thì emit hàm solveAddRecordsFromExcel ở BaseButtonIcon để tiến hành thêm
      else if (this.action == Enums.Action.AddRecordsFromExcel) {
        bus.$emit("solveAddRecordsFromExcel");
        this.$emit("closePopup");
      }
      //Đóng popup
      else {
        //action thông báo nội dung validate
        if (
          this.text.includes("Mã tài sản không được phép trùng.") ||
          this.text.includes(
            "Mã tài sản không được vượt quá độ dài cho phép là 10."
          )
        ) {
          //add class error-input to input asset code
          document
            .querySelectorAll(".m-input-assetCode")[0]
            .classList.add("error-input");
        } else if (this.text.find((item) => item.includes("Tên tài sản"))) {
          //change error message of m-input-assetName
          if (document.querySelector(".m-input-assetName + .error-msg")) {
            document.querySelector(
              ".m-input-assetName + .error-msg"
            ).innerHTML = this.text.find((item) =>
              item.includes("Tên tài sản")
            );
            //add class error-input to input asset name
            document
              .querySelectorAll(".m-input-assetName")[0]
              .classList.add("error-input");
          }
        } else {
          //remove class error-input to input asset code
          if (document.querySelectorAll(".m-input-assetCode").length != 0)
            document
              .querySelectorAll(".m-input-assetCode")[0]
              .classList.remove("error-input");
        }
        let input = document.querySelector("input.error-input");
        if (input != null) {
          input.focus();
        }
        this.$emit("closePopup");
      }
    },
    /**
     * Nhấn nút sub button
     * CreatedBy: VDDong (13/07/2022)
     */
    subBtnOnClick: function () {
      //Đóng popup và dialog
      this.$emit("closeDialog");
      this.$emit("closePopup");
    },

    /**
     * Bấm ESC để đóng popup
     * (chưa hoàn thiện)
     */
    escPopupOnKeyDown() {
      if (this.action == "validateError") {
        if (this.text.includes("Mã tài sản ")) {
          //add class error-input to input asset code
          document
            .querySelectorAll(".m-input-assetCode")[0]
            .classList.add("error-input");
        } else {
          //remove class error-input to input asset code
          if (document.querySelectorAll(".m-input-assetCode").length != 0)
            document
              .querySelectorAll(".m-input-assetCode")[0]
              .classList.remove("error-input");
        }
        let input = document.querySelector("input.error-input");
        if (input != null) {
          input.focus();
        }
        this.$emit("closePopup");
      } else {
        this.$emit("closePopup");
      }
    },
  },
};
</script>