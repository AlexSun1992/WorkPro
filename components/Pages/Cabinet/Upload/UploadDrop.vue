<template>
  <div class="nb-block mb-4">
    <div>
      <div class="row">
        <div
          v-for="file in files"
          :key="file.name"
          class="col-12 col-lg-4 mb-3"
        >
          <div class="preview-card">
            <div>
              <p :title="file.name">
                {{ file.name }}
              </p>
            </div>
            <div>
              <button
                class="ml-2"
                type="button"
                @click="remove(files.indexOf(file))"
                title="Remove file"
              >
                <b>&times;</b>
              </button>
            </div>
          </div>
        </div>
        <div class="col-12 mb-3" v-bind:class="{ 'col-lg-4': files.length }">
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
              <div>Загрузите файл</div>
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
  data() {
    return {
      files: [],
    };
  },
  methods: {
    onChange() {
      this.files = [...this.files, ...this.$refs.file.files];
      this.$emit("update", {
        files: [...this.$refs.file.files],
      });
    },
    remove(i) {
      this.files.splice(i, 1);
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
