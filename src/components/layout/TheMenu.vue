<template>
  <div id="navbar" :style="{ 'min-width': expand ? '220px' : '66px' }">
    <div class="logo-box">
      <div class="logo-box-icon" @click="expand = true"></div>
      <div class="logo-text" v-if="expand">MISA QLTS</div>
    </div>
    <div class="navbar-list">
      <div class="nav-item">
        <router-link to="/overview">
          <div class="icon-overview"></div>
          <div class="nav-text" v-if="expand">Tổng quan</div>
        </router-link>
      </div>
      <div class="nav-item" style="opacity: 1;" @click="turnSubMenu()">
        <router-link to="/asset">
          <div class="icon-asset"></div>
          <div class="nav-text" v-if="expand">Tài sản</div>
          <div class="icon-chevron-down" v-if="expand"></div>
        </router-link>
      </div>

      <div class="sub-menu" v-if="expand && expandSubMenu">
        <div class="sub-menu-item">
          <router-link to="/write-asset">
            <div class="nav-text" v-if="expand">Ghi tăng</div>
          </router-link>
        </div>
        <div class="sub-menu-item">
          <router-link to="/#">
            <div class="nav-text" v-if="expand">Thay đổi thông tin</div>
          </router-link>
        </div>
        <div class="sub-menu-item">
          <router-link to="/#">
            <div class="nav-text" v-if="expand">Đánh giá lại</div>
          </router-link>
        </div>
        <div class="sub-menu-item">
          <router-link to="/#">
            <div class="nav-text" v-if="expand">Tính hao mòn</div>
          </router-link>
        </div>
        <div class="sub-menu-item">
          <router-link to="/#">
            <div class="nav-text" v-if="expand">Điều chuyển tài sản</div>
          </router-link>
        </div>
        <div class="sub-menu-item">
          <router-link to="/#">
            <div class="nav-text" v-if="expand">Ghi giảm</div>
          </router-link>
        </div>
        <div class="sub-menu-item">
          <router-link to="/#">
            <div class="nav-text" v-if="expand">Kiểm kê</div>
          </router-link>
        </div>
        <div class="sub-menu-item">
          <router-link to="/#">
            <div class="nav-text" v-if="expand">Khác</div>
          </router-link>
        </div>
      </div>

      <div class="nav-item">
        <a>
          <div class="icon-road"></div>
          <div class="nav-text" v-if="expand">Tài sản HT-ĐB</div>
          <div class="icon-chevron-down" v-if="expand"></div>
        </a>
      </div>
      <div class="nav-item">
        <a>
          <div class="icon-tool"></div>
          <div class="nav-text" v-if="expand">Công cụ sử dụng</div>
          <div class="icon-chevron-down" v-if="expand"></div>
        </a>
      </div>
      <div class="nav-item">
        <a>
          <div class="icon-category"></div>
          <div class="nav-text" v-if="expand">Danh mục</div>
          <div class="icon-chevron-down" v-if="expand"></div>
        </a>
      </div>
      <div class="nav-item">
        <a>
          <div class="icon-search"></div>
          <div class="nav-text" v-if="expand">Tra cứu</div>
          <div class="icon-chevron-down" v-if="expand"></div>
        </a>
      </div>
      <div class="nav-item">
        <a>
          <div class="icon-report"></div>
          <div class="nav-text" v-if="expand">Báo cáo</div>
          <div class="icon-chevron-down" v-if="expand"></div>
        </a>
      </div>
    </div>
    <div class="navbar-footer" v-if="expand">
      <div class="minimize-button" @click="expand = false"></div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      expand: false, // mở rộng/thu gọn menu (ban đầu là thu gọn)
      expandSubMenu: true, //mở rộng/thu gọn menu con
    };
  },

  methods: {
    /**
     * 
     */
    turnSubMenu() {
      this.expandSubMenu = !this.expandSubMenu;
    },

  },
};
</script>
