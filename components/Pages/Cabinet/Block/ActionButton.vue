<template>
  <button
    v-if="action"
    @click.stop="startAction()"
    class="btn"
    :class="defaultButtonClass"
    :id="id"
    type="button"
    :disabled="isDisabled"
  >
    <slot><div v-text="getLabel || action.label"></div></slot>
    <b-spinner
      v-if="isLoading && isFetching"
      variant="success"
      label="Spinning"
    ></b-spinner>
  </button>
</template>
<script>
import { getErrorMessage } from "../../../../plugins/auth/toast.helper";
import { fetchPoutvalue } from "../../../../utils/fetchPoutvalue";
import { saveFileAxios } from "../../../../utils/saveFile";

const DEFAULT_DISABLE_PERIOD = 60;
export default {
  name: "ActionButton",
  components: {},
  props: {
    actionId: {
      type: String,
      required: true,
      default: () => null,
    },
    id: {
      type: String,
      required: false,
      default: () => null,
    },
    body: {
      type: Object | Array,
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
  },
  data() {
    return {
      disablePeriod: 0,
    };
  },

  methods: {
    async updatedFields(e, action = "") {
      const fields = this.$store.getters["data_card/getForm"];
      if (typeof eventHandler === "function") {
        const updatedFields = await eventHandler(
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
    async fetchAction(e) {
      const field = this.$attrs.data;
      this.$store.commit("data_card/setIsActionApplyError", false);
      const actionId = e.value.replace("Item", "");
      let moduleId;
      let cardId;
      if (!this.$attrs.params.page) {
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
      this.$store.commit("data_card/setActionParamsTitle", field.label);

      if (this.action.LREQUESTCODE) {
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
        this.$store.commit("data_card/setSaveSuccess", false);
        await this.updatedFields(e, "beforeSave");
        // Не понятно как вычислить этот параметр (step), поэтому захардкожен 0
        this.$emit("update", e);
        if (this.isSaveSuccess) {
          await this.updatedFields(e, "afterSave");
        }
        return;
      }
      if (CUR.NTYPE === 39) {
        this.$store.commit("data_card/setLoading", false);
        this.$store.commit("data_card/setReadOnly", false);
        await this.updatedFields(e);
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
    async applyAction(evt) {
      if (evt) evt.preventDefault();
      if (this.action.NTYPE === 2) {
        if (this.action.SCONST) {
          const redirectURL = this.$route.params.idCard
            ? `/cabinet/${this.$route.params.idModule}/0/${this.action.SCONST}/0/${this.$route.params.idCard}?ref=${this.$route.fullPath}`
            : `/cabinet/${this.$route.params.idModule}/0/${this.action.SCONST}/0?ref=${this.$route.fullPath}`;

          if (this.action.LCURWINDOW) {
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

      if (this.action.NTYPE === 3) {
        const requestDownLoadFileUrl = new URL(
          "/am/main/v2/report2",
          window.location.origin
        );

        requestDownLoadFileUrl.searchParams.set("id", rowId);
        requestDownLoadFileUrl.searchParams.set("rel", relId);
        requestDownLoadFileUrl.searchParams.set("idaction", this.action.ID);
        requestDownLoadFileUrl.searchParams.set("relaction", this.action.REL);
        await this.$axios({
          url: requestDownLoadFileUrl.href,
          method: "GET",
          responseType: "blob",
        })
          .then((resp) => {
            saveFileAxios(resp, !this.action?.LCURWINDOW);
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

      this.$store.commit("data_card/setIsActionApplyError", false);
      this.$store.commit("data_card/setIsActionFormDisabled", true);

      const response = await this.$store.dispatch("data_card/executeAction", {
        actionId: this.action.ID,
        relActionId: this.action.REL,
        relId,
        rowId,
        body: this.actionParams,
      });
      this.$store.commit("data_card/setIsActionFormDisabled", false);
      if (response?.status === 500 || response?.status === 520) {
        this.$store.commit("data_card/setLoading", false);
        if (this.action.LREQUESTCODE) {
          this.$store.commit("data_card/setisActionApplyError", true);
          this.$store.commit(
            "data_card/setactionApplyErrorMessage",
            getErrorMessage(response.data)
          );
        } else {
          this.$store.commit("data_card/setSavedError", true);
          this.$store.commit("data_card/setErrorMessage", response.data);
        }
      }
      if (response?.status === 200) {
        this.$nextTick(() => {
          this.$bvModal.hide("confirmAction");
        });
        if (this.$route.query?.ref && this.action?.LCLOSEAFTER) {
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
                    this.action?.LCURWINDOW ? "_self" : "_blank"
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
        if (this.action?.LREFRESH) {
          await this.$store.dispatch("data_card/fetchForm", this.$route.params);
        }
        if (this.wizardTabs) {
          await this.$store.dispatch("wizard/fetchWizard", this.$route.params);
        }
        this.$store.commit("data_card/setLoading", false);
      }
    },
    async startAction() {
      if (this.action.LREQUESTCODE) {
        this.confirmAction();
      }
      if (this.$attrs.data) {
        await this.updatedFields(this.$attrs.data, "actionClicked");
        const data = {
          fieldId: this.$attrs.data.fieldId,
          value: this.$attrs.data.name,
          action: this.$attrs.data.name.includes("Item"),
        };
        if (
          data.fieldId === 38389 ||
          data.fieldId === 36384 ||
          data.fieldId === 37111 ||
          data.fieldId === 36232
        ) {
          this.$emit("update", data);
          return;
        }
        const field = this.$attrs.data;
        if (field.type === "button") {
          this.$store.commit("data_card/setError", false);
          this.$store.commit("data_card/setSavedError", false);
        }
        if (field.type === "button" && data.action) {
          const actionId = Number(data.value.replace("Item", ""));
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
        if (field.type === "button") {
          await this.updatedFields(data);
        }
        this.$store.commit("data_card/setFormField", {
          fieldId: data.fieldId,
          name: data.name,
          value: data.value,
        });
        return;
      }
      await eventHandler([], { actionId: this.actionID }, "actionClicked");

      if (!this.action.LHIDEDLG) {
        const confirmResult = await this.confirmAction();
        if (!confirmResult) {
          return;
        }
      }

      if (this.action.NTYPE === 2) {
        if (this.action.SCONST) {
          const invalidRowID = this.rowId === null || this.rowId === undefined;
          if (invalidRowID) {
            const redirection = `/cabinet/55/0/${this.action.SCONST}/0?ref=${this.$route.fullPath}`;
            if (this.action.LCURWINDOW) {
              this.$router.push(redirection);
            } else {
              window.open(redirection);
            }
          }
          if (!invalidRowID) {
            const redirection = `/cabinet/55/0/${this.action.SCONST}/0/${this.rowId}?ref=${this.$route.fullPath}`;
            if (this.action.LCURWINDOW) {
              this.$router.push(redirection);
            } else {
              window.open(redirection);
            }
          }
        }
        return;
      }

      const actionResult = await this.executeAction();

      fetchPoutvalue(actionResult, {
        router: this.$router,
        isInNewWindow: !this.action.LCURWINDOW,
        toaster: this.$bvToast,
      });
    },

    confirmAction() {
      const titleVNode = this.action.SQUEST
        ? this.action.SQUEST
        : `Вы действительно хотите выполнить действие" ${this.action.SNAME}"?`;

      return this.$bvModal.msgBoxConfirm(titleVNode, {
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
    async executeAction() {
      try {
        const result = await this.$store.dispatch("blocks/executeAction", {
          relId: this.relId,
          relActionId: this.action.REL,
          actionId: this.actionID,
          actionRefresh: this.action?.LREFRESH,
          rowId: this.rowId,
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
        this.$bvToast.toast(getErrorMessage(err.response.data.MESSAGE), {
          title: "",
          variant: "danger",
          solid: true,
        });
      }

      return null;
    },
  },

  computed: {
    defaultButtonClass() {
      return this.$attrs.data?.cssClass || this.$vnode.data.staticClass
        ? ""
        : "btn-secondary";
    },
    isSaveSuccess() {
      return this.$store.getters["data_card/getSaveSuccess"];
    },
    actionID() {
      return this.actionId
        ? this.actionId
        : Number(this.$attrs.data.name.replace("Item", ""));
    },
    actionParams() {
      return this.$store.getters["data_card/getActionParams"];
    },

    isDownloadControlButton() {
      return Boolean(this.$attrs.data?.isDownloadControl);
    },

    isActionWithPause() {
      if (this.action.NTYPE == 56) {
        return true;
      }
      return false;
    },

    getLabel() {
      if (this.disablePeriod > 0) {
        return `${this.action.SNAME} (${this.disablePeriod} сек.)`;
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
      return this.isDownloadControlButton
        ? this.isFetching
        : this.$store.getters["data_card/getLoading"];
    },

    isDisabled() {
      return this.isDownloadControlButton
        ? this.isFetching
        : this.disablePeriod > 0 ||
            this.$attrs.data?.readonly ||
            this.isLoading;
    },

    isFetching() {
      return this.$store.getters["data_card/isFetchingAction"](this.actionID);
    },

    relId() {
      // this.$route не виден в default props, поэтому через $attrs
      return (
        this.$attrs.relId ?? this.$attrs["rel-id"] ?? this.$route.params.idRel
      );
    },
    rowId() {
      // this.$route не виден в default props, поэтому через $attrs
      return (
        this.$attrs.rowId ?? this.$attrs["row-id"] ?? this.$route.params.idCard
      );
    },
    action: {
      get() {
        if (this.actionID) {
          const allActions = this.$store.getters["menu/flatmenu"]
            .map((menu) => menu.ACTIONSCUR || [])
            .flat();
          return allActions.find(
            (action) => action.ID === parseInt(this.actionID, 10)
          );
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
        this.getSavedError === false
      ) {
        this.disablePeriod = DEFAULT_DISABLE_PERIOD;
        clearInterval(this.timerId);
        this.timerId = setInterval(() => {
          this.disablePeriod -= 1;
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

<style lang="scss">
/*[data-action-id="37309"]*/
.modal-dialog {
  .modal-header {
    padding: 0;
    border: 0;
    position: relative;
  }
  .modal-header .close {
    position: absolute;
    right: -1px;
    top: 0px;
  }
  .modal-header:before,
  .modal-title {
    display: none;
  }
  .modal-footer {
    border-top: 0;
    margin-top: 1rem;
    padding-bottom: 0;
    padding-right: 0;
  }
}
</style>
