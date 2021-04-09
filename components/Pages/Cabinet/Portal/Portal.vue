<template>
  <client-only placeholder="Загрузка...">
    <div>
      <v-runtime-template :template="templateData"></v-runtime-template>
    </div>
  </client-only>
</template>

<script>
import PortalList from "./PortalList";
import PortalCard from "./PortalCard";
import NotifyBlock from "../Block/NotifyBlock";
import OfferBlock from "../Block/OfferBlock";
import PolicyBlock from "../Block/PolicyBlock";
import ContentBlock from "../Block/ContentBlock";
import ActionButton from "../Block/ActionButton";
import FormPage from "~/components/Pages/FormPage";
import OpenCardButton from "../Block/OpenCardButton";
import VRuntimeTemplate from "v-runtime-template";
import DeleteCardButton from "../Block/DeleteCardButton";

export default {
  name: "Wizard",
  components: {
    PortalList,
    NotifyBlock,
    OfferBlock,
    PolicyBlock,
    VRuntimeTemplate,
    ContentBlock,
    ActionButton,
    OpenCardButton,
    PortalCard,
    FormPage,
    DeleteCardButton,
  },
  props: {
    params: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      card: null,
      list: null,
    };
  },
  computed: {
    name() {
      return this.params.settings.text;
    },
    wizardData() {
      return this.params.settings.wizard;
    },
    moduleId() {
      return this.params.page.idModule;
    },
    itemId() {
      return this.params.page.idItem;
    },
    cardId() {
      return this.$route.params.idCard;
    },
    templateData() {
      return this.params.settings.portalgrid || this.params.settings.cardgrid;
    },
    templateCardData() {
      return this.$store.getters["menu/getMenuById"](
        this.$store.getters["blocks/blockId"]
      )?.SVJCARDTEMPLATE;
    },
    isForm: {
      get: function () {
        return this.$store.getters["blocks/getForm"]?.length;
      },
    },
    isEdit: {
      get: function () {
        return this.params.settings.edit;
      },
    },
    isEmptyContent: {
      get: function () {
        const block = this.$store.getters["blocks/getBlockById"](this.itemId);
        if (block) {
          return !block.data.items.length;
        } else {
          return false;
        }
      },
    },
  },
  methods: {
    refreshWizardList() {
      this.$store.dispatch("blocks/updateWizardBlock", {
        itemId: this.itemId,
        cardId: this.cardId,
      });
    },
  },
};
</script>

<style scoped></style>
