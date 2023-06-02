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
            <div class="row">
              <b-button @click="downloadFile(file)" title="Скачать файл"
                >Скачать</b-button
              >
              <b-button
                class="ml-2 mt-2"
                type="button"
                @click="remove(data.indexOf(file))"
                title="Удалить файл"
              >
                Удалить
              </b-button>
            </div>
          </div>
        </div>
        <div class="col-12 mb-3" v-bind:class="{ 'col-lg-4': data.length }">
          <div @dragover="dragover" @drop="drop" class="dropzone-container">
            <input
              type="file"
              multiple
              style="height: 100%"
              class="hidden-input"
              @change="onChange"
              ref="file"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label class="file-label">
              <div>Перетащите или загрузите файл</div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UploadFile",
  props: {
    data: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  methods: {
    onChange() {
      this.$emit("update", [...this.$refs.file.files]);
    },
    downloadFile(file) {
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
    remove(index) {
      this.$emit("remove", index);
    },
    dragover(event) {
      event.preventDefault();
    },
    drop(event) {
      event.preventDefault();
      this.$refs.file.files = event.dataTransfer.files;
      this.onChange();
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
  border: 1px solid #eff1f3;
  border-radius: 24px;
  overflow: hidden;
  height: 100%;
  position: relative;
  padding: 40px;
  text-align: center;
}
</style>
