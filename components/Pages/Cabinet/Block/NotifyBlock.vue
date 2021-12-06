<template>
  <div>
    <div v-show="isShowBlock">
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
import ContentBlock from "./ContentBlock";
import ActionButton from "./ActionButton";
import OpenCardButton from "../Block/OpenCardButton";
import DeleteCardButton from "../Block/DeleteCardButton";
import VRuntimeTemplate from "v-runtime-template";
import SkeletonBox from "~/components/Libs/SkeletonBox";
export default {
  name: "NotifyBlock",
  components: {
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
  computed: {
    templateData: {
      get: function () {
        return this.$store.getters["menu/getMenuById"](this.itemId).SVJCARDGRID;
      },
    },
    actions: {
      get: function () {
        return this.$store.getters["menu/getMenuById"](this.itemId).ACTIONSCUR;
      },
    },
    isEmptyContent: {
      get: function () {
        const block = this.$store.getters["blocks/getBlockById"](this.itemId);
        if (block) {
          return !block?.data?.items.length;
        } else {
          return false;
        }
      },
    },
    isShowBlock: {
      get: function () {
        return Boolean(this.$store.getters["blocks/getBlockById"](this.itemId));
      },
    },
  },
};
</script>

<style scoped></style>
