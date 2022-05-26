<template>
  <div class="row">
    <div
      class="mt-3 buttons"
      :class="[
        isUseCardTemplate
          ? 'col-sm-12 col-md-12 col-lg-12 col-xl-9 col-12'
          : 'col-12',
      ]"
    >
      <b-button v-if="currentTab.order > 1" @click="goBack"> Назад </b-button>
      <div>
        <b-button
          v-if="currentTab.order != qty && $route.params.idCard != 0"
          :disabled="loading"
          variant="success"
          @click="saveCard"
        >
          {{ showBtnNameSave }}
          <b-spinner
            v-if="loading"
            style="width: 1rem; height: 1rem"
            class="ml-2"
            variant="danger"
            label="Spinning"
          />
        </b-button>
        <b-button
          v-if="currentTab.order != qty && $route.params.idCard != 0"
          :disabled="loading"
          variant="success"
          @click="goNext"
        >
          {{ showBtnNameContinue }}
          <b-spinner
            v-if="loading"
            style="width: 1rem; height: 1rem"
            class="ml-2"
            variant="danger"
            label="Spinning"
          />
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WizardButtons",
  props: ["currentTab", "tabs", "qty", "loading"],
  computed: {
    showBtnNameContinue() {
      const menu = this.$store.getters["menu/flatmenu"]?.find(
        (item) => item.IDITEM == this.currentTab.idItem
      );
      const formData = this.$store.getters["data_card/getForm"];
      const fields = formData.length ? formData : formData.data || [];
      const wizardButtonContinue = fields.find((item) => {
        if (item.type === "WizardButton" && item.name === "Continue") {
          return true;
        }
      });
      if (menu.ACTIONSCUR[0]?.NTYPE == 35) {
        return menu.ACTIONSCUR[0].SNAME;
      }
      return wizardButtonContinue?.label
        ? wizardButtonContinue.label
        : "Продолжить";
    },
    showBtnNameSave() {
      const formData = this.$store.getters["data_card/getForm"];
      const fields = formData.length ? formData : formData.data || [];
      console.log(fields);
      const wizardButtonSave = fields.find((item) => {
        if (item.type === "WizardButton" && item.name === "Save") {
          return true;
        }
      });
      return wizardButtonSave?.label ? wizardButtonSave.label : "Сохранить";
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
      const action = menu.ACTIONSCUR.find((item) => item.NTYPE == 35);
      if (action) {
        const response = await this.$store.dispatch("data_card/executeAction", {
          actionId: action.ID,
          relActionId: action.REL,
          relId: this.$route.params.idRel,
          rowId: this.$route.params.idCard,
        });
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

<style>
.buttons {
  display: flex;
  justify-content: space-between;
}
</style>
