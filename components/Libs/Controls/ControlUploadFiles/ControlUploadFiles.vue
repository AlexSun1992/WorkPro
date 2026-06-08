<template>
  <div>
    <div
      class="title-page mb-3"
      v-if="data.label"
    >
      {{ data.label }}
    </div>
    <div
      class="title-page mb-3"
      v-if="!data.label"
    >
      Загрузите документы
    </div>

    <span
      v-if="isCompressing"
      class="position-relative pe-5"
      >Подождите, идёт загрузка файлов <span class="spinner-border btn-link"><span class="sr-only"></span></span
    ></span>
    <div
      :id="data.fieldId"
      v-for="document in getTypesDocumentation"
      :key="document.TYPE_TITLE"
    >
      <b
        v-if="document.TYPE_TITLE"
        class="p1"
        >{{ document.TYPE_TITLE }}</b
      >
      <div
        v-if="document.TYPE_DESCRIPTION"
        v-html="document.TYPE_DESCRIPTION"
        class="mb-4"
      />
      <div
        v-for="doc in document.DOCS"
        :key="doc.NAME"
      >
        <div>
          <b>{{ doc.TITLE }}</b>
          <span
            v-if="doc.TOOLTIP"
            class="position-relative"
          >
            <span class="tooltipster"
              >(?)
              <vue-easy-tooltip
                :with-arrow="false"
                position="top"
                :offset="4"
              >
                <span v-html="doc.TOOLTIP"></span>
              </vue-easy-tooltip>
            </span>
          </span>
          <p v-html="doc.DESCRIPTION" />
          <upload-drop
            @update="changeFiles(doc.COMPRESS, doc.NAME, $event)"
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
            :total-limit="formSettings.TOTAL_LIMIT"
            :file-extensions="formSettings.FILE_EXTENSIONS"
            :can-download="formSettings.DOWNLOAD"
          />
        </div>
      </div>
    </div>

    <div
      data-testid="danger-alert"
      v-show="Boolean(getErrorMessage)"
      class="mt-3 mb-0 alert alert-danger"
      v-html="getErrorMessage"
    ></div>
    <button
      type="button"
      v-if="isLoading"
      style="display: none"
      class="btn btn-success mt-3"
      @click="cancelUploading"
    >
      Отменить загрузку файлов
    </button>
  </div>
</template>

<script>
import UploadDrop from "./UploadDrop.vue";

export default {
  name: "ControlUploadFiles",
  components: { UploadDrop },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    edit: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },
  data() {
    return {
      value: 45,
      max: 100,
      compressingFilesCount: 0,
    };
  },
  computed: {
    getUploader() {
      const getForm = this.$store.getters["data_card/getForm"];

      if (!getForm) {
        return true;
      }

      const uploaderComponent = Array.from(getForm)?.find((item) => item.type === "uploadFiles");

      if (!Array.isArray(uploaderComponent?.value)) {
        if (uploaderComponent.value?.has("JSON")) {
          const loadedDocsJSON = uploaderComponent.value.get("JSON");

          const getLoadedDocs = JSON.parse(loadedDocsJSON).FILES;

          return getLoadedDocs.length === 0;
        }
      }
      return true;
    },

    settings() {
      return this.data.fileSettings;
    },
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
      return (
        this.$store.getters["uploader/isLoading"] || this.data.readonly || this.isCompressing || this.edit === false
      );
    },
    isInValidFiles() {
      return this.$store.getters["uploader/isInValidFiles"];
    },
    formSettings() {
      return this.$store.getters["uploader/formSettings"];
    },
    getProgressValue() {
      return this.$store.getters["uploader/getProgressValue"];
    },
    getFileErrors() {
      return this.$store.getters["uploader/getFileErrors"];
    },
    isCompressing() {
      return this.compressingFilesCount > 0;
    },
  },
  created() {
    if (this.getUploader) {
      this.$store.commit("uploader/setData", this.settings);
    }
  },

  methods: {
    async compressFile(name, file, isCompressing) {
      this.$store.commit("data_card/setDisabled", true);
      this.$store.commit("data_card/setLoading", true);
      this.compressingFilesCount += 1;
      const formData = new FormData();
      formData.append("file", file);
      let newFile = file;
      if (isCompressing === "N") {
        this.$store.dispatch("uploader/addData", {
          data: [newFile],
          name,
        });
        this.compressingFilesCount -= 1;
        return {};
      }
      return fetch(`https://sc.ya.reso.ru/api/compress`, {
        method: "POST",
        body: formData,
      })
        .then(async (res) => {
          if (res.status === 200) {
            const imageInfo = JSON.parse(res.headers.get("X-Image-Info"));
            if (imageInfo) {
              // Не обрабатывать плохо сжатые файлы
              if (imageInfo.compressionRatio < 2) {
                return;
              }
            }

            const contentDisposition = res.headers.get("Content-Disposition");
            const newFilename = decodeURIComponent(contentDisposition.split("filename*=UTF-8''")[1]);
            const blob = await res.blob();
            newFile = new File([blob], newFilename);
            return;
          }

          const text = await res.text();
          try {
            const json = JSON.parse(text);
            console.error(json.message);
          } catch (err) {
            throw new Error(text);
          }
        })
        .catch((e) => console.error(e))
        .finally(() => {
          this.$store.commit("data_card/setDisabled", false);
          this.$store.commit("data_card/setLoading", false);
          this.$store.dispatch("uploader/addData", { data: [newFile], name });
          this.compressingFilesCount -= 1;
        });
    },
    async changeFiles(isCompressing, name, data) {
      await Promise.all(Array.from(data).map((file) => this.compressFile(name, file, isCompressing))).finally(() => {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: this.$store.getters["uploader/getFormData"],
        });
      });
    },
    removeFile(file) {
      this.$store.dispatch("uploader/delFile", file);
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.$store.getters["uploader/getFormData"],
      });
    },
    async saveDataUploader() {
      await this.$store.dispatch("uploader/saveDataUploader", {
        ...this.$route.params,
      });
    },
    cancelUploading() {
      this.$store.dispatch("uploader/cancelUploading");
    },
    clickDrop() {
      this.$store.commit("uploader/setFileErrors", []);
    },
  },
};
</script>

<style scoped>
.no-title .title-page {
  display: none;
}
</style>
