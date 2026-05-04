<template>
  <div class="mt-4 buttons row">
    <div class="col-auto">
      <button
        type="button"
        :disabled="isLoading || isInValidFiles || isCompressing"
        class="btn btn-success"
        @click="saveUploader()"
      >
        {{ saveButtonName }}
        <span
          v-if="isLoading"
          class="spinner-border"
          ><span class="sr-only"></span
        ></span>
      </button>
    </div>

    <div class="col-12 d-lg-none"></div>
    <div
      class="col-auto mt-3 mt-lg-0"
      v-if="isWizardMode"
    >
      <button
        type="button"
        class="btn btn-secondary"
        @click="goBack()"
      >
        Назад
      </button>
    </div>
    <div
      class="col-auto mt-3 mt-lg-0"
      v-if="isRefInURL && !isWizardMode"
    >
      <button
        type="button"
        class="btn btn-secondary"
        @click="clickCancelButton()"
      >
        Отменить
      </button>
    </div>
  </div>
</template>
<script>
import { fetchPoutvalue } from "@/utils/fetchPoutvalue";
import menuSettings from "@/converters/menuSettings";

export default {
  name: "UploaderButtons",
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    isCompressing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    getURL(item) {
      const settingsTab = this.$store.getters["menu/getSettingsByIdItem"](item.idItem || {});
      if (settingsTab?.isUploader === true) {
        return `/cabinet/wizard/${this.$route.params.idWizard}/55/0/${item.idItem}/${this.$route.params.idCard}/${
          this.rels.split("|")[item.order - 1]
        }/uploader`;
      }
      if (this.$route.params.idCard === "0") {
        return `/cabinet/wizard/${this.$route.params.idWizard}${item.list ? `/list/55/0/` : `/55/0/`}${
          item.idItem
        }/0/0`;
      }
      return `/cabinet/wizard/${this.$route.params.idWizard}${item.list ? `/list/55/0/` : `/55/0/`}${item.idItem}/${
        this.$route.params.idCard
      }/${this.rels.split("|")[item.order - 1]}`;
    },

    getCurrentIndex() {
      return this.tabs.findIndex((item) => item.idItem == this.currentTab.idItem);
    },
    async saveUploader() {
      if (this.formSettings.MODAL_OPEN) {
        const h = this.$createElement;
        const titleVNode = h("div", {
          domProps: {
            innerHTML: this.formSettings.MODAL_TEXT ? this.formSettings.MODAL_TEXT : "Что-то пошло не так...",
          },
        });
        const bvUserChose = await this.$bvModal
          .msgBoxConfirm(titleVNode, {
            title: "Вы уверены?",
            size: "md",
            buttonSize: "md",
            okVariant: "success",
            okTitle: "Да, отправить",
            cancelTitle: "Нет, передумал",
            footerClass: "p-2",
            hideHeaderClose: false,
            modalClass: ["cabinet"],
            centered: true,
          })
          .catch((err) => {
            console.error(err);
          });
        if (!bvUserChose) {
          return;
        }
      }
      await this.saveDataUploader();
    },

    async saveDataUploader() {
      await this.$store.dispatch("uploader/saveDataUploader", {
        ...this.$route.params,
      });
      await this.$store.dispatch("uploader/fetchData", {
        ...this.$route.params,
      });

      if (this.isLoadSuccessFull) {
        fetchPoutvalue(this.getDataSuccess, {
          router: this.$router,
          isInNewWindow: false,
          toaster: this.$bvToast,
        });

        if (this.isWizardMode === true) {
          if (this.tabs.length > 0) {
            this.getCurrentIndex();
            const tab = this.tabs[this.getCurrentIndex() + 1];
            await this.$router.push(this.getURL(tab));
          } else {
            this.$router.push(`/cabinet/${this.$route.params.idModule}/0/${this.$route.params.idItem}/uploader`);
          }
        }
        if (this.isWizardMode === false && this.isRefInURL === true) {
          this.$router.push(this.$route.query?.ref);
        }
      }
    },
    async goBack(e) {
      const tab = this.tabs[this.getCurrentIndex() - 1];
      await this.$store.dispatch("menu/fetchMenuById", e);
      this.$router.push(this.getURL(tab));
    },
    clickCancelButton() {
      this.$router.push(this.$route.query?.ref);
    },
  },
  computed: {
    getDataSuccess() {
      return this.$store.getters["uploader/getDataSuccess"];
    },
    saveButtonName() {
      return (
        this.$store.getters["uploader/metaData"]?.data?.find((item) => item.name === "Save" && item.type === "button")
          ?.label ?? "Сохранить"
      );
    },
    formSettings() {
      return this.$store.getters["uploader/formSettings"];
    },
    isWizardMode() {
      return this.$route.path.includes("wizard");
    },
    isRefInURL() {
      return Boolean(this.$route.query?.ref);
    },
    pages() {
      return this.$store.getters["wizard/getWizardPages"];
    },
    tabs() {
      const t = this.settings.wizard;
      const arr = [];
      if (this.pages) {
        const p_arr = this.pages.split(";");
        for (let i = 0; i < t.length; i++) {
          const p_item = p_arr.find((v) => parseInt(v) === t[i].idItem);
          if (p_item) {
            arr.push(t[i]);
          }
        }
      }
      return arr;
    },
    settings: {
      get() {
        return menuSettings
          .getData(this.$store.getters["menu/menu"], {
            idModule: 55,
            idParent: 0,
            idItem: this.$route.params.idWizard,
          })
          .slice(-1)
          .pop();
      },
    },
    rels() {
      const rel = this.$store.getters["wizard/getWizard"]?.REL;
      if (this.$route.params.idCard !== "0" && rel) {
        return rel;
      }
      return "|";
    },
    currentTab() {
      return this.tabs.find((item) => item.idItem == this.$route.params.idItem);
    },
    isLoadSuccessFull() {
      return this.$store.getters["uploader/isLoadSuccessFull"];
    },
    isInValidFiles() {
      return this.$store.getters["uploader/isInValidFiles"];
    },
  },
};
</script>

<style scoped></style>
