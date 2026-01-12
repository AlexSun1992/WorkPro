<template>
  <button
    v-if="action"
    @click.stop="startAction()"
    class="btn"
    :class="defaultButtonClass"
    :id="componentId"
    type="button"
    :disabled="isDisabled"
  >
    <slot> {{ buttonText }}</slot>
    <b-spinner
      v-if="isLoading && isFetching"
      variant="success"
      label="Spinning"
    ></b-spinner>
  </button>
</template>

<script>
// eslint-disable-next-line import/extensions
import { getErrorMessage } from "@/plugins/auth/toast.helper";
import { fetchPoutvalue } from "@/utils/fetchPoutvalue";
import { saveFileAxios } from "@/utils/saveFile";

const DEFAULT_DISABLE_PERIOD = 60;
/**
 * Выполнить процедуру для строки
 * @TODO Явно использовать этот тип в коде
 */
const ACTION_TYPE_START_ACTION = 4;
/** Выполнить процедуру для строки (с последующим ожиданием) */
const ACTION_TYPE_RUN_WITH_PAUSE = 56;
/** Запустить пункт меню */
const ACTION_TYPE_START_MENU = 2;
/** Выполнить отчет для строки */
const ACTION_TYPE_RUN_REPORT = 3;
/** Сохранить карточку */
const ACTION_TYPE_SAVE_CARD = 38;
/** Обновить карточку */
const ACTION_TYPE_REFRESH_CARD = 39;

export default {
  name: "ActionButton",
  components: {},
  props: {
    cardData: {
      type: Object,
      /**
       * @return import('./actionButton.types').cardDataProp
       */
      default: () => null,
    },
    actionId: {
      type: String,
      required: false,
      default: () => null,
    },
    id: {
      type: String,
      required: false,
      default: () => null,
    },
    body: {
      type: [Object, Array],
      required: false,
    },
    insideContent: {
      type: String,
      required: false,
      default: () => "",
    },
    contextChanged: {
      type: Boolean,
      required: false,
    },
    params: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      disablePeriod: 0,
    };
  },

  methods: {
    async refreshPage() {
      if (typeof this.$root.initHandler === "function") {
        const fields = this.$store.getters["data_card/getForm"];
        const updatedFields = await this.$root.initHandler(fields.map((item) => ({ ...item })));
        if (!updatedFields.length) return;
        this.$store.commit("data_card/setForm", updatedFields);
      }
    },
    async updatedFields(e, action = "") {
      const fields = this.$store.getters["data_card/getForm"];
      if (typeof this.$root.eventHandler === "function") {
        const updatedFields = await this.$root.eventHandler(
          fields.map((item) => ({ ...item })),
          e,
          action
        );
        if (updatedFields) {
          this.$store.commit("data_card/setForm", updatedFields || fields);
          const isError = updatedFields.some((item) => item.error === true);
          if (isError) {
            return isError;
          }
        }
      }
      return fields;
    },

    /** Обработка нажатия на кнопку */
    async startAction() {
      const actionId = this.computedActionId;
      /** @type {import('@/store/menu.types').ActionInfo} */
      const actionInfo = this.action;

      if ("LHIDEDLG" in actionInfo && !actionInfo.LHIDEDLG) {
        const confirmResult = await this.confirmAction();
        if (!confirmResult) {
          return;
        }
      }

      if (actionInfo.NTYPE === ACTION_TYPE_START_MENU) {
        if (actionInfo.SCONST) {
          await this.$store.dispatch("menu/fetchMenuById", { idItem: actionInfo.SCONST });
          const settingsByMenu = this.$store.getters["menu/getSettingsByIdItem"](actionInfo.SCONST || {});
          if (settingsByMenu?.isModal) {
            const result = await this.$cardModal.open({
              idList: this.params.idCard,
              idModule: this.params.idModule,
              idItem: Number(actionInfo.SCONST),
              okTitle: "Далее",
            });
            if (result.ok && actionInfo.LREFRESH) {
              await this.$store.dispatch("data_card/fetchForm", this.params);
            }
            return;
          }
          const redirectURL = this.$route.params.idCard
            ? `/cabinet/${this.$route.params.idModule}/0/${actionInfo.SCONST}/0/${this.$route.params.idCard}?ref=${this.$route.fullPath}`
            : `/cabinet/${this.$route.params.idModule}/0/${actionInfo.SCONST}/0?ref=${this.$route.fullPath}`;

          if (actionInfo.LCURWINDOW) {
            this.goToLink(redirectURL);
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

      if (actionInfo.NTYPE === ACTION_TYPE_RUN_REPORT) {
        const requestDownLoadFileUrl = new URL("/am/main/v2/report2", window.location.origin);
        requestDownLoadFileUrl.searchParams.set("id", this.rowId);
        requestDownLoadFileUrl.searchParams.set("rel", this.relId);
        requestDownLoadFileUrl.searchParams.set("idaction", actionId);
        requestDownLoadFileUrl.searchParams.set("relaction", this.action.REL);

        await this.downloadFile(requestDownLoadFileUrl.href);
        return;
      }
      /**
       * @type {import('@/converters/dataform.types').Lk2Webfield}
       */
      const webfield = this.$attrs.data;

      if (webfield) {
        await this.updatedFields(webfield, "actionClicked");
        const data = {
          fieldId: webfield.fieldId,
          name: webfield.name,
          value: webfield.name,
          action: webfield.name.startsWith("Item"),
        };
        if (!this.$route) {
          this.$emit("update", data);
          return;
        }
        if (webfield.type === "button") {
          this.$store.commit("data_card/setError", false);
          this.$store.commit("data_card/setSavedError", false);
        }
        if (webfield.type === "button" && data.action) {
          this.$store.commit("data_card/setFetchingAction", {
            actionId,
            isFetching: true,
          });
          await this.fetchAction(data).finally(() => {
            this.$store.commit("data_card/setFetchingAction", {
              actionId,
              isFetching: false,
            });
          });
          return;
        }
        if (webfield.type === "button") {
          await this.updatedFields(data);
        }
        this.$store.commit("data_card/setFormField", {
          fieldId: data.fieldId,
          name: data.name,
          value: data.value,
        });
        await this.$root.eventHandler([], { actionId }, "actionClicked");
        return;
      }
      const actionResult = await this.executeAction();

      if (actionResult) {
        fetchPoutvalue(actionResult, {
          router: this.$router,
          isInNewWindow: !this.action.LCURWINDOW,
          toaster: this.$bvToast,
        });
      }
    },

    /** Основная функция запуска асинхронного действия */
    async fetchAction(data) {
      /**
       * @type {import('@/converters/dataform.types').Lk2Webfield | null}
       */
      const webfield = this.$attrs.data;
      this.$store.commit("data_card/setIsActionApplyError", false);
      const actionId = this.computedActionId;
      const moduleId = this.params.page ? this.params.page.idModule : this.$route.params.idModule;
      const cardId = this.params.page ? this.$store.getters["data_card/getCardId"] : this.$route.params.idCard;
      await this.$store.dispatch("data_card/fetchActionParams", {
        moduleId,
        actionId,
        cardId,
      });
      this.$store.commit("data_card/setActionParamsTitle", webfield?.label);

      const isValidParams = await this.$store.dispatch("data_card/validateActionParams");
      if (!isValidParams && !this.isDownloadControlButton) {
        return;
      }
      const flatmenu = this.$store.getters["menu/flatmenu"];
      const menuItem = flatmenu.find((item) => item.IDITEM == this.$route.params.idItem);
      const CUR = menuItem.ACTIONSCUR.find((item) => item.ID === actionId);

      if (CUR.NTYPE === ACTION_TYPE_SAVE_CARD) {
        const actionData = { ...data };

        this.$store.commit("data_card/setSaveSuccess", false);
        await this.updatedFields(data, "beforeSave");

        if (this.action?.SMESSAGE) {
          actionData.successAction = async () => {
            await this.$modal.alert(this.action?.SMESSAGE, {
              icon: "ok",
            });
          };
        }
        // Не понятно как вычислить этот параметр (step), поэтому захардкожен 0
        this.$emit("update", actionData);
        // TODO код ниже похоже вообще никогда не выполняется, так как UPDATE выше выполняет асинхронную операцию
        if (this.isSaveSuccess) {
          await this.updatedFields(data, "afterSave");
        }
        return;
      }
      if (CUR.NTYPE === ACTION_TYPE_REFRESH_CARD) {
        let params = {
          idCard: this.$store.getters["data_card/getCardId"],
          idItem: this.$route.params.idItem,
          idModule: this.$route.params.idModule,
          idRel: this.$store.getters["data_card/getCardRelId"],
        };
        this.$store.commit("data_card/setLoading", false);
        this.$store.commit("data_card/setReadOnly", false);
        await this.updatedFields(data);
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

    /** Непонятно зачем фукнция */
    async applyAction(evt) {
      const actionId = this.computedActionId;
      if (evt) evt.preventDefault();

      this.$store.commit("data_card/setError", false);
      this.$store.commit("data_card/setSavedError", false);
      this.$store.commit("data_card/setLoading", true);

      this.$store.commit("data_card/setIsActionApplyError", false);
      this.$store.commit("data_card/setIsActionFormDisabled", true);

      const response = await this.$store.dispatch("data_card/executeAction", {
        actionId,
        relActionId: this.action.REL,
        relId: this.relId,
        rowId: this.rowId,
        body: this.actionParams,
      });

      this.$store.commit("data_card/setLoading", false);
      this.$store.commit("data_card/setIsActionFormDisabled", false);

      if (response?.status === 500 || response?.status === 520) {
        if (this.action.LREQUESTCODE) {
          this.$store.commit("data_card/setIsActionApplyError", true);
          this.$store.commit("data_card/setactionApplyErrorMessage", getErrorMessage(response.data));
        } else {
          this.$store.commit("data_card/setSavedError", true);
          this.$store.commit("data_card/setErrorMessage", response.data);
        }
      }
      if (response?.status === 200) {
        this.$nextTick(() => {
          this.$bvModal.hide("confirmAction");
        });
        if (this.action?.SMESSAGE) {
          await this.$modal.alert(this.action?.SMESSAGE, {
            icon: "ok",
          });
        }
        if (this.$route.query?.ref && this.action?.LCLOSEAFTER) {
          this.goToLink(this.$route.query?.ref);
        }
        if (response.data.POUTVALUE) {
          if (response.data.POUTVALUE.includes("/")) {
            if (
              response.data.POUTVALUE.includes("cabinet") &&
              this.action?.LCURWINDOW !== false &&
              this.action?.NTYPE === 4
            ) {
              this.goToLink(response.data.POUTVALUE);
            } else {
              const url = response.data.POUTVALUE;
              if (url.includes("/file")) {
                const [, , , idReport, idCard] = url.split("/");
                await this.downloadFile(`/am/main/v2/report?idreport=${idReport}&id=${idCard}`);
              } else {
                //  Safari fix https://stackoverflow.com/questions/20696041/window-openurl-blank-not-working-on-imac-safari
                setTimeout(() => {
                  window.open(response.data.POUTVALUE, this.action?.LCURWINDOW ? "_self" : "_blank");
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
        if (this.action?.LREFRESH) {
          this.$store.commit("uploader/removeAllNewFiles", null);
          this.$store.commit("uploader/setFileErrors", []);
          await this.$store.dispatch("data_card/fetchForm", this.$route.params);
          await this.$store.dispatch("uploader/fetchData", {
            ...this.$route.params,
          });

          await this.refreshPage();
        }
        if (this.wizardTabs) {
          await this.$store.dispatch("wizard/fetchWizard", this.$route.params);
        }
        this.$store.commit("data_card/setLoading", false);
      }
    },

    goToLink(url) {
      if (this.$router) {
        this.$router.push(url);
      } else {
        window.location.reload(url);
      }
    },

    /** Окно подтверждения выполнения действия */
    confirmAction() {
      const titleVNode = this.action.SQUEST
        ? this.action.SQUEST
        : `Вы действительно хотите выполнить действие "${this.action.SNAME}"?`;

      return this.$bvModal.msgBoxConfirm(titleVNode, {
        id: "bv-confirm-modal",
        title: "Подтверждение выполнения действия",
        size: "md",
        buttonSize: "md",
        okVariant: "success",
        okTitle: "Да",
        cancelTitle: "Нет",
        footerClass: "p-2",
        hideHeaderClose: false,
        modalClass: ["cabinet"],
        centered: true,
      });
    },

    /**
     * Запрос к API на выполнение действия для blocks
     * @deprecated
     */
    async executeAction() {
      try {
        const result = await this.$store.dispatch("blocks/executeAction", {
          relId: this.cardData?.relId ?? this.relId,
          relActionId: this.action.REL,
          actionId: this.computedActionId,
          actionRefresh: this.action?.LREFRESH,
          rowId: this.cardData?.cardId ?? this.rowId,
          itemId: this.action.NITEM,
          body: this.body,
        });

        if (this.action?.LREFRESH) {
          this.$emit("update");
        } else {
          console.warn(
            `Для обновления данных необходимо поставить в пункте ${this.action.NITEM} опцию  "Обновлять после действия"`
          );
        }
        return result;
      } catch (err) {
        console.error(err);
        await this.$modal.alert({
          icon: "error",
          title: "Извините, произошла ошибка",
          msg: getErrorMessage(err.response.data.MESSAGE),
          btnOk: false,
        });
      }

      return null;
    },

    /** Скачивание файла по переданной ссылке */
    async downloadFile(url) {
      const actionId = this.computedActionId;
      this.$store.commit("data_card/setFetchingAction", {
        actionId,
        isFetching: true,
      });

      await this.$axios({
        url,
        method: "GET",
        responseType: "blob",
      })
        .then((resp) => {
          saveFileAxios(resp, !this.action?.LCURWINDOW);
        })
        .catch(() => {
          this.$modal.alert({
            title: "Извините, произошла ошибка",
            msg: "Не удалось скачать файл",
            icon: "error",
            btnOk: false,
          });
        })
        .finally(() => {
          this.$store.commit("data_card/setFetchingAction", {
            actionId,
            isFetching: false,
          });
        });
    },
  },

  computed: {
    componentId() {
      /**
       * @type {import('@/converters/dataform.types').Lk2Webfield}
       */
      const field = this.$attrs.data;
      return field ? field.webId : this.id || this.action.ID;
    },

    buttonText() {
      return this.getLabel || this.action.label;
    },

    defaultButtonClass() {
      return this.$attrs.data?.cssClass || this.$vnode.data.staticClass ? "" : "btn-secondary";
    },
    isSaveSuccess() {
      return this.$store.getters["data_card/getSaveSuccess"];
    },
    computedActionId() {
      return this.actionId ? Number(this.actionId) : Number(this.$attrs.data.name.replace("Item", ""));
    },
    actionParams() {
      return this.$store.getters["data_card/getActionParams"];
    },

    isDownloadControlButton() {
      return Boolean(this.$attrs.data?.isDownloadControl);
    },

    isActionWithPause() {
      if (this.action.NTYPE === ACTION_TYPE_RUN_WITH_PAUSE) {
        return true;
      }
      return false;
    },

    getLabel() {
      if (this.disablePeriod > 0) {
        const message = this.isActionWithPause
          ? `${this.action.SNAME} повторно (${this.disablePeriod} сек.)`
          : `${this.action.SNAME}  (${this.disablePeriod} сек.)`;
        return message;
      }
      return this.action.SNAME;
    },

    getSavedError() {
      return this.$store.getters["data_card/getSavedError"];
    },

    getFlatMenu() {
      return this.$store.getters["data_card/flatmenu"];
    },

    isLoading() {
      return this.isFetching;
    },
    isSaveButtonClicked() {
      return this.$store.getters["data_card/saveButtonClicked"];
    },
    isDisabled() {
      return this.isDownloadControlButton
        ? this.isFetching
        : this.disablePeriod > 0 || this.$attrs.data?.readonly || this.isLoading;
    },

    isFetching() {
      return this.$store.getters["data_card/isFetchingAction"](this.computedActionId);
    },

    relId() {
      // this.$route не виден в default props, поэтому через $attrs
      return (
        this.$props?.params?.idRel ??
        this.$attrs.relId ??
        this.$attrs["rel-id"] ??
        this.$route.params.idRel ??
        this.$route.query?.rel ??
        this.$store.getters["data_card/getFormParams"]?.idRel
      );
    },
    rowId() {
      // this.$route не виден в default props, поэтому через $attrs
      return (
        this.$props?.params?.idCard ??
        this.$attrs.rowId ??
        this.$attrs["row-id"] ??
        this.$route.params.idCard ??
        this.$store.getters["data_card/getFormParams"]?.idCard
      );
    },
    action: {
      get() {
        if (this.computedActionId) {
          const allActions = this.$store.getters["menu/flatmenu"].map((menu) => menu.ACTIONSCUR || []).flat();
          return allActions.find((action) => action.ID === this.computedActionId);
        }

        return this.$attrs.data;
      },
    },
  },
  watch: {
    isFetching() {
      if (
        this.isActionWithPause &&
        !this.isLoading &&
        (this.isSaveButtonClicked === true || this.getSavedError === false)
      ) {
        this.disablePeriod = DEFAULT_DISABLE_PERIOD;
        clearInterval(this.timerId);
        this.timerId = setInterval(() => {
          this.disablePeriod -= 1;

          if (this.disablePeriod <= 0) {
            clearInterval(this.timerId);
          }
        }, 1000);
      }
    },
    contextChanged() {
      this.startAction();
    },
  },
};
</script>

<style scoped>
.cancel {
  position: absolute;
  top: 41px;
  right: 121px;
}
</style>
