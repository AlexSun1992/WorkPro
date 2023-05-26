<template>
  <div>{{ getData }}</div>
</template>

<script>
export default {
  name: "UploaderPage",
  async fetch({ store, route }) {
    await store.dispatch("uploader/fetchData", {
      ...route.params,
    });
  },
  computed: {
    getData() {
      return this.$store.getters["uploader/getData"];
    },
  },
};
</script>

<style scoped></style>
