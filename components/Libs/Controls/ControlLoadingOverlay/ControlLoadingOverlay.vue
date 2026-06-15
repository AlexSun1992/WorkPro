<template>
  <div
    v-if="visibleComputed"
    class="overlay"
    @click="click"
  >
    <lottie-vue-player
      src="/img/loader.json"
      :player-controls="false"
      :autoplay="true"
      :loop="true"
    >
    </lottie-vue-player>
  </div>
</template>

<script>
export default {
  name: "ControlLoadingOverlay",
  props: {
    visible: {
      type: Boolean,
      default: null,
    },
    isFullPage: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    visibleComputed() {
      return this.visible !== null ? this.visible : this.$store?.getters["data_card/getLoaderVisible"] ?? false;
    },
  },
  methods: {
    click() {
      this.$emit("input");
    },
  },
};
</script>
