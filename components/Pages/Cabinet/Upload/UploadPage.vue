<template>
  <div class="col-lg-12">
    <div v-for="(item, i) in getData" :key="i">
      <b>{{ item.DESCRIPTION }}</b>
      <upload-drop
        @update="changeFiles(item.NAME, $event)"
        @remove="removeFile(item.NAME, $event)"
        :data="item.FILES"
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
    },
    removeFile(name, index) {
      this.$store.commit("uploader/removeFile", { name, index });
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
