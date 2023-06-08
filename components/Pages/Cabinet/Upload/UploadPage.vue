<template>
  <div class="col-lg-12">
    <h1>Загрузите документы</h1>
    <div v-for="(item, i) in getData" :key="i">
      <b>{{ item.TITLE }}</b>
      <p></p>
      <upload-drop
        @update="changeFiles(item.NAME, $event)"
        @remove="removeFile($event)"
        :data="item.FILES"
        :file-objects="getFileObjects"
        :all-size="getAllSize"
        :is-error-size="isErrorSize"
        :is-loading="isLoading"
        :max-file-count="item.MAX_FILE_COUNT"
        :max-file-size="item.MAX_FILE_SIZE"
        :total-limit="getFormSettings.TOTAL_LIMIT"
        :file-extensions="getFormSettings.FILE_EXTENSIONS"
      />
    </div>
    <div class="row">
      <div class="col-12">
        <b-alert
          data-testid="danger-alert"
          :show="isError"
          variant="danger"
          class="mt-3 mb-0"
          v-html="getErrorMessage"
        />
      </div>
    </div>
    <!--    <button @click="saveDataUploader">Отправить</button>-->
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
    async saveDataUploader() {
      await this.$store.dispatch("uploader/saveDataUploader", {
        ...this.$route.params,
      });
    },
  },
  computed: {
    getData() {
      return this.$store.getters["uploader/getData"];
    },
    getFileObjects() {
      return this.$store.getters["uploader/getFileObjects"];
    },
    getAllSize() {
      return this.$store.getters["uploader/getAllSize"];
    },
    isErrorSize() {
      return this.$store.getters["uploader/isErrorSize"];
    },
    getErrorMessage() {
      return this.$store.getters["uploader/getErrorMessage"];
    },
    isError() {
      return this.$store.getters["uploader/isLoadSuccessFull"] === false;
    },
    isLoading() {
      return this.$store.getters["uploader/isLoading"];
    },
    isValidFiles() {
      return this.$store.getters["uploader/isInValidFiles"];
    },
    getFormSettings() {
      return this.$store.getters["uploader/getFormSettings"];
    },
  },
};
</script>

<style scoped></style>
