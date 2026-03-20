<template>
  <div class="mt-2 buttons row">
    <div
      class="col-12 col-lg-auto mt-3"
      v-if="currentTab && currentTab.order > 1 && btnBackVisible"
    >
      <button
        :id="idBtnBack"
        v-if="btnBackVisible"
        type="button"
        class="btn btn-secondary"
        @click="goBack"
      >
        {{ showBtnNameBack }}
      </button>
    </div>
    <div
      class="col-12 col-lg-auto mt-3"
      v-if="$route.params.idCard != 0 && showBtnVisibleSave"
    >
      <button
        :id="idBtnSave"
        type="button"
        v-if="showBtnVisibleSave"
        :class="showBtnStyleSave"
        :disabled="loading"
        class="btn btn-success"
        @click="saveCard"
      >
        {{ showBtnNameSave }}
      </button>
    </div>
    <div
      class="col-12 col-lg-auto mt-3"
      v-if="showButton && showBtnVisibleContinue"
    >
      <button
        :id="idBtnContinue"
        type="button"
        v-if="showBtnVisibleContinue"
        :class="showBtnStyleContinue"
        :disabled="loading"
        class="btn btn-success"
        @click="goNext"
      >
        {{ showBtnNameContinue }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "WizardButtons",
  props: ["currentTab", "tabs", "qty", "loading"],
  computed: {
    showButton() {
      return this.currentTab?.order != this.qty && this.$route?.params.idCard != 0;
    },
    btnContinue() {
      const formData = this.$store.getters["data_card/getForm"];
      const fields = formData.length ? formData : formData.data || [];
      const wizardButtonContinue = fields.find((item) => item.type === "WizardButton" && item.name === "Continue");
      return wizardButtonContinue;
    },
    showBtnNameContinue() {
      const menu = this.$store.getters["menu/flatmenu"]?.find((item) => item.IDITEM == this.currentTab?.idItem);

      if (menu?.ACTIONSCUR[0]?.NTYPE == 35) {
        return menu.ACTIONSCUR[0].SNAME;
      }

      return this.btnContinue?.label ?? "Продолжить";
    },
    showBtnStyleContinue() {
      return this.btnContinue?.cssClass ?? "";
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
      return fields.find((item) => item.type === "WizardButton" && item.name === "Save");
    },

    btnBack() {
      const formData = this.$store.getters["data_card/getForm"];
      const fields = formData.length ? formData : formData.data || [];
      return fields.find((item) => item.type === "WizardButton" && item.name === "Back");
    },

    btnBackVisible() {
      return this.btnBack?.visible === true;
    },

    showBtnNameBack() {
      return this.btnBack?.label ?? "Назад";
    },
    idBtnSave() {
      return this.btnSave?.fieldId || "wizard-btn-save";
    },
    idBtnBack() {
      return this.btnBack?.fieldId || "wizard-btn-back";
    },
    idBtnContinue() {
      return this.btnContinue?.fieldId || "wizard-btn-continue";
    },

    showBtnNameSave() {
      return this.btnSave?.label ?? "Сохранить";
    },
    showBtnStyleSave() {
      return this.btnSave?.cssClass ?? "";
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
  },
  methods: {
    getCurrentIndex() {
      return this.tabs.findIndex((item) => item.idItem == this.currentTab?.idItem);
    },
    async goNext() {
      this.$store.commit("data_card/setLoading", true);
      this.$store.commit("wizard/setWizardIsErrorActionExecute", false);
      const menu = this.$store.getters["menu/flatmenu"].find((item) => item.IDITEM == this.currentTab?.idItem);
      const action = menu?.ACTIONSCUR.find((item) => item.NTYPE == 35);
      if (action) {
        const response = await this.$store.dispatch("data_card/executeAction", {
          actionId: action.ID,
          relActionId: action.REL,
          relId: this.$route.params.idRel,
          rowId: this.$route.params.idCard,
        });
        if (response.status != 200) {
          this.$store.commit("wizard/setWizardIsErrorActionExecute", true);
          this.$store.commit("wizard/setWizardErrorActionExecuteMessage", response.data);
          return;
        }
      }
      await this.$store.dispatch("wizard/fetchWizard", this.$route.params);
      const tab = this.tabs[this.getCurrentIndex() + 1];
      this.$emit("goNext", tab);
    },
    goBack() {
      this.$store.commit("data_card/setLoading", true);
      this.$store.commit("wizard/setWizardIsErrorActionExecute", false);
      const tab = this.tabs[this.getCurrentIndex() - 1];
      this.$emit("goBack", tab);
    },
    saveCard() {
      this.$store.commit("data_card/setLoading", true);
      this.$emit("saveCard");
    },
  },
};
</script>
