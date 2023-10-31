<template>
  <div>
    <div v-if="isShowBlock">
      <v-runtime-template :template="templateData"></v-runtime-template>
    </div>
    <div v-if="!isShowBlock">
      <div class="card bg-six block-border-one block">
        <SkeletonBox class="mt-5" :items="8"></SkeletonBox>
      </div>
    </div>
  </div>
</template>

<script>
import VRuntimeTemplate from "v-runtime-template";
import ContentBlock from "./ContentBlock";
import ActionButton from "./ActionButton";
import ModalBox from "../Block/ModalBox.vue";
import OpenCardButton from "../Block/OpenCardButton";
import DeleteCardButton from "../Block/DeleteCardButton";
import SkeletonBox from "~/components/Libs/SkeletonBox";

export default {
  name: "NotifyBlock",
  components: {
    ModalBox,
    ContentBlock,
    VRuntimeTemplate,
    ActionButton,
    OpenCardButton,
    DeleteCardButton,
    SkeletonBox,
  },
  props: {
    moduleId: {
      type: String,
      required: true,
      default: () => "",
    },
    itemId: {
      type: String,
      required: true,
      default: () => null,
    },
    name: {
      type: String,
      required: true,
      default: () => null,
    },
  },
  async fetch() {
    try {
      if (this.cardId) {
        await this.$store.dispatch("blocks/fetchWizardBlock", {
          itemId: this.itemId,
          cardId: this.cardId,
          ...this.$route.params,
        });
      } else {
        await this.$store.dispatch("blocks/fetchBlock", {
          id: this.itemId,
          query: { ...this.$route.query },
          ...this.$route.params,
        });
      }
    } catch (err) {
      console.error(err);
      this.$bvToast.toast(err.response.data.MESSAGE, {
        title: "Ошибка",
        variant: "danger",
        noAutoHide: true,
        solid: true,
      });
    }
  },
  computed: {
    templateData: {
      get() {
        return this.$store.getters["menu/getMenuById"](this.itemId)
          ?.SVJCARDGRID;
      },
    },
    actions: {
      get() {
        return this.$store.getters["menu/getMenuById"](this.itemId)?.ACTIONSCUR;
      },
    },
    isEmptyContent: {
      get() {
        const block = this.$store.getters["blocks/getBlockById"](this.itemId);
        if (block) {
          return !block?.data?.items.length;
        }
        return false;
      },
    },
    isShowBlock: {
      get() {
        return Boolean(this.$store.getters["blocks/getBlockById"](this.itemId));
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
    cardId() {
      return this.$route.params.idCard;
    },
  },
  methods: {
    getVisible(property) {
      if (this.list?.items && property) {
        const visible = this.list?.items.find(
          (item) => item[property] !== undefined
        );
        if (visible) {
          if (visible[property] === true) {
            return true;
          }
          if (visible[property] === false) {
            return false;
          }
        }
      }
      console.warn(
        `В методе getVisible свойство ${property}  не сущесвует или задано неверно.`
      );
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
      return null;
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
