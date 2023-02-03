<template>
  <b-button
    v-if="action"
    @click.stop="action.LREQUESTCODE === true ? confirmAction() : startAction()"
    :variant="variant"
  >
    <slot><div v-text="action.SNAME"></div></slot>
  </b-button>
</template>

<script>
import { getErrorMessage } from "../../../../plugins/auth/toast.helper";
export default {
  name: "ActionButton",
  props: {
    actions: {
      type: Array,
      required: true,
      default: () => [],
    },
    actionId: {
      type: String,
      required: true,
      default: () => null,
    },
    variant: {
      type: String,
      required: false,
      default: () => null,
    },
    rowId: {
      type: Number | String,
      required: false,
      default: () => null,
    },
    body: {
      type: Object | Array,
      required: false,
    },
    relId: {
      type: String,
      required: false,
      default: () => "",
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

  methods: {
    confirmAction() {
      this.$bvModal
        .msgBoxConfirm(
          `Вы действительно хотите выполнить действие" ${this.action.SNAME}"?`,
          {
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
          }
        )
        .then((value) => {
          if (value) {
            this.executeAction();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async executeAction() {
      try {
        const result = await this.$store.dispatch("blocks/executeAction", {
          relId: this.relId,
          relActionId: this.action.REL,
          actionId: this.actionId,
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
        this.$bvToast.toast("Успешно выполнено", {
          title: "",
          variant: "success",
          solid: true,
        });
        return result;
      } catch (err) {
        console.log(err.response);
        getErrorMessage(err.response.data.MESSAGE);
        this.$bvToast.toast(getErrorMessage(err.response.data.MESSAGE), {
          title: "",
          variant: "danger",
          solid: true,
        });
      }
      return null;
    },
    async startAction() {
      if (this.action.NTYPE === 2) {
        if (this.action.SCONST) {
          this.$router.push(
            `/cabinet/55/0/${this.action.SCONST}/0/${this.rowId}`
          );
        }
      } else if (this.action.LHIDEDLG) {
        const result = await this.executeAction();
        if (result?.POUTVALUE) {
          if (result?.POUTVALUE.includes("/")) {
            if (result?.POUTVALUE.includes("cabinet")) {
              this.$router.push(
                `${new URL(result?.POUTVALUE).pathname}?ref=${
                  this.$route.fullPath
                }`
              );
            } else {
              // Safari fix https://stackoverflow.com/questions/20696041/window-openurl-blank-not-working-on-imac-safari
              setTimeout(() => {
                window.open(
                  result.POUTVALUE,
                  this.action.LCURWINDOW ? "_self" : "_blank"
                );
              });
            }
          }
        }
      } else {
        this.confirmAction();
      }
    },
  },
  computed: {
    action: {
      get() {
        const action = this.actions.find(
          (a) => a.ID === parseInt(this.actionId, 10)
        );
        return action || null;
      },
    },
  },
  watch: {
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
