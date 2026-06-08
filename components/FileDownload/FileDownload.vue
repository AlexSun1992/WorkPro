<template>
  <a
    href=""
    @click.prevent="downloadItem"
  >
    <div
      v-if="propBtnLabel"
      class="d-inline"
    >
      {{ propBtnLabel }}
    </div>
    <div
      v-if="!btnLabel"
      class="d-inline"
    >
      {{ propFileName }}
    </div>
    <div
      class="d-inline"
      v-if="propFileSize && propFileSize !== 0"
    >
      (<span class="size">{{ conv_size }}</span
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
  computed: {
    propFileName() {
      return this.fileName || this.$attrs.data?.value?.["file-name"] || "";
    },
    propFileSize() {
      return this.fileSize || this.$attrs.data?.value?.["file-size"] || "";
    },
    propId() {
      return this.id || this.$attrs.data?.value?.id || "";
    },
    propRel() {
      return this.rel || this.$attrs.data?.value?.rel || "";
    },
    propBtnLabel() {
      return this.btnLabel || this.$attrs.data?.value?.["btn-label"] || this.$attrs.data?.label || "";
    },
    conv_size() {
      let fsize;
      const fsizekb = this.propFileSize / 1024;
      const fsizemb = fsizekb / 1024;

      if (fsizekb <= 1024) {
        fsize = `${fsizekb.toFixed(1)} кб`;
      } else if (fsizekb >= 1024 && fsizemb <= 1024) {
        fsize = `${fsizemb.toFixed(1)} мб`;
      }
      return fsize;
    },
  },
  methods: {
    async downloadItem() {
      try {
        const response = await this.$axios({
          url: `/lk/main/v2/file/${this.propId}?rel=${this.propRel}`,
          method: "GET",
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");

        link.href = url;
        link.download = this.propFileName;

        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        this.$modal.alert({
          title: "Извините, произошла ошибка",
          msg: "Не удалось скачать файл",
          icon: "error",
          btnOk: false,
        });
      }
    },
  },
};
</script>
