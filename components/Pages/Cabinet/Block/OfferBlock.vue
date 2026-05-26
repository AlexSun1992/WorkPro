<template>
  <div>
    <v-runtime-template :template="templateData"></v-runtime-template>
  </div>
</template>

<script>
import VRuntimeTemplate from "@/components/Libs/RuntimeTemplate/RuntimeTemplate";
import ContentBlock from "./ContentBlock";

export default {
  name: "OfferBlock",
  components: {
    /* eslint-disable vue/no-unused-components */
    ContentBlock,
    VRuntimeTemplate,
  },
  props: {
    itemId: {
      type: String,
      default: null,
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
  },
};
</script>

<style scoped></style>
