<template>
  <div>
    <div v-show="isShowBlock">
      <v-runtime-template :template="templateData"></v-runtime-template>
    </div>
    <div v-if="!isShowBlock">
      <div class="card bg-six block-border-one block">
        <SkeletonBox class="mt-5" :items="4"></SkeletonBox>
      </div>
    </div>
  </div>
</template>

<script>
import ContentBlock from "./ContentBlock";
import OpenCardButton from "../Block/OpenCardButton";
import ModalBox from "../Block/ModalBox.vue";
import VRuntimeTemplate from "v-runtime-template";
import SkeletonBox from "~/components/Libs/SkeletonBox";

export default {
  name: "PolicyBlock",
  components: {
    ModalBox,
    ContentBlock,
    VRuntimeTemplate,
    OpenCardButton,
    SkeletonBox,
  },
  props: {
    moduleId: {
      type: String,
      required: false,
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
        return Boolean(this.$store.getters["blocks/getBlockById"](this.itemId));
      },
    },
  },
};
</script>

<style scoped></style>
