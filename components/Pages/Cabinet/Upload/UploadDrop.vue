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
              'error-card': file.SIZE > maxFileSize,
            }"
          >
            <div class="namefile" :title="file.FILENAME">
              {{ file.FILENAME.split(".").slice(0, -1).join(".") }}<b>.{{
                file.FILENAME.split(".").pop()
              }}</b>
            </div>
            <div class="sizefile">{{ formatBytes(file.SIZE) }}</div>
            <div v-if="file.SIZE > maxFileSize">
              Превышен допустимый размер файла -
              {{ formatBytes(maxFileSize) }}
            </div>
              <button class="btn-download-file"
                @click="downloadFile(file.FILENAME)"
                title="Скачать файл" type="button"
                ></button
              >
              <button type="button"
                class="btn-delite-file"
                :disabled="isLoading"
                @click="remove(file)"
                title="Удалить файл"
              ></button>
            </div>
          </div>
        </div>
        <div
          v-if="isError"
          class="col-12 mb-3"
          v-bind:class="{ 'col-lg-4': data.length }"
        >
          <div class="error-container">
            <div>
              Превышен суммарный вес файлов - {{ formatBytes(totalLimit) }}
            </div>
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
            v-bind:class="{ 'error-size': isError }"
            class="dropzone-container file-label"
            :class="{'disabled-upload' : isErrorMaxFileCount === true}"
          >
            <input
              :disabled="isError || isLoading || isErrorMaxFileCount"
              type="file"
              multiple
              class="hidden-input"
              @change="onChange"
              ref="file"
              :accept="stringExtensions"
            />
            <span v-if="isErrorMaxFileCount === false"
              >Загрузите файл<span
                >Перетащите<br />или загрузите файл</span
              ></span
            >

            <span v-if="isErrorMaxFileCount === true">
              Максимум загружен<span>
                Количество файлов для этой группы не должно быть больше
                {{ maxFileCount }}</span
              >
              <span>Удалите загруженный файл если хотите загрузить другой</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatBytes, filterDropFilesByExtensions } from "./helpers";

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
    totalLimit: {
      type: Number,
      required: false,
    },
    fileExtensions: {
      type: Array,
      required: true,
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
      const dropFiles = event.dataTransfer.files;
      this.$refs.file.files = filterDropFilesByExtensions(
        dropFiles,
        this.fileExtensions
      );
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
    isErrorMaxFileCount() {
      return this.data.length > this.maxFileCount;
    },
    stringExtensions() {
      return this.fileExtensions.reduce((acc, curr) => `${acc}.${curr},`, "");
    },
  },
};
</script>

<style>
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
.dropzone-container,
.preview-card {
  overflow: hidden;
  height: 81px;
  position: relative;
  text-align: center;
  border: 2px solid #43b02a;
  border-radius: 30px;
  width: 251px;
  padding: 11px 15px 15px 65px;
}
.preview-card {padding: 15px 15px 15px 120px;}
.preview-card .namefile {
width:100%; overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
  font-size: 0.875rem;
  text-align: right;
  padding-right:26px;
  position: relative;
  line-height: 23px;
}
.preview-card .namefile b{
position: absolute;
    right: 0;}

.preview-card .sizefile {
  font-size: 0.875rem;
  line-height: 23px;
  margin-top:5px;
  text-align: right;
color: #868686;}
.dropzone-container {
  background: url(/img/icon-border-file.svg) 0 0 no-repeat;
  border: 0;
  background-size: contain;
  cursor: pointer;
  margin-bottom: 0;
}
.dropzone-container:after {
  content: "";
  width: 40px;
  height: 40px;
  position: absolute;
  top: 20px;
  left: 15px;
  background: url(/img/icon-add-file.svg) 0 0 no-repeat;
}
.dropzone-container span {
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 23px;
  color: #292929;
  display: block;
  cursor: pointer;
}
.dropzone-container span span {
  display: block;
  font-weight: 400;
  line-height: 16px;
  color: #868686;
}
.dropzone-container input {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  left: 0;
  cursor: pointer;
  z-index: 1;
}
.error-card {
  border: 2px solid #ed969e;
  background-color: #f5c6cb;
}
.btn-delite-file,
.btn-download-file {
  width:40px;
  height:40px;
  border:0;
  background: url(/img/icon-delite-file.svg) 0 0 no-repeat;
  border-radius: 20px;
  position: absolute;
  top:20px;
  left:65px;
}
.btn-download-file {
background: url(/img/icon-download-file.svg) 0 0 no-repeat;
left:15px;
}
</style>

