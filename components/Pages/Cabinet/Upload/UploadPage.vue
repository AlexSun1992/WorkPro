<template>
  <div class="col-lg-12">
    <upload-drop @update="changeFiles($event)" />
    <upload-drop @update="changeFiles($event)" />
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
    fileTypes() {
      return this.$store.getters["uploader/fileTypes"];
    },
    files() {
      return this.$store.getters["uploader/files"];
    },
  },
};
</script>

<style scoped></style>
