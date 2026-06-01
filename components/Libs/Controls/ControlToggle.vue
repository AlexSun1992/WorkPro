<template>
  <div>
    <button
      v-if="featureFlag"
      @click="toggleCollapse()"
      class="toggleControl"
    >
      <slot></slot>
    </button>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "@nuxtjs/composition-api";

export default {
  name: "ControlToggle",
  setup() {
    const store = useStore();

    const toggleCollapseData = computed(() => store.getters["blocks/isCollapseVisible"]);

    const featureFlag = computed(() => {
      if (!process.server) {
        return new URL(window.location.href, "https://reso.ru").searchParams.has("LK2-889");
      }
      return null;
    });

    const toggleCollapse = () => {
      store.dispatch("blocks/toggleCollapse", toggleCollapseData.value);
    };

    return {
      toggleCollapseData,
      featureFlag,
      toggleCollapse,
    };
  },
};
</script>
