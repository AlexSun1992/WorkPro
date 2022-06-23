<template>
  <client-only placeholder="Загрузка...">
    <div>
      <div v-show="isShowBlock">
        <v-runtime-template :template="templateData" :params="params" />
      </div>
      <div v-if="!isShowBlock">
        <div style="text-align: center">
          <b-spinner class="m-5" />
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import VRuntimeTemplate from "v-runtime-template";
import PortalList from "./PortalList";
import PortalCard from "./PortalCard";
import NotifyBlock from "../Block/NotifyBlock";
import OfferBlock from "../Block/OfferBlock";
import PolicyBlock from "../Block/PolicyBlock";
import ContentBlock from "../Block/ContentBlock";
import ActionButton from "../Block/ActionButton";
import AddToCalendarButton from "../Block/AddToCalendarButton.vue";
import FormPage from "~/components/Pages/FormPage";
import OpenCardButton from "../Block/OpenCardButton";
import DeleteCardButton from "../Block/DeleteCardButton";
import SkeletonBox from "~/components/Libs/SkeletonBox";
import FilterBlock from "../Block/FilterBlock/FilterBlock.vue";
import ObjectsOnMap from "~/components/Libs/ObjectsOnMap/ObjectsOnMap";
import ControlMap from "~/components/Libs/Controls/ControlMap";
import ServerFilterBlock from "../Block/ServerFilterBlock.vue";
import Grid from "../../../Libs/Table/Grid.vue";

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
    AddToCalendarButton,
    ActionButton,
    OpenCardButton,
    PortalCard,
    FormPage,
    DeleteCardButton,
    SkeletonBox,
    ObjectsOnMap,
    ControlMap,
    ServerFilterBlock,
    Grid,
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
    filters() {
      return this.$store.getters["blocks/getFilters"];
    },
    isForm: {
      get() {
        return this.$store.getters["blocks/getForm"]?.length;
      },
    },
    isEdit: {
      get() {
        return this.params.settings.edit;
      },
    },
    isEmptyContent: {
      get() {
        const block = this.$store.getters["blocks/getBlockById"](this.itemId);
        if (block) {
          return !block.data.items.length;
        }
        return false;
      },
    },
    isShowBlock: {
      get() {
        return (
          Boolean(this.$store.getters["blocks/getBlockById"](this.itemId)) ||
          this.params.settings.compType === 16
        );
      },
    },
    actions: {
      get() {
        return this.$store.getters["menu/getMenuById"](this.itemId).ACTIONSCUR;
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
};
</script>

<style scoped></style>
