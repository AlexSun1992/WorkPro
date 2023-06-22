<template>
  <div class="nb-block mb-4 row">
    <div v-if="isError === false" class="col-9 col-lg-4">
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
          @change="onChange"
          ref="file"
          :accept="stringExtensions"
        />
        <span v-if="isMaxFileCount === false"
          >Загрузите файл<span>Перетащите<br />или загрузите файл</span></span
        >
        <span v-if="isMaxFileCount === true">
          Максимум загружен<span>
            Удалите загруженный файл если хотите загрузить<br />другой
          </span>
        </span>
      </div>
    </div>
    <div v-for="(error, i) in errors" :key="i" class="col-9 col-lg-4">
      <div v-if="error.type === 'MAX_FILE_COUNT'" class="error-blk">
        Не более {{ maxFileCount }} файлов
      </div>
      <div v-if="error.type === 'TOTAL_LIMIT'" class="error-blk">
        Превышен <b>суммарный</b><br />вес файлов -
        {{ formatBytes(totalLimit) }}
      </div>
      <div v-if="error.type === 'MAX_FILE_SIZE'" class="error-blk">
        Превышен <b>максимальный</b><br />вес файла -
        {{ formatBytes(maxFileSize) }}
      </div>
    </div>
    <div v-for="file in data" :key="file.FILENAME" class="col-9 col-lg-4">
      <div
        class="preview-card"
        v-bind:class="{
          'error-card': file.SIZE > maxFileSize,
        }"
      >
        <div class="file-description">
          <div class="namefile" :title="file.FILENAME">
            <span>{{ file.FILENAME.split(".").slice(0, -1).join(".") }}</span
            ><b>.{{ file.FILENAME.split(".").pop() }}</b>
          </div>
          <div class="sizefile">{{ formatBytes(file.SIZE) }}</div>

          <div v-if="file.SIZE > maxFileSize">
            Превышен <b>допустимый</b><br />размер файла -
            {{ formatBytes(maxFileSize) }}
          </div>
        </div>
        <button
          class="btn-download-file"
          @click="downloadFile(file.FILENAME)"
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
      <div class="error-blk" v-if="file.SIZE > maxFileSize">
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
    name: {
      type: String,
      required: true,
    },
  },
  methods: {
    onChange() {
      if (
        this.isErrorSize === false &&
        this.isLoading === false &&
        this.isMaxFileCount === false
      ) {
        this.$emit("update", [...this.$refs.file.files]);
        this.$refs.file.value = null;
      }
    },
    onClick() {
      this.$emit("click");
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
      this.$emit("click");
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
    isMaxFileCount() {
      return this.data.length === this.maxFileCount;
    },
    stringExtensions() {
      return this.fileExtensions.reduce((acc, curr) => `${acc}.${curr},`, "");
    },
    errors() {
      return this.fileErrors.filter((error) => error.name === this.name);
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
.error-blk,
.dropzone-container,
.preview-card {
  overflow: hidden;
  height: 81px;
  position: relative;
  text-align: center;
  border-radius: 30px;
  padding: 11px 15px 15px 65px;
  margin-bottom: 20px;
}
.preview-card {
  padding: 15px 15px 15px 120px;
  border: 2px solid #43b02a;
}
.preview-card .namefile {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 0.875rem;
  text-align: right;
  position: relative;
  line-height: 23px;
}

.preview-card .sizefile {
  font-size: 0.875rem;
  line-height: 23px;
  margin-top: 5px;
  text-align: right;
  color: #868686;
}
.dropzone-container {
  /*background: url(/img/icon-border-file.svg) 0 0 no-repeat;
  border: 0;
  background-size: contain;*/
  cursor: pointer;
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
  padding: 15px 15px 15px 65px;
}
.btn-delite-file,
.btn-delite-file:disabled,
.btn-download-file {
  width: 40px;
  height: 40px;
  border: 0;
  background: url(/img/icon-delite-file.svg) 0 0 no-repeat;
  border-radius: 20px;
  position: absolute;
  top: 20px;
  left: 65px;
}

.btn-download-file {
  background: url(/img/icon-download-file.svg) 0 0 no-repeat;
  left: 15px;
}
.disabled-upload {
  padding: 5px 15px 15px 65px;
  pointer-events: none;
}
.disabled-upload:after {
  content: "";
  width: 40px;
  height: 40px;
  position: absolute;
  top: 20px;
  left: 15px;
  background: url(/img/icon-border_gray--file.svg) 0 0 no-repeat;
}

.error-card .btn-download-file {
  display: none;
}
.error-card .btn-delite-file {
  background: url(/img/icon-delite-file-error.svg) 0 0 no-repeat;
  left: 15px;
}
.error-blk {
  border: 2px solid #eb5757;
  background: #ffebeb url(/img/icon-warning-file.svg) 15px center no-repeat;
  text-align: right;
  color: #eb5757;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 18px 15px 15px 65px;
}
.file-description {
  display: grid;
  grid-template-rows: auto auto;
}
.namefile {
  display: grid;
  grid-template-columns: auto minmax(20px, max-content);
}
.namefile span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropzone-container::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 2px;
  background: repeating-conic-gradient(transparent 0 25%, #69c055 0 50%) 0 0 /
    18% 29% round;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  border-radius: 30px;
}
.dropzone-container.disabled-upload::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 2px;
  background: repeating-conic-gradient(transparent 0 25%, #a4a4a4 0 50%) 0 0 /
    18% 29% round;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  border-radius: 30px;
}
.dropzone-container.disabled-upload span span {
  margin-top: -2px;
}

@media (max-width: 992px) {
  .dropzone-container.disabled-upload::before {
    padding: 1px;
    background: repeating-conic-gradient(transparent 0 25%, #a4a4a4 0 50%) 0 0 /
      5% 39% round;
    border-radius: 15px;
  }
  .dropzone-container::before {
    padding: 1px;
    background: repeating-conic-gradient(transparent 0 25%, #69c055 0 50%) 0 0 /
      5% 39% round;
    border-radius: 15px;
  }
  .file-description {
    display: grid;
    grid-template-columns: auto minmax(20px, max-content);
    grid-gap: 5px;
  }
  .error-blk,
  .dropzone-container,
  .preview-card {
    height: 40px;
    padding: 10px 10px 10px 62px;
    border-radius: 15px;
  }
  .dropzone-container {
    padding: 9px 10px 10px 40px;
  }
  .preview-card {
    border: 1px solid #43b02a;
  }
  .dropzone-container:after,
  .btn-delite-file,
  .btn-download-file {
    width: 20px;
    height: 20px;
    border: 0;
    top: 10px;
    left: 10px;
    background-size: cover;
  }
  .btn-delite-file {
    left: 35px;
  }
  .dropzone-container span span {
    display: none;
  }
  .preview-card .sizefile,
  .preview-card .namefile {
    font-size: 0.75rem;
    line-height: 19px;
    margin-top: 0;
  }
  .error-blk {
    border: 1px solid #eb5757;
    background: #ffebeb url(/img/icon-warning-file.svg) 10px center no-repeat;
    background-size: 20px;
    font-size: 0.625rem;
    padding: 5px 10px 10px 82px;
    text-align: left;
  }
  .error-card .btn-delite-file {
    background-size: 20px;
    left: 10px;
  }
  .preview-card .error-card {
    border: 1px solid #eb5757;
  }
}
</style>
