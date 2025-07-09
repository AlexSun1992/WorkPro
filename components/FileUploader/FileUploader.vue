<template>
  <div class="text-right">
    <button
      v-if="!percentsVisible"
      @click="$refs.file.click()"
      class="btn btn-doc-add"
    >
      Загрузить файл
    </button>
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
  props: {
    id: Number,
    rel: String,
    product: {
      type: String,
      default: "osago",
    },
  },
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
      const fileName = `${this.id}.${this.file.name?.split(".")[1]}`;
      this.$axios
        .$post(`/am/main/v2/file/${this.id}?rel=${this.rel}&product=${this.product}`, this.file, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${fileName}`,
          },
          onUploadProgress: (progressEvent) => {
            this.percentsVisible = true;
            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
          },
        })
        .then((result) => {
          this.$emit("uploaded", result);
        })
        .catch((e) => {
          if (!e.response) {
            this.$modal.alert({
              title: "Извините, произошла ошибка",
              msg: "Не удалось загрузить файл",
              icon: "error",
              btnOk: false,
            });
          }
        })
        .finally(() => {
          this.$refs.file.value = "";
          this.hidePercents();
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
