<template>
  <div class="buttons">
    <b-button v-if="currentTab.order > 1" @click="goBack">Назад</b-button>
    <div></div>
    <b-button
      variant="success"
      v-if="currentTab.order != tabs.length"
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
  props: ["currentTab", "tabs"],
  methods: {
    goNext() {
      let index = this.currentTab.order;
      let tab = this.tabs[index];
      this.$emit("goNext", tab);
    },
    goBack() {
      let index = this.currentTab.order - 2;
      let tab = this.tabs[index];
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
