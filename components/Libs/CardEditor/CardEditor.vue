<template>
  <div :data-card-id="$route.params.idItem">
    <ControlModal
      id="confirmAction"
      :is-open="isConfirmModalOpen"
      :has-footer="true"
      :show-close="true"
      :show-ok="false"
      :show-cancel="false"
      :close-on-out-side-click="false"
      :close-on-esc="true"
      props-class="cabinet"
      @close="onModalClose"
    >
      <template #title>
        {{ actionParamsTitle }}
      </template>

      <div class="confirm-content">
        <p class="mb-3">Вы действительно хотите выполнить действие "{{ actionParamsTitle }}"?</p>

        <div
          v-show="isActionApplyError"
          class="alert alert-danger"
        >
          {{ actionApplyErrorMessage }}
        </div>

        <b-form @submit.prevent="confirmOkHandler">
          <Form
            v-if="actionParams.length"
            :data="actionParams"
            :edit="!isActionFormDisabled"
            @update="updateActionParams($event)"
          />
        </b-form>
      </div>

      <template #footer>
        <button
          class="btn-secondary"
          type="button"
          @click="confirmCancelHandler"
        >
          Нет
        </button>
        <button
          class="btn-primary"
          type="button"
          :disabled="isActionFormDisabled"
          @click="confirmOkHandler"
        >
          Да
        </button>
      </template>
    </ControlModal>
    <div v-if="data.length && isScriptLoaded">
      <Form
        v-if="!isAccordion && !isBlock"
        class="block-profile"
        :data="data"
        :tabs="tabs"
        :params="params"
        :is-tabs="isTabs"
        :edit="edit"
        @update="updateValue($event)"
        @clear="clearRelation($event)"
        @open-card="openCard($event)"
      />
      <FormBlock
        v-if="isBlock && !isTabs && !isAccordion"
        :data="data"
        :tabs="tabs"
        :params="params"
        :edit="edit"
        @update="updateValue($event)"
        @clear="clearRelation($event)"
        @open-card="openCard($event)"
        :current-tab="currentTab"
        :tabsWizard="tabsWizard"
        :qty="qty"
        :loading="loading"
        @goNext="$emit('goNext', $event)"
        @goBack="$emit('goBack', $event)"
        @saveCard="$emit('saveCard', $event)"
      />
    </div>
  </div>
</template>

<script>
import JsFileDownloader from "js-file-downloader";
import mime from "mime-types";
import { mapGetters } from "vuex";
import Form from "~/components/Libs/Form/Form";
import FormBlock from "@/components/Libs/Form/FormBlock";
import { fetchPoutvalue } from "@/utils/fetchPoutvalue";
import { hasLocalScript } from "./card.helper";
import { saveFileAxios } from "@/utils/saveFile";
import getScript from "@/utils/getScript";
// eslint-disable-next-line import/extensions
import { validateWithMask } from "@/store/data_card.helpers";
import { cardEditorModalCardInfoInterceptor } from "@/components/Libs/CardEditor/CardEditorModalCardInfoInterceptor";
import ControlModal from "../Controls/AsyncModalAction/ControlModal";

let controller;
let confirmPromise = null;
let confirmResolve = () => null;

export default {
  name: "CardEditor",
  components: {
    FormBlock,
    Form,
    ControlModal,
  },
  props: {
    currentTab: {
      type: Object,
      default: null,
    },
    qty: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: null,
    },
    wizardTabs: {
      type: Array,
      default: () => [],
    },
    params: {
      type: Object,
      required: true,
      default: () => {},
    },
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    edit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      actionParamsId: null,
      disabledButtons: {
        background: "#dddbdd",
        boxShadow: "none",
        border: "none",
        color: "#dddbdd",
      },
      saveSuccess: false,
      isConfirmModalOpen: false,
    };
  },

  created() {
    cardEditorModalCardInfoInterceptor(this);
  },

  async mounted() {
    try {
      this.eventHandler = await this.loadScript();
      this.initHandler = await this.loadInitScript();
      this.$root.eventHandler = typeof this.eventHandler === "function" ? this.eventHandler : null;
      this.$root.initHandler = typeof this.initHandler === "function" ? this.initHandler : null;
      if (this.isCurrentCard) {
        this.stripeLoaded();
      }
    } catch (e) {
      console.warn("Ошибка загрузки скрипта", e);
    }
  },

  computed: {
    ...mapGetters("data_card", ["getError", "getLoading"]),
    ...mapGetters("wizard", ["getIsWizardButtonsLoading"]),
    isShowSkeletonBox() {
      return !this.data.length || (!this.isScriptLoaded && !this.$route.params.idWizard);
    },
    isActionFormDisabled() {
      return this.$store.getters["data_card/getIsActionFormDisabled"];
    },
    actionParamsTitle() {
      return this.$store.getters["data_card/getActionParamsTitle"];
    },
    isActionApplyError() {
      return this.$store.getters["data_card/getisActionApplyError"];
    },
    getWindowLocation() {
      if (process.client === true) {
        return window.location;
      }
      return null;
    },

    showBtnBack() {
      const path = this.$store.state.data_card.listPath;
      // Жестко убрали кнопку с полиса осаго (Игорь)
      return path && !path.includes("/55/0/19") && !path.includes("/55/0/738");
    },
    actionApplyErrorMessage() {
      return this.$store.getters["data_card/getactionApplyErrorMessage"];
    },
    tabs() {
      return this.params.tabs;
    },
    captions() {
      return this.$store.getters["data_card/getCaptions"];
    },
    isAccordion() {
      return this.$store.getters["menu/getMenuById"](this.$route.params.idItem)?.LACCORDION;
    },
    isBlock() {
      return this.$store.getters["menu/getMenuById"](this.$route.params.idItem)?.LUSEBLOCK;
    },
    isTabs() {
      return this.$store.getters["menu/getMenuById"](this.$route.params.idItem)?.LTABBED;
    },
    actionParams() {
      return this.$store.getters["data_card/getActionParams"];
    },
    closeAfterSave() {
      return this.$store.getters["menu/getMenuById"](this.$route.params.idItem)?.LCLOSEAFTERSAVE;
    },
    isScriptLoaded() {
      return this.$store.getters["blocks/getScriptStatus"];
    },
    eventLocalHandler() {
      return () => import(`@/components/EventHandler/${this.$route.params.idItem}/eventHandler`);
    },
    initLocalHandler() {
      return () => import(`@/components/EventHandler/${this.$route.params.idItem}/eventHandler`);
    },
    isCurrentCard() {
      if (!process.client) return false;
      return (
        this.params.idItem === Number(document.location.pathname.split("/").at(6)) ||
        this.params.idItem === Number(document.location.pathname.split("/").at(4))
      );
    },
    isClient() {
      return process.client;
    },
  },

  beforeUnmount() {
    this.$store.commit("data_card/clearDictionariesUrls");
    this.$store.commit("data_card/setIsShowLoader", false);
  },

  unmounted() {
    this.$store.commit("data_card/cardChanged", false);
    this.$store.commit("data_card/setError", false);
    this.$store.commit("data_card/setSavedError", false);
  },
  methods: {
    async loadScript() {
      if (!process.client) return;
      const hardcodedScripts = hasLocalScript(this.$route.params.idItem);
      this.$store.commit("blocks/scriptLoaded", false);
      if (hardcodedScripts) {
        this.$store.commit("blocks/scriptLoaded", true);
        const script = await this.eventLocalHandler();
        console.log("localScript load", document);
        return script.eventHandler;
      }
      console.log("networkScript load", document);
      await getScript({
        idModule: this.$route.params.idModule,
        idItem: this.$route.params.idItem,
      });
      this.$store.commit("blocks/scriptLoaded", true);
      return eventHandler;
    },
    async loadInitScript() {
      const hardcodedScripts = hasLocalScript(this.$route.params.idItem);
      if (hardcodedScripts) {
        const script = await this.initLocalHandler();
        return script.initHandler;
      }
      return initHandler;
    },
    stripeLoaded() {
      try {
        if (typeof this.initHandler === "function") {
          this.$store.commit(
            "data_card/setForm",
            this.initHandler(
              this.data.map((a) => ({ ...a })),
              { ...this.params, edit: this.edit }
            ) || this.data
          );
        }
      } catch (e) {
        console.log(e);
      }
    },

    confirmAction() {
      confirmPromise = new Promise((resolve) => {
        confirmResolve = (result) => resolve(result);
      });
      this.isConfirmModalOpen = true;

      return confirmPromise;
    },
    confirmOkHandler() {
      confirmResolve(true);
    },
    confirmCancelHandler() {
      confirmResolve(false);
    },

    async updateWizard() {
      if (this.$store.getters["wizard/getIsWizard"]) {
        await this.$store.dispatch("wizard/fetchWizard", this.$route.params);
      }
    },
    async updateValue(e) {
      const field = this.data.find((f) => f.fieldId === e.fieldId);

      if (field.type === "button" && e.action) {
        await this.saveDataCard(0);

        if (this.$store.getters["data_card/getSaveSuccess"] && typeof e.successAction === "function") {
          e.successAction();
        }
      }
      if (field.type !== "button") {
        this.$store.commit("data_card/cardChanged", true);
      }
      await this.$store.dispatch("data_card/setActionFormField", {
        fieldId: e.fieldId,
        name: e.name,
        value: e.value,
        action: e.action,
        params: this.params,
      });
      if (typeof this.eventHandler === "function" && field.type !== "button") {
        try {
          const data = await this.eventHandler(
            this.$store.getters["data_card/getForm"].map((a) => ({ ...a })),
            e,
            this.callbackAction
          );
          if (data) {
            this.$store.commit("data_card/setForm", data);
          }
        } catch (e) {
          console.error(e);
        }
      }
    },

    clearRelation(e) {
      this.$store.commit("data_card/clearFormRelationField", {
        fieldName: e.fieldName,
      });
    },

    openCard(e) {
      const arrName = e.name.split("Card");
      const idItem = arrName[1];
      if (idItem) {
        this.$router.push(`/cabinet/${this.params.page.idModule}/0/${idItem}/0?ref=${this.$route.fullPath}`);
      } else {
        throw new Error(`В опции кнопки не указан идентификатор меню. Пример наимменования кнопки: "Card178"`);
      }
    },
    validateData(data) {
      let valid = true;
      for (let i = 0; i < data.length; i++) {
        const value = data[i].type === "enum" ? data[i].value.value : data[i].value;
        const isStringWithMask = data[i].mask && data[i].type === "string";

        if (
          data[i].required &&
          (!isStringWithMask || data.type === "boolean") &&
          !data[i].hidden &&
          data[i].visible &&
          (value === null || value === undefined || value === "" || value === false || data[i].error) &&
          value !== 0
        ) {
          valid = false;
          this.$store.commit("data_card/setFormField", data[i]);
        }
        if (isStringWithMask && data[i].visible) {
          if (data[i].required && !value) {
            valid = false;
          }
          if (!validateWithMask(value, data[i].mask) && value) {
            valid = false;
          }
          this.$store.commit("data_card/setFormField", data[i]);
        }
        if (data[i].type === "OneToMany" && data[i].visible === true) {
          const valueOneToMany = data[i].value;
          if (Array.isArray(valueOneToMany)) {
            valueOneToMany.forEach((webFields, indexWebFields) => {
              const isValidValue = (value) => {
                if ((value === null || value === undefined || value === "") && value !== 0) {
                  return false;
                }
                return true;
              };
              const webFieldsErrors = webFields.filter(
                (item) => item.visible === true && item.required === true && isValidValue(item.value) === false
              );
              if (webFieldsErrors) {
                webFieldsErrors.forEach((errorField) => {
                  valid = false;
                  this.$store.commit("data_card/setFormOneToManyField", {
                    fieldId: data[i].fieldId,
                    value: {
                      name: errorField.name,
                      index: indexWebFields,
                      value: {
                        fieldId: errorField.fieldId,
                        name: errorField.name,
                        value: errorField.value,
                      },
                    },
                    action: "update",
                  });
                });
              }
            });
          }
        }
      }
      return valid;
    },
    async saveDataCard(step = 1) {
      this.$store.commit("data_card/cardChanged", false);
      this.$store.commit("data_card/saveButtonClicked", true);
      this.$store.commit("data_card/setSavedError", false);
      this.$store.commit("data_card/setErrorMessage", null);
      const fields = this.$store.getters["data_card/getForm"];

      if (this.validateData(fields)) {
        try {
          let itemId;
          let moduleId;
          let cardId;
          let relId;
          let action;
          if (!this.params.page) {
            itemId = this.$route.params.idItem;
            moduleId = this.$route.params.idModule;
            cardId = this.$route.params.idCard;
            relId = this.$route.params.idRel;
          } else {
            itemId = this.params.page.idItem;
            moduleId = this.params.page.idModule;
            cardId = this.$store.getters["data_card/getCardId"];
            relId = this.$store.getters["data_card/getCardRelId"];
          }

          const isUploaderFieldValueExist = fields.find(
            (elem) => (elem.type === "Uploader" || elem.type === "uploadFiles") && elem.value !== undefined
          );

          if (isUploaderFieldValueExist === undefined) {
            action = "saveDataCard";
          } else action = "saveDataCardUploaders";

          const resp = await this.$store.dispatch(`data_card/${action}`, {
            moduleId,
            itemId,
            cardId,
            relId,
            form: fields,
          });

          if (resp?.status !== 500 && resp?.status !== 520) {
            this.$root.$bvToast.toast(resp?.data?.MESSAGE, {
              title: "",
              variant: "success",
              autoHideDelay: 5000,
              solid: true,
              toaster: "b-toaster-top-full",
            });
          }
          if (
            this.$route.params.idCard === "0" &&
            !this.$route.query?.ref &&
            resp?.status !== 500 &&
            resp?.status !== 520
          ) {
            cardId = this.$store.getters["data_card/getCardId"];
            relId = this.$store.getters["data_card/getCardRelId"];
            if (this.$route.params.idWizard) {
              this.$store.commit("data_card/setLoading", true);
              this.$store.dispatch("wizard/isWizardButtonsLoading", true);
              await this.$store.dispatch("wizard/fetchWizard", {
                idModule: this.$route.params.idModule,
                idWizard: this.$route.params.idWizard,
                idCard: cardId,
              });
              this.$store.commit("data_card/setLoading", false);
              this.$store.dispatch("wizard/isWizardButtonsLoading", false);
              const nextIdItem = this.$store.getters["wizard/getWizardPages"].split(";")[step];
              const tab = this.wizardTabs.find((w) => w.idItem === parseInt(nextIdItem, 10));
              const settingsTab = this.$store.getters["menu/getSettingsByIdItem"](tab.idItem || {});
              const rel = this.$store.getters["wizard/getWizard"]?.REL;
              let url;
              if (settingsTab?.isUploader === true) {
                url = `/cabinet/wizard/${this.$route.params.idWizard}/55/0/${tab.idItem}/${cardId}/${
                  rel.split("|")[tab.order - 1]
                }/uploader`;
              } else {
                url = `/cabinet/wizard/${this.$route.params.idWizard}${tab.list ? `/list/` : `/`}${moduleId}/0/${
                  tab.idItem
                }/${cardId}/${rel.split("|")[tab.order - 1]}`;
              }
              if (url) {
                await this.$router.push(url);
              }
              return;
            }
            if (this.closeAfterSave) {
              this.$router.push(`/cabinet/${moduleId}/0/${itemId}`);
            } else if (resp?.data[0]?.RESULT?.POUTVALUE) {
              if (resp?.data[0]?.RESULT?.POUTVALUE.includes("/")) {
                this.$router.push(resp?.data[0]?.RESULT?.POUTVALUE);
              }
            } else {
              this.$router.push(`/cabinet/${moduleId}/0/${itemId}/${cardId}${relId ? `/${relId}` : ""}`);
            }
            return;
          }
          if (resp?.status === 200) {
            this.$store.commit("data_card/setSaveSuccess", true);
            if (this.$route.query?.ref && resp) {
              this.$router.push(this.$route.query?.ref);
              return;
            }
            if (resp?.data[0]?.SURL) {
              this.$router.push(resp?.data[0]?.SURL);
            }
            if (!this.$store.getters["data_card/cardChanged"]) {
              if (this.$route.params.idCard) {
                await this.$store.dispatch("data_card/fetchForm", this.$route.params);
              }
            }
            this.stripeLoaded();
            fetchPoutvalue(resp?.data[0]?.RESULT, {
              router: this.$router,
              isInNewWindow: false,
              toaster: this.$bvToast,
            });
          } else if (resp?.status === 500 || resp?.status === 520) {
            this.$store.commit("data_card/setLoading", false);
            this.$store.dispatch("wizard/isWizardButtonsLoading", false);
            this.$store.commit("data_card/setSavedError", true);
            this.$store.commit("data_card/setErrorMessage", resp.data);
          }
          this.$emit("error", null);
        } catch (err) {
          if (this.$route.path.includes("55/0/19")) {
            this.$emit("error", err?.response?.data?.INFO || err?.response?.data?.MESSAGE);
          }
          const errorInfo = err?.response?.data?.INFO || err?.response?.data?.MESSAGE || err.message;
          if (errorInfo) {
            this.$store.commit("data_card/setFieldError", errorInfo);
          }
        }
      } else {
        if (this.params.groupmenu === "ОСАГО") {
          const normalizedJSON = this.data.map((item) => ({
            [item.name]: item.value ?? null,
          }));
          const dataJSONString = JSON.stringify(normalizedJSON);
          this.$LogEvent({
            formName: "ОСАГО",
            idEventType: 1704,
            controlName: "CardEditor.vue",
            message: `
            IDITEM:${this.$route.params.idItem}
            IDDATA:${this.$route.params.idCard}
            SRESULT: "Проверьте правильность заполнения формы!"
            timeUser: ${new Date()}
            JSON: ${dataJSONString}
            `,
          });
        }
        this.$store.commit("data_card/setSavedError", true);
        this.$store.commit("data_card/setErrorMessage", {
          MESSAGE: "Проверьте правильность заполнения формы!",
        });
      }
    },
    cancelDataCard() {
      // обращается с CardPage
      this.$store.commit("data_card/cardChanged", false);
      this.$store.commit("data_card/setForm", JSON.parse(JSON.stringify(this.$store.getters["data_card/getCopyForm"])));
    },
    updateActionParams(e) {
      this.$store.commit("data_card/setActionParamsField", e);
    },

    async callbackAction(url) {
      console.log("callbackAction(url) card", url);
      try {
        if (controller) {
          controller.abort();
        }
        controller = new AbortController();
        const { data } = await this.$axios.get(url, {
          signal: controller.signal,
        });
        return data;
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style scoped>
.modal-content {
  min-height: 500px;
}
.action-button {
  position: absolute;
  right: 220px;
  bottom: 65px;
}
.error-message {
  padding: 15px;
}
.overlay {
  position: fixed;
  inset: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(239, 239, 240, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: all;
}
</style>
