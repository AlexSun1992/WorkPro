<template>
  <div>
    <v-runtime-template :template="template"></v-runtime-template>
  </div>
</template>

<script>
import SelectItemFromTemplate from "./SelectItemFromTemplate.vue";
import VRuntimeTemplate from "v-runtime-template";
import ChooseButton from "../../../Pages/Cabinet/Block/ChooseButton.vue";
import RefuseButton from "../../../Pages/Cabinet/Block/RefuseButton.vue";
import FilterBlock from "../../../Pages/Cabinet/Block/FilterBlock.vue";
import ObjectsOnMap from "../../ObjectsOnMap/ObjectsOnMap.vue";

export default {
  name: "WrapperItemFromTemplate",
  components: {
    SelectItemFromTemplate,
    VRuntimeTemplate,
    ChooseButton,
    RefuseButton,
    FilterBlock,
    ObjectsOnMap,
  },
  data() {
    return {};
  },

  props: {
    isButtonRender: {
      type: Object,
      required: false,
      default: () => {},
    },
    data: {
      type: Object,
      required: false,
      default: () => {},
    },

    itemId: {
      type: Number,
      required: false,
      default: () => "",
    },
    name: {
      type: String,
      required: false,
      default: () => "",
    },
    template: {
      type: String,
      required: false,
      default: () => "",
    },
    isEmpty: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },

  computed: {
    isEmptyContent: {
      get: function () {
        const block = this.$store.getters["blocks/getBlockById"](900);
        if (block) {
          return !block?.data?.items.length;
        } else {
          return false;
        }
      },
    },
  },

  methods: {
    update(event) {
      console.log("Отрабатывет метод update WrapperItemFromTemplate");
      console.log(event);
      console.log(this.isButtonRender);
      console.log(this.data);
      this.$emit("update", event);
    },
    clearItem(event) {
      console.log("!!!");

      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: {},
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
