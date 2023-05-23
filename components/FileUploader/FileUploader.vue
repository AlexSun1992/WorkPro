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
        .$post(
          `/am/main/v2/file/${this.id}?rel=${this.rel}&product=${this.product}`,
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
            },
          }
        )
        .then((result) => {
          this.$emit("uploaded", result);
        })
        .catch((e) => {
          if (!e.response) {
            this.$bvToast.toast("Не удалось загрузить файл", {
              title: "Ошибка",
              variant: "danger",
              noAutoHide: true,
              solid: true,
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
.btn-doc-add {
  text-align: center;
  padding: 17px 40px 17px 76px;
  border-radius: 15px;
  font-size: 1rem;
  line-height: 1rem;
  box-sizing: border-box;
  border: 2px solid #fe7333;
  font-weight: 700;
  white-space: nowrap;
  display: inline-block;
  position: relative;
  background: #fe7333 url(/img/icon-fileuploader.svg) 40px 50% no-repeat;
  color: #fff;
}
.btn-doc-add:hover {
  background-color: #fe8f5c;
  color: #fff;
  border: 2px solid #fe8f5c;
}
@media (max-width: 992px) {
  .btn-doc-add {
    padding: 15px 24px 15px 60px;
    background: #fe7333 url(/img/icon-fileuploader.svg) 24px 50% no-repeat;
  }
}
</style>
