<template>
  <b-button
    v-if="action"
    @click.stop="action.LREQUESTCODE === true ? confirmAction() : startAction()"
    :variant="variant"
    :id="id"
  >
    <slot><div v-text="action.SNAME"></div></slot>
  </b-button>
</template>
<script>
import { BButton } from "bootstrap-vue";
import { getErrorMessage } from "../../../../plugins/auth/toast.helper";

import { fetchPoutvalue } from "../../../../utils/fetchPoutvalue";

export default {
  name: "ActionButton",
  components: {
    BButton,
  },
  props: {
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

  methods: {
    async startAction() {
      await eventHandler([], { actionId: this.actionId }, "actionClicked");

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
      return this.$bvModal.msgBoxConfirm(
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
      );
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
    rowId() {
      return this.$attrs["row-id"] ?? this.$route.params.idCard;
    },
    relId() {
      return this.$attrs["rel-id"] ?? this.$route.params.idRel;
    },
    action: {
      get() {
        const actions = this.$store.getters["menu/getMenuById"](
          this.$route.params.idItem
        ).ACTIONSCUR;
        const action = actions.find(
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
