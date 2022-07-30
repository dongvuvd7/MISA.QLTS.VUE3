<template>
  <div id="header">
    <div class="header-left">Danh sách tài sản</div>
    <div class="header-right">
      <div class="header-right-text">Sở tài chính</div>
      <div class="header-right-year">
        Năm
        <div class="year-number"><strong>2022</strong></div>
        <div class="icon-double-arrow"></div>
      </div>
      <div class="list-icon">
        <div
          class="header-icon"
          v-for="icon in icons"
          :key="icon"
          :class="icon"
        ></div>
      </div>
      <div
        class="header-right-profile"
        @click="this.showLogout = !this.showLogout"
      >
        <div class="icon-profile"></div>
        <div class="icon-arrow-down"></div>
      </div>
      <div
        v-if="this.showLogout == true"
        @click="btnLogoutOnClick()"
        class="excel-tool-item"
      >
        Đăng xuất
      </div>
    </div>
  </div>
</template>


<script>

import { mapActions } from "vuex";

export default {
  components: {},

  data() {
    return {
      icons: ["icon-notification", "icon-option", "icon-help"], // các icon trong header
      showLogout: false, // hiển thị nút đăng xuất hay không
    };
  },

  methods: {

    ...mapActions(["logout"]),

    /**
     *
     */
    async btnLogoutOnClick() {
      await this.logout();
      this.$router.push("/");
      this.showLogout = false;
    },

  },
};
</script>

<style scoped>
.excel-tool-item {
  position: absolute;
  top: 40px;
  right: 20px;
  z-index: 2;
  background-color: rgb(255, 255, 255);
}
.excel-tool-item:hover {
  background-color: rgb(236, 236, 236);
}
</style>
