<template>
  <div class="files">
    <div>
      <div v-for="(file, i) in files" :key="i" class="file">
        <a
          href=""
          v-text="file.SFILENAME"
          @click.prevent="downloadItem(file)"
        />
        | <span class="size">{{ fileSize(file) }}</span>
      </div>
    </div>
    <div>
      <b-progress
        v-if="percentsVisible"
        class="mb-2"
        variant="success"
        :value="uploadPercentage"
        :max="100"
        show-progress
        animated
      ></b-progress>

      <button v-else @click="$refs.file.click()">Добавить файл</button>
      <input
        ref="file"
        type="file"
        style="display: none"
        v-on:change="handleFileUpload()"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "FileLoader",
  props: ["item", "tableId"],
  data() {
    return {
      file: null,
      files: null,
      uploadPercentage: 0,
      percentsVisible: false,
    };
  },
  head: {
    link: [
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css",
      },
    ],
  },
  async fetch() {
    await this.getList();
  },
  methods: {
    async downloadItem(item) {
      this.$axios({
        url: `/am/main/v2/file/${item.ID}?rel=${item.REL}`,
        method: "GET",
        responseType: "blob",
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", item.SFILENAME);
        document.body.appendChild(link);
        link.click();
      });
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
      this.submitFile();
    },
    submitFile() {
      let formData = new FormData();
      formData.append("file", this.file, this.file.name);
      this.$axios
        .$post(
          `/am/main/v2/file/${this.item.ID}
?rel=${this.item.REL}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Content-Disposition": `attachment; filename=${this.file.name}`,
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
        .then(async (result) => {
          this.hidePercents();
          this.getList();
        })
        .catch(function (e) {
          console.log(e);
        });
    },
    async getList() {
      let data = await this.$axios.$get(
        `/am/main/v2/one2manydata/${this.item.ID}/${this.tableId}?rel=${this.item.REL}`
      );
      this.files = data[0]._data;
    },
    hidePercents() {
      setTimeout(() => {
        this.percentsVisible = false;
      }, 1000);
    },
    fileSize(file) {
      return (file.NSIZE / 1024000).toFixed(1) + "мб";
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
