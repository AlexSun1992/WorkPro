<template>
  <div class="nb-block row">
    <div
      v-if="isError === false"
      class="col-9 col-lg-4"
    >
      <div
        class="dropzone-container file-label"
        :class="{
          'disabled-upload': isMaxFileCount === true,
          'error-size': isError,
        }"
        @dragover="dragover"
        @drop="drop"
        @click="onClick"
      >
        <input
          ref="file"
          :disabled="isError || isLoading || isMaxFileCount"
          type="file"
          multiple
          class="hidden-input"
          :accept="stringExtensions"
          @change="handleAddFile"
        />
        <span v-if="isMaxFileCount === false"
          >Загрузите файл<span>Перетащите<br />или загрузите файл</span></span
        >
        <span v-if="isMaxFileCount === true">
          Максимум загружен<span> Удалите загруженный файл если хотите загрузить<br />другой </span>
        </span>
      </div>
    </div>
    <div
      v-for="(error, i) in errors"
      :key="i"
      class="col-9 col-lg-4"
    >
      <div
        v-if="error.type === 'MAX_FILE_COUNT'"
        class="error-blk"
      >
        Не более {{ maxFileCount }} файлов
      </div>
      <div
        v-if="error.type === 'TOTAL_LIMIT'"
        class="error-blk"
      >
        Превышен <b>суммарный</b><br />вес файлов -
        {{ formatBytes(totalLimit) }}
      </div>
      <div
        v-if="error.type === 'MAX_FILE_SIZE'"
        class="error-blk"
      >
        Превышен <b>максимальный</b><br />вес файла -
        {{ formatBytes(maxFileSize) }}
      </div>
      <div
        v-if="error.type === 'SAME_FILE'"
        class="error-blk"
      >
        Файл <b>уже есть</b> на странице. <br />
      </div>
    </div>
    <div
      v-for="file in files"
      :key="file.FILENAME + file.SIZE"
      class="col-9 col-lg-4"
      :class="{ 'col-lg-8': file.ERROR }"
    >
      <div
        v-if="file.ERROR"
        class="row"
      >
        <div class="col-12 col-lg-6">
          <div :class="{ 'preview-card': true, 'single-button': !canBeDownload }">
            <div class="file-description">
              <div
                class="namefile"
                :title="file.FILENAME"
              >
                <span>{{ getFileName(file.FILENAME) }}</span
                ><b>.{{ getFileType(file.FILENAME) }}</b>
              </div>
              <div class="sizefile">{{ formatBytes(file.SIZE) }}</div>

              <div v-if="file.SIZE > maxFileSize">
                Превышен <b>допустимый</b><br />размер файла -
                {{ formatBytes(maxFileSize) }}
              </div>
            </div>
            <button
              v-if="canBeDownload"
              class="btn-download-file"
              title="Скачать файл"
              type="button"
              @click="downloadFile(file)"
            ></button>
            <button
              type="button"
              class="btn-delite-file"
              :disabled="isLoading"
              title="Удалить файл"
              @click="remove(file)"
            ></button>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div
            v-if="file.ERROR"
            class="error-blk error-blk_h_t"
          >
            <div
              v-if="file.ERROR.title"
              class="error-blk-title"
            >
              {{ file.ERROR.title }}
            </div>
            <div class="error-blk-dec">{{ file.ERROR.text }}</div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="preview-card"
        :class="{
          'error-card': file.SIZE > maxFileSize,
          'single-button': !getIsShowDownload(file) || !canBeDownload,
        }"
      >
        <div class="file-description">
          <div
            class="namefile"
            :title="file.FILENAME"
          >
            <span>{{ getFileName(file.FILENAME) }}</span
            ><b>.{{ getFileType(file.FILENAME) }}</b>
          </div>

          <div class="sizefile">{{ formatBytes(file.SIZE) }}</div>

          <div v-if="file.SIZE > maxFileSize">
            Превышен <b>допустимый</b><br />размер файла -
            {{ formatBytes(maxFileSize) }}
          </div>
        </div>
        <button
          v-if="canBeDownload && getIsShowDownload(file)"
          class="btn-download-file"
          title="Скачать файл"
          type="button"
          @click="downloadFile(file)"
        ></button>
        <button
          type="button"
          class="btn-delite-file"
          :disabled="isLoading"
          title="Удалить файл"
          @click="remove(file)"
        ></button>
      </div>

      <div
        v-if="file.SIZE > maxFileSize"
        class="error-blk"
      >
        Превышен <b>допустимый</b><br />размер файла -
        {{ formatBytes(maxFileSize) }}
      </div>
    </div>
  </div>
</template>

<script>
import { formatBytes, filterDropFilesByExtensions } from "./helpers";

export default {
  name: "UploadDrop",
  props: {
    files: {
      type: Array,
      default: () => [],
    },
    fileObjects: {
      type: Array,
      default: () => [],
    },
    fileErrors: {
      type: Array,
      default: () => [],
    },
    allSize: {
      type: Number,
      default: () => null,
    },
    isErrorSize: {
      type: Boolean,
      default: () => false,
    },
    isLoading: {
      type: Boolean,
      default: () => false,
    },
    maxFileSize: {
      type: Number,
      required: true,
    },
    maxFileCount: {
      type: Number,
      required: true,
    },
    totalLimit: {
      type: Number,
      required: true,
    },
    fileExtensions: {
      type: Array,
      required: true,
    },
    fileTypes: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      required: true,
    },
    canDownload: {
      type: Boolean,
      default: null,
    },
  },
  computed: {
    size() {
      return this.allSize;
    },
    sizeGroup() {
      return this.files.reduce((acc, curr) => acc + curr.SIZE, 0);
    },
    currentMaxFileSize() {
      return Math.max(...this.files.map((item) => item.SIZE));
    },
    isError() {
      return this.isErrorSize;
    },
    isMaxFileCount() {
      return this.files.length >= this.maxFileCount;
    },
    stringExtensions() {
      if (Array.isArray(this.fileTypes) === true && this.fileTypes.length > 0) {
        return this.fileTypes.reduce((acc, curr) => `${acc}.${curr},`, "");
      }
      return this.fileExtensions.reduce((acc, curr) => `${acc}.${curr},`, "");
    },
    canBeDownload() {
      return this.canDownload !== false;
    },
    errors() {
      return this.fileErrors.filter((error) => error.name === this.name);
    },
  },
  methods: {
    getFileName(value) {
      if (typeof value === "string") {
        const dotPosition = value.lastIndexOf(".");
        return dotPosition !== -1 ? value.substring(0, dotPosition) : value;
      }
      throw new Error(`Значение не является строкой - ${value}`);
    },
    getFileType(value) {
      if (typeof value === "string" && value.includes(".")) {
        return value.split(".").pop();
      }
      throw new Error(`Некорректное значение - ${value}`);
    },
    handleAddFile() {
      if (this.isErrorSize === false && this.isLoading === false && this.isMaxFileCount === false) {
        let file = this.fileExtensions;
        if (Array.isArray(this.fileTypes) === true && this.fileTypes.length > 0) {
          file = this.fileTypes;
        }
        const filteredFiles = filterDropFilesByExtensions(this.$refs.file.files, file);
        this.$emit("update", filteredFiles);
        this.$refs.file.value = null;
      }
    },
    onClick() {
      this.$emit("click");
    },
    getIsShowDownload(file) {
      return !(file.DOWNLOAD === false);
    },
    async downloadFile(file) {
      try {
        let fileObject;

        if (file.IDDOCPHOTO && file.REL) {
          fileObject = await this.$axios({
            url: `/lk/main/v2/file/${file.IDDOCPHOTO}?rel=${file.REL}`,
            method: "GET",
            responseType: "blob",
          }).then((resp) => new Blob([resp.data]));
        } else {
          fileObject = this.fileObjects.find((item) => item.name === file.FILENAME);
        }

        const a = document.createElement("a");
        a.style.display = "none";
        const url = window.URL.createObjectURL(fileObject);
        a.href = url;
        a.setAttribute("download", file.FILENAME);
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        this.$modal.alert({
          title: "Извините, произошла ошибка",
          msg: "Не удалось скачать файл",
          icon: "error",
          btnOk: false,
        });
      }
    },
    remove(file) {
      this.$emit("remove", file);
    },
    dragover(event) {
      event.preventDefault();
      this.$emit("click");
    },
    drop(event) {
      event.preventDefault();
      this.$refs.file.files = event.dataTransfer.files;
      this.handleAddFile();
    },
    formatBytes(size) {
      return formatBytes(size);
    },
  },
};
</script>

<style scoped>
.error-blk {
  border: 2px solid #eb5757;
  background: var(--red_10) url(/img/icon-warning-file.svg) 15px center no-repeat;
  text-align: right;
  color: #eb5757;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 18px 15px 15px 65px;
}
.error-blk.error-blk_h_t {
  padding: 5px 15px 5px 65px;
  display: grid;
  flex-wrap: wrap;
  text-align: right;
  align-items: center;
}
.error-blk-title {
  font-weight: 600;
  font-size: 0.875rem;
  width: 100%;
}

.error-blk-dec {
  color: #686868;
  line-height: 16px;
  font-weight: 400;
  text-overflow: ellipsis;
  width: 100%;
  text-align: right;
}

@media (max-width: 992px) {
  .error-blk,
  .error-blk.error-blk_h_t {
    background: var(--red_10) url(/img/icon-warning-file.svg) 10px center no-repeat;
    padding: 10px 15px 10px 40px;
    height: auto;
    min-height: 40px;
    background-size: 20px;
    font-size: 0.75rem;
    text-align: left;
  }
  .error-blk-dec,
  .error-blk-title {
    text-align: left;
  }
}
</style>
