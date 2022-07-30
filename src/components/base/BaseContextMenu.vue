<template>
  <div>
    <div
      class="dialog-modal-context-menu"
      :class="{ active_modal: !isShowContextMenu }"
      @click="closeMenuContext()"
      :style="{}"
    ></div>
    <div id="context-menu" :style="{ top: mcTop, left: mcLeft }">
      <div id="dropdown" @blur="closeMenuContext()">
        <div
          class="dropdown-content"
          :class="{ hide: !isShowContextMenu }"
          @blur="closeMenuContext()"
        >
          <!-- <div
        class="dropdown-content"
        :class="{ hide: !isShowContextMenu }"
        @blur="closeMenuContext()"
        v-click-outside-app="closeMenuContext"
      > -->
          <div
            class="dropdown-content-a"
            @mouseenter="enterClick()"
            @mouseleave="leaveClick()"
            @click="mcAddOnClick()"
          >
            Thêm
          </div>
          <div
            class="dropdown-content-a"
            @mouseenter="enterClick()"
            @mouseleave="leaveClick()"
            @click="mcEditOnClick()"
          >
            Sửa
          </div>
          <div
            class="dropdown-content-a"
            @mouseenter="enterClick()"
            @mouseleave="leaveClick()"
            @click="mcDeleteOnClick()"
          >
            Xóa
          </div>
          <div
            class="dropdown-content-a"
            @mouseenter="enterClick()"
            @mouseleave="leaveClick()"
            @click="mcCopyOnClick()"
          >
            Nhân bản
          </div>
        </div>
      </div>
    </div>
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
      @mcConfirmDelete="mcConfirmDelete"
    />
    <!-- Toast message -->
    <base-toast v-if="showToast" :text="toastMsg" />
  </div>
</template>

<script>
import axios from "axios";
import { bus } from "../../main";

// import Enums from "../common/enum.js";
import Resources from "../common/resource.js";

import BasePopup from "../base/BasePopup.vue";
import BaseToast from "../base/BaseToast.vue";

export default {
  /**
   * directives là tự định nghĩa đoạn lệnh để tương tác với DOM (một số directives mặc định trong VUE như v-for, v-on, v-model, ...)
   * Ở đây đang tự định nghĩa v-click-outside-app để bắt các sự kiện click ra ngoài context menu thì đóng context menu
   * Click ở bất kì đâu ngoài context menu thì chạy đến hàm "closeMenuContext" (khai báo ở v-click-outside-app=)
   * Hoặc có thể dùng thư viện: https://www.npmjs.com/package/v-click-outside
   */
  // directives: {
  //   "click-outside-app": {
  //     bind: function (el, binding) {
  //       // Define ourClickEventHandler
  //       const ourClickEventHandler = (event) => {
  //         if (!el.contains(event.target) && el !== event.target) {
  //           // as we are attaching an click event listern to the document (below)
  //           // ensure the events target is outside the element or a child of it
  //           binding.value(event); // before binding it
  //         }
  //       };
  //       // attached the handler to the element so we can remove it later easily
  //       el.__vueClickEventHandler__ = ourClickEventHandler;

  //       // attaching ourClickEventHandler to a listener on the document here
  //       document.addEventListener("click", ourClickEventHandler);
  //     },
  //     unbind: function (el) {
  //       // Remove Event Listener
  //       document.removeEventListener("click", el.__vueClickEventHandler__);
  //     },
  //   },
  // },

  components: {
    BasePopup,
    BaseToast,
  },

  props: {
    mcTop: {
      type: String,
      default: "10px",
    },
    mcLeft: {
      type: String,
      default: "0px",
    },
    isShowContextMenu: {
      type: Boolean,
      default: false,
    },
    rightClickedAsset: {
      type: Object,
      default: null,
    },
    rightClickedIndex: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      // Biến để phân biệt click vs blur (trong trường hợp click vào lựa chọn dropdown content thì blur sẽ chạy trước click)
      overClick: false,
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
      showToast: false,
      toastMsg: "",
    };
  },
  methods: {
    /**
     * Phân biệt chuột di chuyển vào/ra dropdown content
     * Created by: VDDong (13/07/2022)
     */
    enterClick() {
      this.overClick = true;
    },
    leaveClick() {
      this.overClick = false;
    },

    /**
     * Thêm mới bản ghi từ context menu
     * Created by: VDDong (21/06/2022)
     */
    mcAddOnClick() {
      var me = this;
      me.$emit("menuContextAddOnClick");
      me.$emit("closeMenuContext");
    },

    /**
     * Sửa bản ghi từ context menu
     * Created by: VDDong (21/06/2022)
     */
    mcEditOnClick() {
      var me = this;
      me.$emit("menuContextEditOnClick", me.rightClickedAsset);
      me.$emit("closeMenuContext");
    },

    /**
     * Xóa bản ghi từ context menu
     * Bật popup cảnh báo xác nhận xóa
     * (Gọi request xóa luôn tại hàm này cũng được)
     * Created by: VDDong (21/06/2022)
     */
    mcDeleteOnClick() {
      var me = this;

      //Hiển thị popup
      // me.popupInfo.displayed = true;
      // me.popupInfo.text = [
      //   Resources.Notice.ConfirmSingleDelete +
      //     ` ${me.rightClickedAsset.assetCode} - ${me.rightClickedAsset.assetName}?`,
      // ];
      // me.popupInfo.subBtn = false;
      // me.popupInfo.outlineBtn = true;
      // me.popupInfo.mainBtnText = Resources.TextBtn.Delete;
      // me.popupInfo.outlineBtnText = Resources.TextBtn.No;
      // me.popupInfo.action = Enums.Action.DeleteFromMenuContext;

      //Gọi api xoá dữ liệu
      axios
        .delete(Resources.API.DeleteAsset + `${me.rightClickedAsset.assetId}`)
        .then(function () {
          //Xóa bản ghi vừa xóa ra khỏi danh sách selectedAsset
          // me.selectedAsset = me.selectedAsset.filter(asset => !idToDelete.includes(asset.assetId));

          //Emit event loadData để load lại trang
          bus.$emit("loadData");
          /* Show toast message */
          me.showToast = true;
          me.toastMsg = Resources.ToastMsg.DeleteSuccess;
          //Ẩn sau 4s
          setTimeout(() => {
            me.showToast = false;
          }, 4000);
        })
        .catch((error) => {
          console.log(error);
        });

      me.$emit("closeMenuContext");
    },

    /**
     * Nhân bản bản ghi từ context menu
     * Created by: VDDong (21/06/2022)
     */
    mcCopyOnClick() {
      var me = this;
      me.$emit("menuContextCopyOnClick", me.rightClickedAsset);
      me.$emit("closeMenuContext");
    },
    /**
     * Xác nhận xóa bản ghi đang right click bật context menu
     * Created by: VDDong (21/06/2022)
     */
    mcConfirmDelete() {
      var me = this;
      //Gọi api xoá dữ liệu
      axios
        .delete(Resources.API.DeleteAsset + `${me.rightClickedAsset.assetId}`)
        .then(function () {
          //Xóa bản ghi vừa xóa ra khỏi danh sách selectedAsset
          // me.selectedAsset = me.selectedAsset.filter(asset => !idToDelete.includes(asset.assetId));

          //Emit event loadData để load lại trang
          bus.$emit("loadData");
        })
        .catch((error) => {
          console.log(error);
        });
    },

    /**
     * Đóng menu context khi click ra ngoài
     * (Bắt sự kiện blur nhưng không ăn)
     */
    closeMenuContext() {
      this.$emit("closeMenuContext");
    },
  },

  /**
   * Một cách khác để bắt sự kiện click ra ngoài context menu mà không dùng directives hay thư viện
   * Mỗi khi click chuột ở bất kì đầu thì nó sẽ luôn chạy đến hàm closeMenuContext (cũng như dùng directives v-click-outside-app)
   */
  // mounted () {
  //   document.addEventListener('click', this.closeMenuContext)
  // },
  // beforeDestroy () {
  //   document.removeEventListener('click',this.closeMenuContext)
  // }
};
</script>

<style scoped>
.dialog-modal-context-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  z-index: 1;
}
.active_modal {
  display: none;
}
#context-menu {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: fixed;
  z-index: 1;
  top: 0px;
  left: 0px;
}
#dropdown {
  position: relative;
  display: inline-block;
}
#dropdown-icon:hover {
  border-color: aqua;
}
.dropdown-content {
  position: absolute;
  right: 0px;
  top: 0px;
  background-color: #fff;
  overflow: auto;
  width: 100px;
  height: 158px;
  border: 1px solid #babec5;
  box-sizing: border-box;
  border-radius: 4px;
}
.dropdown-content-a {
  font-size: 13px;
  height: 39px;
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-left: 8px;
  border: none;
  outline: none;
  border-bottom: 1px solid  #eaeaea;
}
.dropdown-content-a:hover {
  background-color: #f1f1f1;
  color: #1aa4c8;
  cursor: pointer;
}
.hide {
  display: none;
}
</style>