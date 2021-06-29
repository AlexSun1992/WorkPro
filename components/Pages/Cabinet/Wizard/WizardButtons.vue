<template>
  <div class="row">
    <div
      class="mt-3 buttons"
      :class="[
        isUseCardTemplate
          ? 'col-sm-12 col-md-12 col-lg-12 col-xl-9 col-12'
          : 'col-12',
        { 'btn-right': currentTab.order === 1 },
      ]"
    >
      <b-button v-if="currentTab.order > 1" @click="goBack">Назад</b-button>
      <div>
        <b-button
          :disabled="loading"
          variant="success"
          v-if="currentTab.order != qty && $route.params.idCard != 0"
          @click="saveCard"
        >
          Сохранить
          <b-spinner
            v-if="loading"
            style="width: 1rem; height: 1rem"
            class="ml-2"
            variant="danger"
            label="Spinning"
          ></b-spinner>
        </b-button>
        <b-button
          :disabled="loading"
          variant="success"
          v-if="currentTab.order != qty && $route.params.idCard != 0"
          @click="goNext"
        >
          {{ showBtnName }}
          <b-spinner
            v-if="loading"
            style="width: 1rem; height: 1rem"
            class="ml-2"
            variant="danger"
            label="Spinning"
          ></b-spinner>
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getErrorMessage } from "@/utils/transform";
export default {
  name: "WizardButtons",
  props: ["currentTab", "tabs", "qty", "loading"],
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
      let action = menu.ACTIONSCUR.find((item) => item.NTYPE == 35);
      if (action) {
        let response = await this.$store.dispatch("data_card/executeAction", {
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
      let tab = this.tabs[this.getCurrentIndex() + 1];
      this.$emit("goNext", tab);
    },
    goBack() {
      this.$store.commit("wizard/setWizardIsErrorActionExecute", false);
      let tab = this.tabs[this.getCurrentIndex() - 1];
      this.$emit("goBack", tab);
    },
    saveCard() {
      this.$parent.loading = true;
      this.$emit("saveCard");
    },
  },
  computed: {
    showBtnName() {
      const menu = this.$store.getters["menu/flatmenu"].find(
        (item) => item.IDITEM == this.currentTab.idItem
      );
      if (menu.ACTIONSCUR[0]?.NTYPE == 35) {
        return menu.ACTIONSCUR[0].SNAME;
      } else {
        return "Продолжить";
      }
    },
    // loading() {
    //   return this.$store.getters["data_card/getLoading"];
    // },
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
};
</script>

<style>
.buttons {
  display: flex;
  justify-content: space-between;
}
</style>
