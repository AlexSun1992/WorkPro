<template>
  <div>
    <div class="conf-block">
      <div class="title-page mb-3">Загрузите документы</div>
      <div v-for="document in getTypesDocumentation" :key="document.TYPE_TITLE" >
        <b class="p1">{{ document.TYPE_TITLE }}</b>
        <div v-html="document.TYPE_DESCRIPTION" class="mb-4"/>
        <div v-for="doc in document.DOCS" :key="doc.NAME">
          <div>
            <b>{{ doc.TITLE }}</b>
            <p v-html="doc.DESCRIPTION" />
            <upload-drop
              @update="changeFiles(doc.NAME, $event)"
              @remove="removeFile($event)"
              @click="clickDrop"
              :files="doc.FILES"
              :name="doc.NAME"
              :file-objects="getFileObjects"
              :file-errors="getFileErrors"
              :all-size="getAllSize"
              :is-error-size="isErrorSize"
              :is-loading="isLoading"
              :max-file-count="doc.MAX_FILE_COUNT"
              :max-file-size="doc.MAX_FILE_SIZE"
              :total-limit="getFormSettings.TOTAL_LIMIT"
              :file-extensions="getFormSettings.FILE_EXTENSIONS"
            />
          </div>
        </div>
      </div>

  
      <b-alert
        data-testid="danger-alert"
        :show="Boolean(getErrorMessage)"
        variant="danger"
        class="mt-3 mb-0"
        v-html="getErrorMessage"
      />
      
      <b-progress
        v-if="isLoading"
        style="display: none"
        class="mt-2"
        :max="max"
        show-value
      >
        <b-progress-bar
          :value="getProgressValue"
          variant="success"
        ></b-progress-bar>
      </b-progress>
      <b-button
        v-if="isLoading"
        style="display: none"
        variant="success"
        @click="canselUploading"
        class="mt-3"
      >
        Отменить загрузку файлов
      </b-button>
    </div>
    <uploader-buttons ref="uploadButtons" />
  </div>
</template>

<script>
import UploaderButtons from "../../../Buttons/UploaderButtons.vue";
import UploadDrop from "@/components/Pages/Cabinet/Upload/UploadDrop.vue";

export default {
  name: "UploaderPage",
  components: { UploadDrop, UploaderButtons },
  async fetch({ store, route }) {
    await store.dispatch("uploader/fetchData", {
      ...route.params,
    });
  },
  data() {
    return {
      value: 45,
      max: 100,
    };
  },
  methods: {
    changeFiles(name, data) {
      this.$store.dispatch("uploader/addData", { data, name });
    },
    removeFile(file) {
      this.$store.dispatch("uploader/delFile", file);
    },
    async saveDataUploader() {
      await this.$store.dispatch("uploader/saveDataUploader", {
        ...this.$route.params,
      });
    },
    canselUploading() {
      this.$store.dispatch("uploader/cancelUploading");
    },
    clickDrop() {
      this.$store.commit("uploader/setFileErrors", []);
    },
  },
  computed: {
    getData() {
      return this.$store.getters["uploader/getData"];
    },
    getTypesDocumentation() {
      const documents = [];
      this.getData.forEach((doc) => {
        if (!documents.some((el) => el.TYPE_TITLE === doc.TYPE_TITLE)) {
          documents.push({
            TYPE_TITLE: doc.TYPE_TITLE,
            TYPE_DESCRIPTION: doc.TYPE_DESCRIPTION,
            DOCS: [],
          });
        }
        documents.find((el) => el.TYPE_TITLE === doc.TYPE_TITLE).DOCS.push(doc);
      });
      return documents;
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
    isInValidFiles() {
      return this.$store.getters["uploader/isInValidFiles"];
    },
    getFormSettings() {
      return this.$store.getters["uploader/getFormSettings"];
    },
    getProgressValue() {
      return this.$store.getters["uploader/getProgressValue"];
    },
    getFileErrors() {
      return this.$store.getters["uploader/getFileErrors"];
    },
  },
};
</script>

<style scoped></style>
