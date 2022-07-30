<template>
  <button class="base-button-text" :class="btnType" @click="$emit('click')">
    {{text}}
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: null,
    },
    btnType: {
      type: String,
      default: "main-btn",
    }
  },
};
</script>