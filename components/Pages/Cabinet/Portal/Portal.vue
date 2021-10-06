<template>
  <client-only placeholder="Загрузка...">
    <div>
      <div v-show="isShowBlock">
        <filter-block propertyName="SPRODUCTNAME"></filter-block>
        <filter-block propertyName="ID" filterType="radiobutton"></filter-block>
        <v-runtime-template :template="templateData"></v-runtime-template>
      </div>
      <div v-if="!isShowBlock">
        <div style="text-align: center">
          <b-spinner class="m-5"></b-spinner>
        </div>
      </div>
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
import SkeletonBox from "~/components/Libs/SkeletonBox";
import FilterBlock from "../Block/FilterBlock.vue";

export default {
  name: "Wizard",
  components: {
    PortalList,
    NotifyBlock,
    OfferBlock,
    PolicyBlock,
    VRuntimeTemplate,
    ContentBlock,
    FilterBlock,
    ActionButton,
    OpenCardButton,
    PortalCard,
    FormPage,
    DeleteCardButton,
    SkeletonBox,
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
    isShowBlock: {
      get: function () {
        return (
          Boolean(this.$store.getters["blocks/getBlockById"](this.itemId)) ||
          this.params.settings.compType === 16
        );
      },
    },
  },
  methods: {
    refreshWizardList() {
      this.$store.dispatch("blocks/updateWizardBlock", {
        menuId: this.itemId,
        cardId: this.cardId,
      });
    },
  },
  destroyed() {
    this.$store.dispatch("blocks/clearBlock");
  },
};
</script>

<style scoped></style>
