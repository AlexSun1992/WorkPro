<template>
  <div>
    <b-button
      :class="data.labelCols + ' link-button'"
      @click="clickLink"
      variant="secondary"
      >{{ data.label }}</b-button>
  </div>
</template>

<script>
export default {
  name: "ControlLink",
  data() {
    return {
      editShow: false,
    };
  },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  methods: {
    clickLink() {
      this.$store.commit("data_card/setListPath", this.$route.fullPath);
      this.$emit("open-card", this.data);
    },
},
};
</script>

<style scoped></style>
