<template>
  <b-button
    v-if="action"
    @click="
      action.LREQUESTCODE === true
        ? $bvModal.show(String(rowId))
        : startAction()
    "
  >
    <slot><div v-text="action.SNAME"></div></slot>
    <b-modal
      modal-class="cabinet"
      v-if="action.LREQUESTCODE === true"
      :id="String(rowId)"
      @ok="startAction"
      cancel-title="Нет"
      ok-title="Да"
    >
      {{
        insideContent !== ""
          ? insideContent
          : `Вы действительно хотите выполнить действие "${action.SNAME}"?`
      }}
    </b-modal>
  </b-button>
</template>

<script>
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
    rowId: {
      type: Number,
      required: false,
      default: () => 0,
    },
    body: {
      type: Object,
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
  },

  methods: {
    async startAction() {
      try {
        if (this.action.NTYPE === 2) {
          if (this.action.SCONST) {
            this.$router.push(`/cabinet/55/0/${this.action.SCONST}`);
          }
        } else {
          await this.$store.dispatch("blocks/executeAction", {
            relId: this.relId,
            relActionId: this.action.REL,
            actionId: this.actionId,
            rowId: this.rowId,
            itemId: this.action.NITEM,
            body: this.body,
          });
          if (this.getUrlAddress) {
            window.open(this.getUrlAddress, "_self");
          }
        }
      } catch (err) {
        this.$bvToast.toast(err.response.data.MESSAGE, {
          title: "Ошибка",
          variant: "danger",
          noAutoHide: true,
          solid: true,
        });
      }
    },
  },

  computed: {
    action: {
      get: function () {
        const action = this.actions.find(
          (a) => a.ID === parseInt(this.actionId)
        );
        return action || null;
      },
    },

    getUrlAddress() {
      const resultUrl = this.$store.getters["blocks/getUrl"];
      return resultUrl;
    },
  },
};
</script>

<style scoped></style>
