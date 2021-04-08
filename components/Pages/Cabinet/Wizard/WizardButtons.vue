<template>
  <div class="buttons">
    <b-button v-if="currentTab.order > 1" @click="goBack">Назад</b-button>
    <div></div>
    <b-button
      variant="success"
      v-if="currentTab.order != qty && $route.params.idCard != 0"
      @click="goNext"
    >
      {{ showBtnName }}
      <b-spinner
        v-if="false"
        style="width: 1rem; height: 1rem"
        class="ml-2"
        variant="danger"
        label="Spinning"
      ></b-spinner>
    </b-button>
  </div>
</template>

<script>
export default {
  name: "WizardButtons",
  props: ["currentTab", "tabs", "qty"],
  methods: {
    getCurrentIndex() {
      return this.tabs.findIndex(
        (item) => item.idItem == this.currentTab.idItem
      );
    },
    async goNext() {
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
          return;
        }
      }
      await this.$store.dispatch("wizard/fetchWizard", this.$route.params);
      let tab = this.tabs[this.getCurrentIndex() + 1];
      this.$emit("goNext", tab);
    },
    goBack() {
      let tab = this.tabs[this.getCurrentIndex() - 1];
      this.$emit("goBack", tab);
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
  },
};
</script>

<style>
.buttons {
  display: flex;
  justify-content: space-between;
}
</style>
