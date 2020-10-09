<template>
  <div>
    <component v-bind:is="params.component" :params="params"></component>
  </div>
</template>

<script>
import Card from "~/components/Pages/Cabinet/Card/Card";
import Wizard from "~/components/Pages/Cabinet/Wizard/Wizard";
import FormPage from "~/components/Pages/FormPage";
export default {
  name: "Fluid",
  components: { Card, Wizard, FormPage },
  computed: {
    params() {
      const page = this.$route.params;
      const settings = this.$store.getters["menu/breadcrumbs"].slice(-1).pop();
      let component;

      if (settings.isCard) {
        component = "Card";
      } else if (settings.isForm) {
        component = "FormPage";
      } else {
        component = "Wizard";
      }
      return { page, settings, component };
    },
  },

  beforeRouteUpdate(to, from, next) {
    const cardChanged = this.$store.getters["data_card/cardChanged"];
    const saveButtonClicked = this.$store.getters[
      "data_card/saveButtonClicked"
    ];
    if (cardChanged) {
      const confirmed = window.confirm("Закрыть без сохранения данных?");
      if (confirmed) {
        next();
      }
    } else {
      next();
    }
  },
  beforeRouteLeave(to, from, next) {
    const cardChanged = this.$store.getters["data_card/cardChanged"];
    const saveButtonClicked = this.$store.getters[
      "data_card/saveButtonClicked"
    ];
    if (cardChanged) {
      const confirmed = window.confirm("Закрыть без сохранения данных?");
      if (confirmed) {
        next();
      }
    } else {
      next();
    }
  },
};
</script>

<style scoped></style>
