<template>
  <div id="app">
    <the-menu />
    <div class="main-section">
      <the-header />
      <the-content />
    </div>
  </div>
</template>

<script>
import TheMenu from "./components/layout/TheMenu.vue";
import TheHeader from "./components/layout/TheHeader.vue";
import TheContent from "./components/layout/TheContent.vue";

export default {
  name: "App",

  components: {
    TheMenu,
    TheHeader,
    TheContent,
  },

  data: () => ({}),
};
</script>

<style>
@import url("./style/main.css");
.main-section {
  flex-grow: 1;
  background-color: #f4f7ff;
  overflow: hidden;
}
#app{
  display: flex;
  width: 100%;
}
</style>