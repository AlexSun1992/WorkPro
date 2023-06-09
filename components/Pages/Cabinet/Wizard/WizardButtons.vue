<template>
  <div class="mt-4 buttons row">
    <div class="col-auto" v-if="currentTab.order > 1">
      <b-button @click="goBack"> Назад </b-button>
    </div>
    <div
      class="col-auto"
      v-if="currentTab.order != qty && $route.params.idCard != 0"
    >
      <b-button
        v-if="showBtnVisibleSave"
        :class="showBtnStyleSave"
        :disabled="loading"
        variant="success"
        @click="saveCard"
      >
        {{ showBtnNameSave }}
        <b-spinner v-if="loading" variant="danger" label="Spinning" />
      </b-button>
    </div>
    <div
      class="col-auto"
      v-if="currentTab.order != qty && $route.params.idCard != 0"
    >
      <b-button
        v-if="showBtnVisibleContinue"
        :class="showBtnStyleContinue"
        :disabled="loading"
        variant="success"
        @click="goNext"
      >
        {{ showBtnNameContinue }}
        <b-spinner v-if="loading" variant="danger" label="Spinning" />
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "WizardButtons",
  props: ["currentTab", "tabs", "qty", "loading"],
  computed: {
    btnContinue() {
      const formData = this.$store.getters["data_card/getForm"];
      const fields = formData.length ? formData : formData.data || [];
      const wizardButtonContinue = fields.find(
        (item) => item.type === "WizardButton" && item.name === "Continue"
      );
      return wizardButtonContinue;
    },
    showBtnNameContinue() {
      const menu = this.$store.getters["menu/flatmenu"]?.find(
        (item) => item.IDITEM == this.currentTab.idItem
      );
      if (menu.ACTIONSCUR[0]?.NTYPE == 35) {
        return menu.ACTIONSCUR[0].SNAME;
      }
      return this.btnContinue?.label ?? "Продолжить";
    },
    showBtnStyleContinue() {
      return this.btnContinue?.labelCols ?? "";
    },
    showBtnVisibleContinue() {
      if (this.btnContinue) {
        return this.btnContinue.visible;
      }
      return true;
    },
    btnSave() {
      const formData = this.$store.getters["data_card/getForm"];
      const fields = formData.length ? formData : formData.data || [];
      const wizardButtonSave = fields.find((item) => {
        if (item.type === "WizardButton" && item.name === "Save") {
          return true;
        }
      });
      return wizardButtonSave;
    },
    showBtnNameSave() {
      return this.btnSave?.label ?? "Сохранить";
    },
    showBtnStyleSave() {
      return this.btnSave?.labelCols ?? "";
    },
    showBtnVisibleSave() {
      if (this.btnSave) {
        return this.btnSave.visible;
      }
      return true;
    },
    isError() {
      return this.$store.getters["data_card/getError"];
    },
    isUseCardTemplate() {
      return Boolean(
        this.$store.getters["menu/getMenuById"](this.$route.params.idItem)
          ?.SVJCARDTEMPLATE && !this.$store.getters[`data_card/getForm`]?.data
      );
    },
  },
  methods: {
    getCurrentIndex() {
      return this.tabs.findIndex(
        (item) => item.idItem == this.currentTab.idItem
      );
    },
    async goNext() {
      this.$parent.loading = true;
      this.$store.commit("wizard/setWizardIsErrorActionExecute", false);
      const menu = this.$store.getters["menu/flatmenu"].find(
        (item) => item.IDITEM == this.currentTab.idItem
      );
      console.log(menu, "menuWizard");
      const action = menu.ACTIONSCUR.find((item) => item.NTYPE == 35);
      if (action) {
        const response = await this.$store.dispatch("data_card/executeAction", {
          actionId: action.ID,
          relActionId: action.REL,
          relId: this.$route.params.idRel,
          rowId: this.$route.params.idCard,
        });
        console.log(response, "response");
        if (response.status != 200) {
          this.$store.commit("wizard/setWizardIsErrorActionExecute", true);
          this.$store.commit(
            "wizard/setWizardErrorActionExecuteMessage",
            response.data
          );
          this.$parent.loading = false;
          return;
        }
      }
      await this.$store.dispatch("wizard/fetchWizard", this.$route.params);
      const tab = this.tabs[this.getCurrentIndex() + 1];
      console.log(tab, "tab");
      this.$emit("goNext", tab);
    },
    goBack() {
      this.$store.commit("wizard/setWizardIsErrorActionExecute", false);
      const tab = this.tabs[this.getCurrentIndex() - 1];
      this.$emit("goBack", tab);
    },
    saveCard() {
      this.$parent.loading = true;
      this.$emit("saveCard");
    },
  },
};
</script>

<style></style>
