<template>
  <div>
    <v-runtime-template :template="templateData"></v-runtime-template>
  </div>
</template>

<script>
import ContentBlock from "./ContentBlock";
import VRuntimeTemplate from "v-runtime-template";
// import SelectItemFromTemplate from "../../../Libs/Controls/ControlListSelect/SelectItemFromTemplate.vue";

export default {
  name: "OfferBlock",
  components: { ContentBlock, VRuntimeTemplate },
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
