<template>
  <button
    type="button"
    :disabled="isLoading"
    :class="classStyle"
    :id="this.data.webId"
    @click="action"
  >
    {{ buttonName }}
  </button>
</template>

<script>
import menuSettings from "../../../converters/menuSettings";

export default {
  name: "ControlWizardButton",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      classStyle: "",
      classPosition: "",
    };
  },
  mounted() {
    if (this.data.name === "Back") {
      this.classStyle = "btn btn-secondary";
      this.classPosition = "col-auto";
    }
    if (this.data.name === "Continue") {
      this.classStyle = "btn btn-success";
      this.classPosition = "col-auto mt-3 mt-lg-0";
    }

    if (this.data.name === "Save") {
      this.classStyle = `btn btn-success ${this.data.cssClass ?? ""}`;
      this.classPosition = "col-auto mt-3 mt-lg-0";
    }
  },
  methods: {
    getCurrentIndex() {
      return this.tabs.findIndex(
        (item) => item.idItem == this.currentTab.idItem
      );
    },
    action() {
      // При возникновении ошибки валидации для components-vue2 CardEditor если фронт не пропускает далее
      // на запрос форму появляется лоудер и не пропадает. Перенёс признак установку статуса загрузки в методы
      // this.$store.commit("data_card/setLoading", true);
      if (this.data.name === "Continue") {
        this.goNext();
      }
      if (this.data.name === "Back") {
        this.goBack();
      }
      if (this.data.name === "Save") {
        this.saveCard();
      }
    },
    goBack() {
      if (this.$route) {
        this.$store.commit("data_card/setLoading", true);
        this.$store.commit("wizard/setWizardIsErrorActionExecute", false);
        const tab = this.tabs[this.getCurrentIndex() - 1];
        this.$emit("goBack", tab);
      } else {
        this.$emit("goBack", "Back");
      }
    },
    saveCard() {
      if (this.$route) {
        this.$store.commit("data_card/setLoading", true);
        this.$store.dispatch("wizard/isWizardButtonsLoading", true);
      }
      this.$emit("saveCard", "Save");
    },
    async goNext() {
      if (this.$route) {
        this.$store.commit("data_card/setLoading", true);
        this.$store.dispatch("wizard/isWizardButtonsLoading", true);
        this.$store.commit("wizard/setWizardIsErrorActionExecute", false);
        const menu = this.$store.getters["menu/flatmenu"].find(
          (item) => item.IDITEM == this.currentTab.idItem
        );
        const action = menu.ACTIONSCUR.find((item) => item.NTYPE == 35);
        if (action) {
          const response = await this.$store.dispatch(
            "data_card/executeAction",
            {
              actionId: action.ID,
              relActionId: action.REL,
              relId: this.$route?.params.idRel,
              rowId: this.$route?.params.idCard,
            }
          );
          if (response.status != 200) {
            this.$store.commit("wizard/setWizardIsErrorActionExecute", true);
            this.$store.commit(
              "wizard/setWizardErrorActionExecuteMessage",
              response.data
            );
            this.$store.dispatch("wizard/isWizardButtonsLoading", false);
            return;
          }
        }
        const tab = this.tabs[this.getCurrentIndex() + 1];
        this.$emit("goNext", tab);
      } else {
        this.$emit("goNext", "Next");
      }
    },
  },
  computed: {
    buttonName() {
      if (this.data.name === "Continue") {
        return this.data.label ?? "Продолжить";
      }
      if (this.data.name === "Back") {
        return this.data.label ?? "Назад";
      }
      if (this.data.name === "Save") {
        return this.data.label ?? "Сохранить";
      }
      return this.data.label ?? "";
    },
    isLoading() {
      return (
        this.$store.getters["wizard/getIsWizardButtonsLoading"] &&
        this.data.name !== "Back"
      );
    },
    settings: {
      get() {
        return menuSettings
          .getData(this.$store.getters["menu/menu"], {
            idModule: 55,
            idParent: 0,
            idItem: this.$route ? this.$route?.params.idWizard : null,
          })
          .slice(-1)
          .pop();
      },
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
    currentTab() {
      return this.tabs.find(
        (item) => item.idItem == this.$route?.params.idItem
      );
    },
  },
};
</script>
