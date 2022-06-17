<template>
  <div>
    <component :is="params.component" :params="params" />
  </div>
</template>

<script>
import PortalPage from "@/components/Pages/Cabinet/Portal/Portal";
import WizardPage from "@/components/Pages/Cabinet/Wizard/Wizard";
import CardPage from "~/components/Pages/Cabinet/Card/Card";
import FormPage from "~/components/Pages/FormPage";
import FilterBlock from "./Block/FilterBlock/FilterBlock.vue";

export default {
  name: "Fluid",
  components: {
    CardPage,
    PortalPage,
    WizardPage,
    FormPage,
    FilterBlock,
  },

  beforeRouteUpdate(to, from, next) {
    const cardChanged = this.$store.getters["data_card/cardChanged"];
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
};
</script>

<style scoped></style>
