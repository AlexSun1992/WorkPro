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
export default {
  name: "ControlToggle",
  computed: {
    toggleCollapseData() {
      return this.$store.getters["blocks/isCollapseVisible"];
    },
    featureFlag() {
      if (!process.server) {
        return new URL(window.location.href, "https://reso.ru").searchParams.has("LK2-889");
      }
      return null;
    },
  },
  methods: {
    toggleCollapse() {
      this.$store.dispatch("blocks/toggleCollapse", this.toggleCollapseData);
    },
  },
};
</script>
