<template>
  <div>
    <button
      type="button"
      class="btn btn-secondary link-button"
      @click="clickLink"
    >
      {{ data.label }}
    </button>
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
