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
import UploadContainer from "@/components/Pages/Cabinet/Upload/UploadPage.vue";
import ListRender from "./Block/ListRender.vue";

export default {
  name: "Fluid",
  components: {
    CardPage,
    PortalPage,
    WizardPage,
    FormPage,
    FilterBlock,
    UploadContainer,
    ListRender,
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
      if (settings.isUploader) {
        component = "UploadContainer";
      }
      return { page, ...settings, settings, component };
    },
  },
};
</script>

<style scoped></style>
