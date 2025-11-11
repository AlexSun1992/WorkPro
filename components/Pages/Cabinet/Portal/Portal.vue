<template>
  <client-only placeholder="Загрузка...">
    <div>
      <div v-if="isShowBlock">
        <v-runtime-template
          :template="templateData"
          :params="params"
        />
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
import VRuntimeTemplate from "@/components/Libs/RuntimeTemplate/v-runtime-template";
import PortalList from "./PortalList";
import PortalCard from "./PortalCard";
import NotifyBlock from "../Block/NotifyBlock";
import OfferBlock from "../Block/OfferBlock";
import PolicyBlock from "../Block/PolicyBlock";
import ContentBlock from "../Block/ContentBlock";
import DownloadFile from "../Block/DownloadFile";
import ActionButton from "../Block/ActionButton";
import AddToCalendarButton from "../Block/AddToCalendarButton";
import FormPage from "~/components/Pages/FormPage";
import OpenCardButton from "../Block/OpenCardButton";
import DeleteCardButton from "../Block/DeleteCardButton";
import SkeletonBox from "~/components/Libs/SkeletonBox";
import FilterBlock from "../Block/FilterBlock/FilterBlock";
import SearchBlock from "../Block/FilterBlock/SearchBlock";
import OfficeMap from "../Block/OfficeMap";
import ControlMap from "@/components/Libs/Controls/ControlMap/ControlMap";
import ControlYMap from "@/components/Libs/Controls/ControlMap/ControlYMap";
import ServerFilterBlock from "../Block/ServerFilterBlock/ServerFilterBlock";
import BrandLoader from "@/components/Libs/Controls/ControlBrandLoader/BrandLoader";
import Grid from "@/components/Libs/Table/Grid";
import ControlToggle from "@/components/Libs/Controls/ControlToggle";
import ControlCollapse from "@/components/Libs/Controls/ControlCollapse";
import ModalBox from "../Block/ModalBox";
import ControlSlider from "@/components/Libs/Controls/ControlSlider/ControlSlider";
import ControlCardList from "@/components/Libs/Controls/ControlCardList/CardList";
import MapList from "@/components/Libs/Controls/ControlSelectObjectFromMap/MapList";

import InsuranceCase from "../../../Libs/InsuranceCase";

export default {
  name: "Portal",
  components: {
    /* eslint-disable vue/no-unused-components */
    BrandLoader,
    ModalBox,
    PortalList,
    NotifyBlock,
    OfferBlock,
    PolicyBlock,
    InsuranceCase,
    VRuntimeTemplate,
    ContentBlock,
    DownloadFile,
    FilterBlock,
    SearchBlock,
    OfficeMap,
    AddToCalendarButton,
    ActionButton,
    OpenCardButton,
    PortalCard,
    FormPage,
    DeleteCardButton,
    SkeletonBox,
    ControlMap,
    ControlYMap,
    ServerFilterBlock,
    Grid,
    ControlToggle,
    ControlCollapse,
    ControlSlider,
    ControlCardList,
    MapList,
  },
  props: {
    params: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  mounted() {
    if (!this.$route.params.idCard) {
      this.$store.dispatch("blocks/fetchBlock", {
        id: this.itemId,
        query: { ...this.$route.query },
        ...this.$route.params,
      });
    }
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
    dataContent: {
      get() {
        const block = this.$store.getters["blocks/getBlockById"](this.itemId);
        if (block) {
          return block.data;
        }
        return {};
      },
    },
    list() {
      return this.dataContent;
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
        if (!this.$route.params?.idCard) {
          return (
            Boolean(this.$store.getters["blocks/getBlockById"](this.itemId)) || this.params.settings.compType === 16
          );
        }
        return true;
      },
    },
    actions: {
      get() {
        return this.$store.getters["menu/getMenuById"](this.itemId).ACTIONSCUR;
      },
    },
  },
  methods: {
    getVisible(property) {
      if (this.list?.items && property) {
        const visible = this.list?.items.find((item) => item[property] !== undefined);
        if (visible) {
          if (visible[property] === true) {
            return true;
          }
          if (visible[property] === false) {
            return false;
          }
        }
      }
      console.warn(`В методе getVisible свойство ${property}  не сущесвует или задано неверно.`);
      return null;
    },
    getAddField(property) {
      const addFields = this.dataContent?.addFields;
      if (addFields) {
        if (addFields[property]) {
          return addFields[property];
        }
        console.warn(
          `В методе getAddField свойство ${property}  не сущесвует или задано неверно. Доступные свойства: ${JSON.stringify(
            addFields
          )}`
        );
      }
      return "";
    },
    getParsedAddField(property) {
      try {
        return JSON.parse(this.getAddField(property));
      } catch (e) {
        console.error(`Ошибка при парсинге поля addField, ошибка: ${e}`);
      }
      return "";
    },
    updateBlock() {
      this.$store.dispatch("blocks/updateBlock", this.itemId);
    },
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
