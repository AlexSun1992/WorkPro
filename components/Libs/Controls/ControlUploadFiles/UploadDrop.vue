<template>
  <div class="nb-block row">
    <div
      v-if="isError === false"
      class="col-9 col-lg-4"
    >
      <div
        @dragover="dragover"
        @drop="drop"
        @click="onClick"
        class="dropzone-container file-label"
        :class="{
          'disabled-upload': isMaxFileCount === true,
          'error-size': isError,
        }"
      >
        <input
          :disabled="isError || isLoading || isMaxFileCount"
          type="file"
          multiple
          class="hidden-input"
          @change="handleAddFile"
          ref="file"
          :accept="stringExtensions"
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
          <div class="preview-card">
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
              class="btn-download-file"
              @click="downloadFile(file)"
              title="Скачать файл"
              type="button"
            ></button>
            <button
              type="button"
              class="btn-delite-file"
              :disabled="isLoading"
              @click="remove(file)"
              title="Удалить файл"
            ></button>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div
            class="error-blk error-blk_h_t"
            v-if="file.ERROR"
          >
            <div class="error-blk-title">{{ file.ERROR.title }}</div>
            <div class="error-blk-dec">{{ file.ERROR.text }}</div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="preview-card"
        v-bind:class="{
          'error-card': file.SIZE > maxFileSize,
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
          class="btn-download-file"
          @click="downloadFile(file)"
          title="Скачать файл"
          type="button"
        ></button>
        <button
          type="button"
          class="btn-delite-file"
          :disabled="isLoading"
          @click="remove(file)"
          title="Удалить файл"
        ></button>
      </div>

      <div
        class="error-blk"
        v-if="file.SIZE > maxFileSize"
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
  name: "UploadFile",
  props: {
    files: {
      type: Array,
      required: false,
      default: () => [],
    },
    fileObjects: {
      type: Array,
      required: false,
      default: () => [],
    },
    fileErrors: {
      type: Array,
      required: false,
      default: () => [],
    },
    allSize: {
      type: Number,
      required: false,
      default: () => null,
    },
    isErrorSize: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    maxFileSize: {
      type: Number,
      required: false,
    },
    maxFileCount: {
      type: Number,
      required: false,
    },
    totalLimit: {
      type: Number,
      required: false,
    },
    fileExtensions: {
      type: Array,
      required: true,
    },
    fileTypes: {
      type: Array,
      required: true,
      default: () => [],
    },
    name: {
      type: String,
      required: true,
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
    async downloadFile(file) {
      try {
        let fileObject;

        if (file.IDDOCPHOTO && file.REL) {
          fileObject = await this.$axios({
            url: `/am/main/v2/file/${file.IDDOCPHOTO}?rel=${file.REL}`,
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
    errors() {
      return this.fileErrors.filter((error) => error.name === this.name);
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
