<template>
  <div>
    <v-runtime-template :template="template"></v-runtime-template>
  </div>
</template>

<script>
import VRuntimeTemplate from "v-runtime-template";
import SelectItemFromTemplate from "./SelectItemFromTemplate.vue";
import ChooseButton from "@/components/Pages/Cabinet/Block/ChooseButton";
import RefuseButton from "@/components/Pages/Cabinet/Block/RefuseButton";
import FilterBlock from "@/components/Pages/Cabinet/Block/FilterBlock/FilterBlock";
import SearchBlock from "@/components/Pages/Cabinet/Block/FilterBlock/SearchBlock";
import ContentBlock from "@/components/Pages/Cabinet/Block/ContentBlock";
import Loader from "./Loader.vue";

export default {
  name: "WrapperItemFromTemplate",
  components: {
    /* eslint-disable vue/no-unused-components */
    SearchBlock,
    SelectItemFromTemplate,
    VRuntimeTemplate,
    ChooseButton,
    RefuseButton,
    FilterBlock,
    ContentBlock,
    Loader,
  },
  data() {
    return {};
  },

  props: {
    isButtonRender: {
      type: Object,
      required: true,
    },
    data: {
      type: Object,
      default: () => {},
    },
    itemId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      default: () => "",
    },
    template: {
      type: String,
      default: () => "",
    },
    isEmpty: {
      type: Boolean,
      default: () => false,
    },
  },

  computed: {
    isEmptyContent: {
      get() {
        const block = this.$store.getters["blocks/getBlockById"](900);
        if (block) {
          return !block?.data?.items.length;
        }
        return false;
      },
    },
  },

  methods: {
    update(event) {
      this.$emit("update", event);
    },

    clearItem() {
      this.$emit("update", {
        fieldId: this.isButtonRender.fieldId,
        name: this.isButtonRender.name,
        value: {},
      });
    },
  },
};
</script>
