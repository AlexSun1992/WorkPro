<template>
  <button
    type="button"
    @click="download()"
    :disabled="isLoading"
    :id="data.webId ? data.webId : ''"
    :class="isLoading ? 'spinning' : ''"
  >
    {{ data.label }}
    <b-spinner v-if="isLoading" variant="success" label="Spinning"></b-spinner>
  </button>
</template>

<script>
export default {
  name: "ControlDownload",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    params: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    actionId() {
      return parseInt(this.data.name.replace("Item", ""), 10);
    },
    actionParams() {
      return this.params.actions.find((action) => action.id === this.actionId);
    },
  },
  methods: {
    async download() {
      try {
        this.isLoading = true;
        const executeAction = await this.$store.dispatch(
          "data_card/executeAction",
          {
            actionId: this.actionId,
            relActionId: this.actionParams.relaction,
            relId: this.$store.getters["data_card/getFormParams"]?.idRel,
            rowId: this.$store.getters["data_card/getFormParams"]?.idCard,
            body: {},
          }
        );
        const url = executeAction?.data?.POUTVALUE;
        if (url) {
          const file = await this.$axios({
            url,
            method: "GET",
            responseType: "blob",
          });
          const fileName = url.split("/").pop().split("?")[0];
          const fileUrl = window.URL.createObjectURL(
            new Blob([file.data], {
              type: file.headers["content-type"],
            })
          );
          const link = document.createElement("a");
          link.href = fileUrl;
          link.setAttribute("download", fileName);
          link.setAttribute("target", "_blank");
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(fileUrl);
        } else {
          throw new Error("Ошибка получения URL");
        }
      } catch (e) {
        console.error(e);
        this.$bvToast.toast("Не удалось скачать файл", {
          title: "Ошибка",
          variant: "danger",
          noAutoHide: true,
          solid: true,
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped></style>
