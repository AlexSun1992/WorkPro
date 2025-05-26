<template>
  <div>
    <v-runtime-template :template="templateData"></v-runtime-template>
  </div>
</template>

<script>
import VRuntimeTemplate from "v-runtime-template";
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
  },
};
</script>

<style scoped></style>
