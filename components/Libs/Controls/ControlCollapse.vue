<template>
  <div :class="{ collapse_show: isVisible, collapse_hide: !isVisible }">
    <slot></slot>
  </div>
</template>

<script>
import { computed, getCurrentInstance } from "vue";

export default {
  name: "ControlCollapse",
  props: {
    value: {
      type: Boolean,
      default: undefined,
    },
  },
  emits: ["input"],
  setup(props) {
    const instance = getCurrentInstance();
    const { $store } = instance.proxy;
    const isVisible = computed(() => {
      if (props.value !== undefined) {
        return props.value;
      }
      return $store.getters["blocks/isCollapseVisible"];
    });
    return { isVisible };
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
