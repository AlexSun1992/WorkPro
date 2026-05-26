<template>
  <div>
    <div v-show="isShowBlock">
      <v-runtime-template :template="templateData"></v-runtime-template>
    </div>
    <div v-if="!isShowBlock">
      <div class="card bg-six block-border-one block">
        <SkeletonBox
          class="mt-5"
          :items="4"
        ></SkeletonBox>
      </div>
    </div>
  </div>
</template>

<script>
import VRuntimeTemplate from "@/components/Libs/RuntimeTemplate/RuntimeTemplate";
import SkeletonBox from "~/components/Libs/SkeletonBox";

export default {
  name: "PolicyBlock",
  components: {
    VRuntimeTemplate,
    /* eslint-disable vue/no-unused-components */
    SkeletonBox,
  },
  props: {
    moduleId: {
      type: String,
      default: "",
    },
    itemId: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: null,
    },
  },
  computed: {
    templateData() {
      return this.$store.getters["menu/getMenuById"](this.itemId).SVJCARDGRID;
    },
    isEmptyContent() {
      const block = this.$store.getters["blocks/getBlockById"](this.itemId);
      if (block) {
        return !block.data.items.length;
      }
      return false;
    },
    isShowBlock() {
      return Boolean(this.$store.getters["blocks/getBlockById"](this.itemId));
    },
  },
};
</script>

<style scoped></style>
