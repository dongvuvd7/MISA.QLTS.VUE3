<template>
  <div class="toast-container">
    <div class="toast-icon">
      <div class="icon-green-check"></div>
    </div>
    <div class="toast-text">{{text}}</div>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: null,
    },
  },
};
</script>