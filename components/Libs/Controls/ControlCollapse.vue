<template>
  <div
    :class="{
      collapse_show: isCollapseVisible,
      collapse_hide: !isCollapseVisible,
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ControlCollapse",
  computed: {
    isCollapseVisible() {
      return this.$store.getters["blocks/isCollapseVisible"];
    },
  },
};
</script>

<style scoped>
.collapse_hide {
  display: none;
}
.collapse_show {
  display: block;
}
</style>
