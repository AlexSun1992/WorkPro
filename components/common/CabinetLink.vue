<template>
  <a
    :href="url"
    @click.prevent="handleClick"
  >
    <slot />
  </a>
</template>

<script>
import { defineComponent, computed, getCurrentInstance } from "vue";

export default defineComponent({
  name: "CabinetLink",
  props: {
    url: { type: String, required: true },
  },
  setup(props) {
    const instance = getCurrentInstance();

    const isInternalLink = computed(() => props.url.startsWith("/cabinet"));

    const handleClick = () => {
      if (isInternalLink.value) {
        instance.proxy.$router.push(props.url);
      }
    };

    return {
      isInternalLink,
      handleClick,
    };
  },
});
</script>
