<template>
  <div class="nb-block mb-4">
    <div>
      <div class="row">
        <div
          v-for="file in data"
          :key="file.FILENAME"
          class="col-12 col-lg-4 mb-3"
        >
          <div class="preview-card">
            <div>
              <p :title="file.FILENAME">
                {{ file.FILENAME }}
              </p>
            </div>
            <div>{{ formatBytes(file.SIZE) }}</div>
            <div class="row">
              <b-button
                @click="downloadFile(file.FILENAME)"
                title="Скачать файл"
                >Скачать</b-button
              >
              <b-button
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
          v-if="isErrorSize"
          class="col-12 mb-3"
          v-bind:class="{ 'col-lg-4': data.length }"
        >
          <div class="error-container">
            <div>Превышен суммарный объем файлов.</div>
            <div>Вес файлов: {{ formatBytes(size) }}</div>
          </div>
        </div>
        <div class="col-12 mb-3" v-bind:class="{ 'col-lg-4': data.length }">
          <div
            @dragover="dragover"
            @drop="drop"
            class="dropzone-container"
            v-bind:class="{ 'error-size': isErrorSize }"
          >
            <input
              :disabled="isErrorSize"
              type="file"
              multiple
              style="height: 100%"
              class="hidden-input"
              @change="onChange"
              ref="file"
              accept=".pdf,.jpg,.jpeg,.png,.bmp,.tif,.gif"
            />
            <label v-if="isError === false" class="file-label">
              <div><b>Загрузите файл</b></div>
              <div>Перетащите или загрузите файл</div>
            </label>
            <label v-if="isError === true" class="file-label">
              <div><b>Максимум загружен</b></div>
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
  },
  methods: {
    onChange() {
      if (this.isErrorSize === false) {
        this.$emit("update", [...this.$refs.file.files]);
      }
    },
    downloadFile(name) {
      const file = this.fileObjects.find((item) => item.name === name);
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
    isError() {
      return this.isErrorSize;
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
</style>
