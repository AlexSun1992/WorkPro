<template>
  <div class="col-lg-12">
    <div v-for="(item, i) in getData" :key="i">
      <b>{{ item.DESCRIPTION }}</b>
      <upload-drop
        @update="changeFiles(item.NAME, $event)"
        @remove="removeFile($event)"
        :limit-size="20971520"
        :data="item.FILES"
        :file-objects="getFileObjects"
      />
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
    changeFiles(name, data) {
      const files = data.map((item) => ({
        FILENAME: item.name,
        SIZE: item.size,
        NAME: name,
      }));
      this.$store.commit("uploader/setFiles", files);
      this.$store.commit("uploader/setFileObjects", data);
    },
    removeFile(file) {
      this.$store.commit("uploader/removeFile", file);
    },
  },
  computed: {
    getData() {
      return this.$store.getters["uploader/getData"];
    },
    getFileObjects() {
      return this.$store.getters["uploader/getFileObjects"];
    },
  },
};
</script>

<style scoped></style>
