<template>
  <div class="col-lg-12">
    <div v-for="(item, i) in getData" :key="i">
      <b>{{ item.NAME }}</b>
      <upload-drop @update="changeFiles($event)" :data="item.FILES" />
    </div>
  </div>
</template>

<script>
import UploadDrop from "@/components/Pages/Cabinet/Upload/UploadDrop.vue";

export default {
  name: "UploaderPage",
  components: { UploadDrop },
  async fetch({ store, route }) {
    await store.dispatch("uploader/fetchData", {
      ...route.params,
    });
  },
  methods: {
    changeFiles(e) {
      console.log("changeFiles", e);
    },
  },
  computed: {
    getData() {
      return this.$store.getters["uploader/getData"];
    },
  },
};
</script>

<style scoped></style>
