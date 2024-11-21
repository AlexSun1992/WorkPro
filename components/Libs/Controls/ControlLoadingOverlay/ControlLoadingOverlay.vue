<template>

  <div v-if="visibleComputed"
       @click="click"
       :class="isFullPage ? 'loading-overlay-full' : 'loading-overlay-target'"
       class="loading-overlay">
    <slot name="spinner">
      <div class="overlay-spinner"/>
    </slot>
  </div>

</template>

<script>
export default {
  name: "ControlLoadingOverlay",
  props: {
    visible: {
      default: null,
    },
    isFullPage: {
      default: true
    },
  },
  computed: {
    visibleComputed() {
      return this.visible !== null ? this.visible : this.$store?.getters["data_card/getLoaderVisible"] ?? false;
    }
  },
  methods: {
    click() {
      this.$emit("input");
    }
  }
}
</script>

<style lang="scss" scoped>
.loading-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(239, 239, 240, 0.6);
  z-index: 10000;
  backdrop-filter: blur(1px);
}

.loading-overlay-full {
  position: fixed;
  inset: 0;
}

.loading-overlay-target {
  position: absolute;
  inset: 0;
}

.overlay-spinner {
  width: 2em;
  height: 2em;
  border-top: 0.3em solid #43b02a;
  border-left: 0.3em solid #43b02a;
  border-right: 0.3em solid transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
</style>
