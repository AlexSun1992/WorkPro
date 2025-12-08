<template>
  <component
    :is="linkComponent"
    v-bind="linkProps"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script>
import { defineComponent, computed, getCurrentInstance } from "vue";

export default defineComponent({
  name: "Link",
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  setup({ url }) {
    const store = getCurrentInstance().proxy.$store;
    const isInternalLink = computed(() => {
      return url.slice(1).split("/")[0] === "cabinet";
    });
    const linkComponent = computed(() => {
      return isInternalLink.value ? "nuxt-link" : "a";
    });
    const linkProps = computed(() => {
      const propKey = isInternalLink.value ? "to" : "href";
      return { [propKey]: url };
    });

    const handleClick = () => {
      if (isInternalLink.value) store.commit("ui/loader/setShowLoader", true);
    };

    return {
      linkComponent,
      linkProps,
      handleClick,
    };
  },
});
</script>

<style scoped></style>
