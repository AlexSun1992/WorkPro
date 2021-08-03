<template>
  <div>
    <component v-bind:is="params.component" :params="params"></component>
  </div>
</template>

<script>
import CardPage from "~/components/Pages/Cabinet/Card/Card";
import PortalPage from "@/components/Pages/Cabinet/Portal/Portal";
import WizardPage from "@/components/Pages/Cabinet/Wizard/Wizard";
import FormPage from "~/components/Pages/FormPage";
export default {
  name: "Fluid",
  components: { CardPage, PortalPage, WizardPage, FormPage },
  computed: {
    params() {
      const page = this.$route.params;
      const settings = this.$store.getters["menu/breadcrumbs"].slice(-1).pop();
      let component = "CardPage";
      if (settings.isCard) {
        component = "CardPage";
      }
      if (settings.isForm) {
        component = "FormPage";
      }
      if (settings.isPortal) {
        component = "PortalPage";
      }
      if (settings.isWizard) {
        component = "CardPage";
      }

      return { page, settings, component };
    },
  },

  beforeRouteUpdate(to, from, next) {
    const cardChanged = this.$store.getters["data_card/cardChanged"];
    const saveButtonClicked
      this.$store.getters["data_card/saveButtonClicked"];
    if (cardChanged) {
      const confirmed = window.confirm("Закрыть без сохранения данных?");
      if (confirmed) {
        next();
      }
    } else {
      next();
    }
  },

  async beforeRouteLeave(to, from, next) {
    const cardChanged = this.$store.getters["data_card/cardChanged"];
    const saveButtonClicked =
      this.$store.getters["data_card/saveButtonClicked"];
    if (to.meta !== "Cabinet") {
      await this.$store.dispatch(
        "pages/fetchPageByUrl",
        to.path === "/" ? "index" : to.path
      );
    }
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
