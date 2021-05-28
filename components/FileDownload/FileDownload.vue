<template>
  <a href="" @click.prevent="downloadItem(id, rel, fileName)">
    {{ fileName }} (<span class="size">{{ fileSizeMb(fileSize) }}</span
    >)
  </a>
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
      debugger;
      this.$axios({
        url: `/am/main/v2/file/${id}?rel=${rel}`,
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          debugger;
          console.log(response.data);
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
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
    fileSizeMb(size) {
      return (size / 1024000).toFixed(1) + "мб";
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
