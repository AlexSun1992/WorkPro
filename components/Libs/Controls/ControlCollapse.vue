<template>
  <div :class="{ collapse_show: isVisible, collapse_hide: !isVisible }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ControlCollapse",

  props: {
    value: {
      type: Boolean,
      default: undefined,
    },
  },

  computed: {
    isVisible() {
      if (this.value !== undefined) {
        return this.value;
      }
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
