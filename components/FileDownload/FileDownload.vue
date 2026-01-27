<template>
  <a
    href=""
    @click.prevent="downloadItem(id, rel, fileName)"
  >
    <div
      v-if="btnLabel"
      class="d-inline"
    >
      {{ btnLabel }}
    </div>
    <div
      v-if="!btnLabel"
      class="d-inline"
    >
      {{ fileName }}
    </div>
    <div
      class="d-inline"
      v-if="fileSize && fileSize !== 0"
    >
      (<span class="size">{{ conv_size(fileSize) }}</span
      >)
    </div>
  </a>
</template>

<script>
export default {
  name: "FileDownload",
  props: {
    id: {
      type: [String, Number],
      default: "",
    },
    rel: {
      type: String,
      default: "",
    },
    fileName: {
      type: String,
      default: "",
    },
    fileSize: {
      type: String,
      default: "",
    },
    btnLabel: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {
    async downloadItem(id, rel, fileName) {
      try {
        const response = await this.$axios({
          url: `/am/main/v2/file/${id}?rel=${rel}`,
          method: "GET",
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
      } catch (err) {
        this.$modal.alert({
          title: "Извините, произошла ошибка",
          msg: "Не удалось скачать файл",
          icon: "error",
          btnOk: false,
        });
      }
    },
    conv_size(b) {
      let fsize;
      const fsizekb = b / 1024;
      const fsizemb = fsizekb / 1024;

      if (fsizekb <= 1024) {
        fsize = `${fsizekb.toFixed(1)} кб`;
      } else if (fsizekb >= 1024 && fsizemb <= 1024) {
        fsize = `${fsizemb.toFixed(1)} мб`;
      }
      return fsize;
    },
  },
};
</script>
