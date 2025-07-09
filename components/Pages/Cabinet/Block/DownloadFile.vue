<template>
  <div class="name">
    <button
      @click="downloadItem()"
      class="file-download nounderline border-none"
    >
      <b>Скачать файл</b>
    </button>
  </div>
</template>

<script>
import Cookies from "js-cookie";

const TOKEN_NAME = "auth._token.local";

export default {
  name: "DownloadFile",
  props: {
    linkId: {
      type: String,
      default: "",
    },
    fileName: {
      type: String,
      default: "file.pdf",
    },
  },

  data() {
    return {
      indicator: null,
      componentKey: 0,
    };
  },

  methods: {
    saveFile(blob, fileName, documentType, isNewWindow = false) {
      const link = document.createElement("a");
      const objectUrl = window.URL.createObjectURL(
        new Blob([blob], {
          type: documentType,
        })
      );
      link.href = objectUrl;
      link.setAttribute("download", fileName);
      if (isNewWindow) {
        link.setAttribute("target", "_blank");
      }

      document.body.appendChild(link);
      link.click();
    },
    saveFileAxios(axiosResponse, isNewWindow) {
      if (axiosResponse === undefined) {
        return;
      }

      const responseHeaders = new Headers(axiosResponse.headers);
      const contentType = responseHeaders.get("content-type");

      this.saveFile(axiosResponse.data, this.fileName, contentType, isNewWindow);
    },
    async downloadItem() {
      const token = Cookies.get(TOKEN_NAME);

      try {
        const response = await this.$axios({
          url: `/am/main/v2/msdoc/${this.linkId}`,
          method: "GET",
          responseType: "blob",
          headers: {
            Authorization: token,
          },
        });

        this.saveFileAxios(response, false);
      } catch (e) {
        this.$modal.alert({
          title: "Извините, произошла ошибка",
          msg: "Не удалось скачать файл",
          icon: "error",
          btnOk: false,
        });
      }
    },

    update(event) {
      this.$emit("update", event);
    },
  },
};
</script>

<style scoped></style>
