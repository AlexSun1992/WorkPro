<template>
  <div :data-card-id="$route.params.idItem">
    <b-modal
      :id="'confirmAction'"
      modal-class="cabinet"
      centered
      :title="actionParamsTitle"
      :ok-disabled="actionFormDisabled"
      ok-title="Да"
      cancel-title="Нет"
      auto-focus-button="ok"
      no-close-on-backdrop
      no-fade
      @ok="confirmOkHandler"
      @cancel="confirmCancelHandler"
      @hidden="confirmCancelHandler"
    >
      Вы действительно хотите выполнить действие "{{ actionParamsTitle }}"?
      <b-alert :show="isActionApplyError" variant="danger">
        {{ actionApplyErrorMessage }}
      </b-alert>
      <b-form @submit="confirmOkHandler">
        <Form
          v-if="actionParams.length"
          :data="actionParams"
          :edit="!actionFormDisabled"
          @update="updateActionParams($event)"
        />
      </b-form>
    </b-modal>
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
      <FormAccordion
        v-if="isAccordion && !isTabs && !isBlock"
        :class="{ 'mt-5': !params.settings && showBtnBack }"
        :data="data"
        :tabs="tabs"
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
      />
    </div>
    <SkeletonBox
      v-if="!data.length || !isScriptLoaded"
      class="mt-5"
      :items="8"
    />
  </div>
</template>
<script>
import JsFileDownloader from "js-file-downloader";
import mime from "mime-types";
import Form from "~/components/Libs/Form/Form";
import ActionButton from "~/components/Pages/Cabinet/Block/ActionButton";
import SkeletonBox from "~/components/Libs/SkeletonBox";
import FormAccordion from "@/components/Libs/Form/FormAccordion";
import { getErrorMessage } from "@/utils/transform";
import FormBlock from "@/components/Libs/Form/FormBlock";
import { clearScript } from "~/components/EventHandler/eventHandler.helper";
import { fetchPoutvalue } from "../../../utils/fetchPoutvalue";
import { saveFileAxios } from "../../../utils/saveFile";

let controller;
let confirmPromise = null;
let confirmResolve = () => null;

export default {
  name: "CardEditor",
  components: { FormBlock, FormAccordion, Form, ActionButton, SkeletonBox },
  props: {
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
      required: false,
      default: () => true,
    },
    wizardTabs: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      actionParamsTitle: null,
      actionParamsId: null,
      actionFormDisabled: false,
      isActionApplyError: false,
      actionApplyErrorMessage: null,
      disabledButtons: {
        background: "#dddbdd",
        boxShadow: "none",
        border: "none",
        color: "#dddbdd",
      },
      saveSuccess: false,
    };
  },
  computed: {
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
    tabs() {
      return this.params.tabs;
    },
    captions() {
      return this.$store.getters["data_card/getCaptions"];
    },
    isAccordion() {
      return this.$store.getters["menu/getMenuById"](this.$route.params.idItem)
        ?.LACCORDION;
    },
    isBlock() {
      return this.$store.getters["menu/getMenuById"](this.$route.params.idItem)
        ?.LUSEBLOCK;
    },
    isTabs() {
      return this.$store.getters["menu/getMenuById"](this.$route.params.idItem)
        ?.LTABBED;
    },
    actionParams() {
      return this.$store.getters["data_card/getActionParams"];
    },
    actionSettings() {
      return this.params.actions.find((a) => a.id === this.actionParamsId);
    },
    closeAfterSave() {
      return this.$store.getters["menu/getMenuById"](this.$route.params.idItem)
        ?.LCLOSEAFTERSAVE;
    },
    isScriptLoaded() {
      return this.$store.getters["blocks/getScriptStatus"];
    },
  },

  async created() {
    try {
      if (process.client) {
        await this.$store.dispatch("blocks/getScript", {
          idModule: this.$route.params.idModule,
          idItem: this.$route.params.idItem,
        });
      }
      this.$root.eventHandler =
        typeof eventHandler === "function" ? eventHandler : null;

      this.stripeLoaded();
    } catch (e) {
      console.warn(`Ошибка загрузки скрипта`);
    }
  },

  unmounted() {
    this.$store.commit("data_card/cardChanged", false);
    this.$store.commit("data_card/setError", false);
    this.$store.commit("data_card/setSavedError", false);
  },
  methods: {
    stripeLoaded() {
      try {
        if (typeof initHandler === "function") {
          this.$store.commit(
            "data_card/setForm",
            initHandler(
              this.data.map((a) => ({ ...a })),
              { ...this.params, edit: this.edit }
            ) || this.data
          );
        }
      } catch {}
    },

    confirmAction() {
      confirmPromise = new Promise((resolve) => {
        confirmResolve = (result) => resolve(result);
      });
      this.$bvModal.show("confirmAction");

      return confirmPromise;
    },
    confirmOkHandler() {
      confirmResolve(true);
    },
    confirmCancelHandler() {
      confirmResolve(false);
    },

    async startAction(e) {
      const field = this.data.find((f) => f.fieldId === e.fieldId);
      this.isActionApplyError = false;
      const actionId = e.value.replace("Item", "");
      let moduleId;
      let cardId;

      if (!this.params.page) {
        moduleId = this.$route.params.idModule;
        cardId = this.$route.params.idCard;
      } else {
        moduleId = this.params.page.idModule;
        cardId = this.$store.getters["data_card/getCardId"];
      }
      let params = {
        idCard: this.$store.getters["data_card/getCardId"],
        idItem: this.$route.params.idItem,
        idModule: this.$route.params.idModule,
        idRel: this.$store.getters["data_card/getCardRelId"],
      };

      await this.$store.dispatch("data_card/fetchActionParams", {
        moduleId,
        actionId,
        cardId,
      });
      this.actionParamsTitle = field.label;
      this.actionParamsId = parseInt(actionId, 10);

      if (this.actionSettings.isDialog) {
        this.$store.commit("data_card/setLoading", false);
        const confirmResult = await this.confirmAction();
        if (!confirmResult) {
          return;
        }
      }

      const isValidParams = await this.$store.dispatch(
        "data_card/validateActionParams"
      );
      if (!isValidParams) {
        return;
      }

      const flatmenu = this.$store.getters["menu/flatmenu"];
      const menuItem = flatmenu.find(
        (item) => item.IDITEM == this.$route.params.idItem
      );
      const CUR = menuItem.ACTIONSCUR.find((item) => item.ID == actionId);

      if (CUR.NTYPE === 38) {
        this.saveSuccess = false;
        const data = await eventHandler(
          this.data.map((a) => ({ ...a })),
          e,
          "beforeSave"
        );

        if (data) {
          this.$store.commit("data_card/setForm", data || this.data);
        }
        // Не понятно как вычислить этот параметр (step), поэтому захардкожен 0
        await this.saveDataCard(0);

        if (this.saveSuccess) {
          const data = await eventHandler(
            this.data.map((a) => ({ ...a })),
            e,
            "afterSave"
          );

          if (data) {
            this.$store.commit("data_card/setForm", data || this.data);
          }
        }
        return;
      }
      if (CUR.NTYPE === 39) {
        this.$store.commit("data_card/setLoading", false);
        this.$store.commit("data_card/setReadOnly", false);
        const data = await eventHandler(
          this.data.map((a) => ({ ...a })),
          e
        );

        if (data) {
          this.$store.commit("data_card/setForm", data || this.data);
        }
        await this.$store.dispatch("data_card/fetchList", params);
        params = {
          idCard: this.$store.getters["data_card/getCardId"],
          idItem: this.$route.params.idItem,
          idModule: this.$route.params.idModule,
          idRel: this.$store.getters["data_card/getCardRelId"],
        };
        await this.$store.dispatch("data_card/fetchForm", params);
        return;
      }
      await this.applyAction();
    },

    async updateValue(e) {
      const field = this.data.find((f) => f.fieldId === e.fieldId);
      if (field.type === "button") {
        this.$store.commit("data_card/setError", false);
        this.$store.commit("data_card/setSavedError", false);
      }
      if (field.type !== "button") {
        this.$store.commit("data_card/cardChanged", true);
      }
      if (field.type === "button" && e.action) {
        const actionId = Number(e.value.replace("Item", ""));
        this.$store.commit("data_card/setFetchingAction", {
          actionId,
          isFetching: true,
        });
        await this.startAction(e).finally(() => {
          this.$store.commit("data_card/setFetchingAction", {
            actionId,
            isFetching: false,
          });
        });
        return;
      }
      if (field.type === "button") {
        const data = await eventHandler(
          this.data.map((a) => ({ ...a })),
          e
        );

        if (data) {
          this.$store.commit("data_card/setForm", data || this.data);
        }
      }
      if (field.type === "OneToMany") {
        this.$store.commit("data_card/setFormOneToManyField", {
          fieldId: e.fieldId,
          value: e.value,
          action: e.action,
        });
      } else {
        this.$store.commit("data_card/setFormField", {
          fieldId: e.fieldId,
          name: e.name,
          value: e.value,
        });
      }
      if (typeof eventHandler === "function" && field.type != "button") {
        try {
          const data = await eventHandler(
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
        this.$router.push(
          `/cabinet/${this.params.page.idModule}/0/${idItem}/0?ref=${this.$route.fullPath}`
        );
      } else {
        throw new Error(
          `В опции кнопки не указан идентификатор меню. Пример наимменования кнопки: "Card178"`
        );
      }
    },
    validateData(data) {
      let valid = true;
      for (let i = 0; i < data.length; i++) {
        const value =
          data[i].type === "enum" ? data[i].value.value : data[i].value;

        if (
          data[i].required &&
          !data[i].hidden &&
          data[i].visible &&
          (value === null ||
            value === undefined ||
            value === "" ||
            value === false ||
            data[i].error) &&
          value !== 0
        ) {
          console.log("error", data[i]);
          valid = false;
          this.$store.commit("data_card/setFormField", data[i]);
        }
        if (data[i].type === "OneToMany") {
          const valueOneToMany = data[i].value;
          if (Array.isArray(valueOneToMany)) {
            valueOneToMany.forEach((webFields, indexWebFields) => {
              const isValidValue = (value) => {
                if (
                  (value === null || value === undefined || value === "") &&
                  value !== 0
                ) {
                  return false;
                }
                return true;
              };
              const webFieldsErrors = webFields.filter(
                (item) =>
                  item.visible === true &&
                  item.required === true &&
                  isValidValue(item.value) === false
              );
              if (webFieldsErrors) {
                webFieldsErrors.forEach((errorField, indexField) => {
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
            (elem) =>
              (elem.type === "Uploader" || elem.type === "uploadFiles") &&
              elem.value !== undefined
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
              await this.$store.dispatch("wizard/fetchWizard", {
                idModule: this.$route.params.idModule,
                idWizard: this.$route.params.idWizard,
                idCard: cardId,
              });
              this.$store.commit("data_card/setLoading", false);
              const nextIdItem =
                this.$store.getters["wizard/getWizardPages"].split(";")[step];
              const tab = this.wizardTabs.find(
                (w) => w.idItem === parseInt(nextIdItem, 10)
              );
              await this.$store.dispatch("menu/fetchMenuById", tab);
              const settingsTab = this.$store.getters[
                "menu/getSettingsByIdItem"
              ](tab.idItem || {});
              const rel = this.$store.getters["wizard/getWizard"]?.REL;
              let url;
              if (settingsTab?.isUploader === true) {
                url = `/cabinet/wizard/${this.$route.params.idWizard}/55/0/${
                  tab.idItem
                }/${cardId}/${rel.split("|")[tab.order - 1]}/uploader`;
              } else {
                url = `/cabinet/wizard/${this.$route.params.idWizard}${
                  tab.list ? `/list/` : `/`
                }${moduleId}/0/${tab.idItem}/${cardId}/${
                  rel.split("|")[tab.order - 1]
                }`;
              }
              if (url) {
                this.$router.push(url);
              }
              return;
            }
            if (this.closeAfterSave) {
              this.$router.push(`/cabinet/${moduleId}/0/${itemId}`);
            } else if (resp?.data?.RESULT?.POUTVALUE) {
              if (resp?.data?.RESULT?.POUTVALUE.includes("/")) {
                this.$router.push(resp?.data?.RESULT?.POUTVALUE);
              }
            } else {
              this.$router.push(
                `/cabinet/${moduleId}/0/${itemId}/${cardId}${
                  relId ? `/${relId}` : ""
                }`
              );
            }
            return;
          }
          if (resp?.status === 200) {
            this.saveSuccess = true;
            if (this.$route.query?.ref && resp) {
              this.$router.push(this.$route.query?.ref);
              return;
            }
            if (this.$route.params.idCard) {
              await this.$store.dispatch(
                "data_card/fetchForm",
                this.$route.params
              );
            }
            if (this.wizardTabs) {
              await this.$store.dispatch(
                "wizard/fetchWizard",
                this.$route.params
              );

              fetchPoutvalue(resp.data, {
                router: this.$router,
                isInNewWindow: false,
                toaster: this.$bvToast,
              });
            }
          } else if (resp?.status === 500 || resp?.status === 520) {
            this.$store.commit("data_card/setLoading", false);
            this.$store.commit("data_card/setDisabled", false);
            this.$store.commit("data_card/setSavedError", true);
            this.$store.commit("data_card/setErrorMessage", resp.data);
          }
          this.$emit("error", null);
        } catch (err) {
          if (this.$route.path.includes("55/0/19")) {
            this.$emit(
              "error",
              err?.response?.data?.INFO || err?.response?.data?.MESSAGE
            );
          }
          const errorInfo =
            err?.response?.data?.INFO ||
            err?.response?.data?.MESSAGE ||
            err.message;
          if (errorInfo) {
            this.$store.commit("data_card/setFieldError", errorInfo);
          }
        }
      } else {
        this.$store.commit("data_card/setSavedError", true);
        this.$store.commit("data_card/setErrorMessage", {
          MESSAGE: "Проверьте правильность заполнения формы!",
        });
      }
    },
    cancelDataCard() {
      this.$store.commit("data_card/cardChanged", false);
      this.$store.commit(
        "data_card/setForm",
        JSON.parse(JSON.stringify(this.$store.getters["data_card/getCopyForm"]))
      );
    },
    updateActionParams(e) {
      this.$store.commit("data_card/setActionParamsField", e);
    },
    async applyAction(evt) {
      if (evt) evt.preventDefault();
      if (this.actionSettings.type === 2) {
        if (this.actionSettings.command) {
          const redirectURL = this.$route.params.idCard
            ? `/cabinet/${this.$route.params.idModule}/0/${this.actionSettings.command}/0/${this.$route.params.idCard}?ref=${this.$route.fullPath}`
            : `/cabinet/${this.$route.params.idModule}/0/${this.actionSettings.command}/0?ref=${this.$route.fullPath}`;

          if (this.actionSettings.isCurrentWindow) {
            this.$router.push(redirectURL);
          } else {
            window.open(redirectURL);
            this.$nextTick(() => {
              this.$bvModal.hide("confirmAction");
            });
          }
        } else {
          throw new Error(`В опции кнопки не указан идентификатор меню."`);
        }
        return;
      }

      const relId =
        this.$route.params.idRel ||
        this.$route.query.rel ||
        this.$store.getters["data_card/getFormParams"]?.idRel;

      const rowId =
        this.$route.params.idCard ||
        this.$store.getters["data_card/getFormParams"]?.idCard;

      this.$store.commit("data_card/setError", false);
      this.$store.commit("data_card/setSavedError", false);
      this.$store.commit("data_card/setLoading", true);

      if (this.actionSettings.type === 3) {
        const requestDownLoadFileUrl = new URL(
          "/am/main/v2/report2",
          window.location.origin
        );

        requestDownLoadFileUrl.searchParams.set("id", rowId);
        requestDownLoadFileUrl.searchParams.set("rel", relId);
        requestDownLoadFileUrl.searchParams.set(
          "idaction",
          this.actionSettings.id
        );
        requestDownLoadFileUrl.searchParams.set(
          "relaction",
          this.actionSettings.relaction
        );
        await this.$axios({
          url: requestDownLoadFileUrl.href,
          method: "GET",
          responseType: "blob",
        })
          .then((resp) => {
            saveFileAxios(resp, !this.actionSettings?.isCurrentWindow);
          })
          .catch(() => {
            this.$store.commit("data_card/setError", true);
            this.$bvToast.toast("Не удалось скачать файл", {
              title: "Ошибка",
              variant: "danger",
              noAutoHide: true,
              solid: true,
            });
          })
          .finally(() => this.$store.commit("data_card/setLoading", false));
        return;
      }

      this.isActionApplyError = false;
      this.actionFormDisabled = true;
      const response = await this.$store.dispatch("data_card/executeAction", {
        actionId: this.actionParamsId,
        relActionId: this.actionSettings.relaction,
        relId,
        rowId,
        body: this.actionParams,
      });

      this.actionFormDisabled = false;
      if (response?.status === 500 || response?.status === 520) {
        this.$store.commit("data_card/setLoading", false);
        if (this.actionSettings.isDialog) {
          this.isActionApplyError = true;
          this.actionApplyErrorMessage = getErrorMessage(response.data);
        } else {
          this.$store.commit("data_card/setSavedError", true);
          this.$store.commit("data_card/setErrorMessage", response.data);
        }
      }
      if (response?.status === 200) {
        this.$nextTick(() => {
          this.$bvModal.hide("confirmAction");
        });
        if (this.$route.query?.ref && this.actionSettings?.closeAfter) {
          this.$router.push(this.$route.query?.ref);
        }
        if (response.data.POUTVALUE) {
          if (response.data.POUTVALUE.includes("/")) {
            if (response.data.POUTVALUE.includes("cabinet")) {
              this.$router.push(response.data.POUTVALUE);
            } else {
              const url = response.data.POUTVALUE;
              if (url.includes("/file")) {
                const [, , , idReport, idCard] = url.split("/");
                try {
                  const file = await this.$axios({
                    url: `/am/main/v2/report?idreport=${idReport}&id=${idCard}`,
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
                } catch (e) {
                  this.$bvToast.toast("Не удалось скачать файл", {
                    title: "Ошибка",
                    variant: "danger",
                    noAutoHide: true,
                    solid: true,
                  });
                }
              } else {
                //  Safari fix https://stackoverflow.com/questions/20696041/window-openurl-blank-not-working-on-imac-safari
                setTimeout(() => {
                  window.open(
                    response.data.POUTVALUE,
                    this.actionSettings?.isCurrentWindow ? "_self" : "_blank"
                  );
                });
              }
            }
          } else {
            this.$root.$bvToast.toast(response.data.POUTVALUE, {
              title: "",
              variant: "success",
              solid: true,
              autoHideDelay: 5000,
              toaster: "b-toaster-top-full",
            });
          }
        }
        if (this.actionSettings?.refresh) {
          await this.$store.dispatch("data_card/fetchForm", this.$route.params);
        }
        if (this.wizardTabs) {
          await this.$store.dispatch("wizard/fetchWizard", this.$route.params);
        }
        this.$store.commit("data_card/setLoading", false);
      }
    },
    async callbackAction(url) {
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
</style>
