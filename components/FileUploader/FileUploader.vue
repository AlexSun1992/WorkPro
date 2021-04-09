<template>
  <div>
    <button @click="$refs.file.click()">Добавить файл</button>
    <input
      ref="file"
      type="file"
      style="display: none"
      v-on:change="handleFileUpload()"
    />
  </div>
</template>

<script>
export default {
  name: "FileUploader",
  props: ["id", "rel"],
  data() {
    return {};
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
      this.submitFile();
    },
    submitFile() {
      let formData = new FormData();
      formData.append("file", this.file, this.file.name);
      this.$axios
        .$post(
          `/am/main/v2/file/${this.id}?rel=${this.rel}`,
          formData
          // {
          //   headers: {
          //     "Content-Type": "multipart/form-data",
          //     "Content-Disposition": `attachment; filename=${this.file.name}`,
          //   },
          // }
        )
        .then(async (result) => {
          this.$refs.file.value = "";
          this.$emit("uploaded", result);
        })
        .catch(function (e) {
          console.log(e);
        });
    },
  },
};
</script>

<style lang="scss">
.files {
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > div {
    min-width: 135px;
  }
}
.button {
  height: fit-content;
}
.file {
  max-width: 500px;
}
.size {
  font-style: italic;
  font-weight: 300;
  font-size: 15px;
}
</style>
