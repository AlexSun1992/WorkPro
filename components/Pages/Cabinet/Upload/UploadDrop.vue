<template>
  <div class="nb-block mb-4">
    <div>
      <div class="row">
        <div
          v-for="file in data"
          :key="file.FILENAME"
          class="col-12 col-lg-4 mb-3"
        >
          <div
            class="preview-card"
            v-bind:class="{
              'error-card':
                file.SIZE === currentMaxFileSize && isErrorMaxFileSize,
            }"
          >
            <div>
              {{ file.FILENAME.split(".").slice(0, -1).join(".") }}.<b>{{
                file.FILENAME.split(".").pop()
              }}</b>
            </div>
            <div>{{ formatBytes(file.SIZE) }}</div>
            <div v-if="file.SIZE === currentMaxFileSize && isErrorMaxFileSize">
              Размер файла не должен превышать
              {{ formatBytes(maxFileSize) }}
            </div>
            <div class="row">
              <b-button
                @click="downloadFile(file.FILENAME)"
                title="Скачать файл"
                >Скачать</b-button
              >
              <b-button
                :disabled="isLoading"
                class="ml-2 mt-2"
                type="button"
                @click="remove(file)"
                title="Удалить файл"
              >
                Удалить
              </b-button>
            </div>
          </div>
        </div>
        <div
          v-if="isError"
          class="col-12 mb-3"
          v-bind:class="{ 'col-lg-4': data.length }"
        >
          <div class="error-container">
            <div>Превышен суммарный объем файлов.</div>
            <div>Вес файлов: {{ formatBytes(size) }}</div>
          </div>
        </div>
        <div
          v-if="isError === false"
          class="col-12 mb-3"
          v-bind:class="{ 'col-lg-4': data.length }"
        >
          <div
            @dragover="dragover"
            @drop="drop"
            class="dropzone-container"
            v-bind:class="{ 'error-size': isError }"
          >
            <input
              :disabled="isError || isLoading || isErrorMaxFileCount"
              type="file"
              multiple
              style="height: 100%"
              class="hidden-input"
              @change="onChange"
              ref="file"
              accept=".pdf,.jpg,.jpeg,.png,.bmp,.tif,.gif"
            />
            <label v-if="isErrorMaxFileCount === false" class="file-label">
              <div><b>Загрузите файл</b></div>
              <div>Перетащите или загрузите файл</div>
            </label>
            <label v-if="isErrorMaxFileCount === true" class="file-label">
              <div><b>Максимум загружен</b></div>
              <div>
                Количество файлов для этой группы не должно быть больше
                {{ maxFileCount }}
              </div>
              <div>Удалите загруженный файл если хотите загрузить другой</div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatBytes } from "./helpers";

export default {
  name: "UploadFile",
  props: {
    data: {
      type: Array,
      required: false,
      default: () => [],
    },
    fileObjects: {
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
  },
  methods: {
    onChange() {
      if (this.isErrorSize === false && this.isLoading === false) {
        this.$emit("update", [...this.$refs.file.files]);
        this.$refs.file.value = null;
      }
    },
    downloadFile(name) {
      const file = this.fileObjects.find((item) => item.name === name);
      if (!file) {
        return;
      }
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
    remove(file) {
      this.$emit("remove", file);
    },
    dragover(event) {
      event.preventDefault();
    },
    drop(event) {
      event.preventDefault();
      this.$refs.file.files = event.dataTransfer.files;
      this.onChange();
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
      return this.data.reduce((acc, curr) => acc + curr.SIZE, 0);
    },
    currentMaxFileSize() {
      return Math.max(...this.data.map((item) => item.SIZE));
    },
    isError() {
      return this.isErrorSize;
    },
    isErrorMaxFileSize() {
      return this.currentMaxFileSize > this.maxFileSize;
    },
    isErrorMaxFileCount() {
      return this.data.length > this.maxFileCount;
    },
  },
};
</script>

<style>
.dropzone-container {
  border: 2px dashed #009639;
  border-radius: 24px;
  overflow: hidden;
  height: 100%;
  position: relative;
  padding: 40px;
  text-align: center;
}
.error-size {
  border: 2px dashed #dee2e6;
}
.error-container {
  border: 2px solid #ed969e;
  background-color: #f5c6cb;
  border-radius: 24px;
  overflow: hidden;
  height: 100%;
  position: relative;
  padding: 40px;
  text-align: center;
}
.hidden-input {
  opacity: 0;
  overflow: hidden;
  position: absolute;
  left: 0px;
  top: 0px;
}
.file-label {
  font-size: 20px;
  display: block;
  cursor: pointer;
}
.preview-card {
  border: 2px solid #009639;
  border-radius: 24px;
  overflow: hidden;
  height: 100%;
  position: relative;
  padding: 40px;
  text-align: center;
}
.error-card {
  border: 2px solid #ed969e;
}
</style>
