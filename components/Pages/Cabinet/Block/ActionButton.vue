<template>
  <b-button
    v-if="action"
    @click.stop="
      action.LREQUESTCODE === true
        ? $bvModal.show(String(rowId))
        : startAction()
    "
  >
    <slot><div v-text="action.SNAME"></div></slot>
    <b-modal
      v-if="!action.LHIDEDLG"
      @close="$bvModal.hide(String(rowId))"
      modal-class="cabinet"
      :id="String(rowId)"
      @ok="executeAction"
      cancel-title="Нет"
      ok-title="Да"
      no-close-on-backdrop
      ok-only
    >
      {{
        insideContent !== ""
          ? insideContent
          : `Вы действительно хотите выполнить действие "${action.SNAME}"?`
      }}
      <b-button class="mt-3 cancel" block @click="$bvModal.hide(String(rowId))"
        >Нет</b-button
      >
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
    async executeAction() {
      try {
        console.log("Пытаюсь выполнить!");
        console.log("relId:", this.relId);
        console.log("relActionId:", this.action.REL);
        console.log("actionId:", this.actionId);
        console.log("rowId:", this.rowId);
        console.log("itemId:", this.action.NITEM);
        console.log("body:", this.body);
        console.log("начинаю вызывать экшн executeAction");
        await this.$store.dispatch("blocks/executeAction", {
          relId: this.relId,
          relActionId: this.action.REL,
          actionId: this.actionId,
          rowId: this.rowId,
          itemId: this.action.NITEM,
          body: this.body,
        });
        console.log("экшн executeAction вызван");
        if (this.getUrlAddress) {
          console.log("getUrlAdress:наличие");
          console.log(this.getUrlAddress);
        }
        if (!this.getUrlAddress) {
          console.log("getUrlAdress:отсутствие");
          console.log("id:", this.$route.params.idItem);
          console.log(
            JSON.stringify(this.$store.getters["blocks/getServerFilters"])
          );
          console.log("Вызываю метод fetchBlock");
          await this.$store.dispatch("blocks/fetchBlock", {
            id: this.$route.params.idItem,
            query: {
              filters: JSON.stringify(
                this.$store.getters["blocks/getServerFilters"]
              ),
            },
          });
          console.log("нет адреса,закончил");
        }
        this.$bvToast.toast("Успешно выполнено", {
          title: "",
          variant: "success",
          solid: true,
        });
      } catch (err) {
        console.log(err);
      }
      this.$emit("update");
      console.log("Должна произойти отмена записи к врачу");
    },
    async startAction() {
      if (this.action.NTYPE === 2) {
        if (this.action.SCONST) {
          this.$router.push(`/cabinet/55/0/${this.action.SCONST}`);
        }
      } else {
        if (this.action.LHIDEDLG) {
          await this.executeAction();
          if (this.getUrlAddress) {
            window.open(this.getUrlAddress, "_self");
          }
        } else {
          this.$bvModal.show(String(this.rowId));
        }
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
  top: 56px;
  right: 67px;
}
</style>
