<template>
  <div class="text-right">
    <b-button
      v-if="!percentsVisible"
      @click="$refs.file.click()"
      class="btn-doc-add"
    >
      Прикрепить файл
    </b-button>
    <input
      ref="file"
      type="file"
      style="display: none"
      v-on:change="handleFileUpload()"
    />
    <div class="progress">
      <b-progress
        v-if="percentsVisible"
        class="mb-2"
        variant="success"
        :value="uploadPercentage"
        show-progress
        animated
      ></b-progress>
    </div>
  </div>
</template>

<script>
export default {
  name: "FileUploader",
  props: ["id", "rel"],
  data() {
    return {
      uploadPercentage: 0,
      percentsVisible: false,
    };
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
      this.submitFile();
    },
    submitFile() {
      // Костыль
      let fileName = this.id + "." + this.file.name?.split(".")[1];
      this.$axios
        .$post(
          `/am/main/v2/file/${this.id}
?rel=${this.rel}`,
          this.file,
          {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename=${fileName}`,
            },
            onUploadProgress: (progressEvent) => {
              this.percentsVisible = true;
              this.uploadPercentage = parseInt(
                Math.round((progressEvent.loaded / progressEvent.total) * 100)
              );
              console.log(this.uploadPercentage);
            },
          }
        )
        .then((result) => {
          this.$refs.file.value = "";
          this.$emit("uploaded", result);
          this.hidePercents();
        })
        .catch(function (e) {
          console.log(e);
        });
    },
    hidePercents() {
      setTimeout(() => {
        this.percentsVisible = false;
      }, 1000);
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
