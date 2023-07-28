<template>
  <div id="fileList">
    <a href="" @click.prevent="downloadItem(id, rel, fileName)">
      {{ fileName }} (<span class="size">{{ conv_size(fileSize) }}</span
      >)
    </a>
  </div>
</template>

<script>
export default {
  name: "FileDownload",
  props: ["id", "rel", "fileName", "fileSize"],
  data() {
    return {};
  },
  methods: {
    async downloadItem(id, rel, fileName) {
      this.$axios({
        url: `/am/main/v2/file/${id}?rel=${rel}`,
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          const getFileList = document.getElementById("fileList");
          link.href = url;
          link.setAttribute("download", fileName);
          getFileList.insertAdjacentHTML("beforeend", link);
          link.click();
        })
        .catch((e) => {
          this.$bvToast.toast("Не удалось скачать файл", {
            title: "Ошибка",
            variant: "danger",
            noAutoHide: true,
            solid: true,
          });
        });
    },
    conv_size(b) {
      let fsize;
      let fsizekb = b / 1024;
      let fsizemb = fsizekb / 1024;
      if (fsizekb <= 1024) {
        fsize = fsizekb.toFixed(1) + " кб";
      } else if (fsizekb >= 1024 && fsizemb <= 1024) {
        fsize = fsizemb.toFixed(1) + " мб";
      }
      return fsize;
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
