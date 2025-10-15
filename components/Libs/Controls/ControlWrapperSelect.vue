<template>
  <div>
    <model-list-select
      :id="selectId"
      :ref="selectId"
      v-model="selectValue"
      :list="options"
      :option-value="optionsValue"
      :custom-text="displayText"
      :placeholder="placeholder || 'Выберите из списка'"
      :is-disabled="isDisabled"
    />
  </div>
</template>

<script>
import "vue-search-select/dist/VueSearchSelect.css";
import { ModelListSelect } from "vue-search-select";

export default {
  name: "ControlWrapperSelect",
  components: { ModelListSelect },
  props: {
    options: {
      type: Array,
      required: true,
      default: () => [],
    },
    itemValue: {
      type: Object,
      required: false,
      default: () => {},
    },
    optionsValue: {
      type: String,
      required: false,
      default: () => "ID",
    },
    selectId: {
      type: String,
      required: true,
    },
    displayText: {
      type: Function,
      required: true,
    },
    placeholder: {
      type: String,
      required: false,
    },
    isDisabled: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },
  computed: {
    selectValue: {
      get() {
        return this.itemValue;
      },
      set(value) {
        this.$emit("selectItem", value);
      },
    },
  },
  mounted() {
    if (this.$refs[this.selectId]) {
      this.$refs[this.selectId].$el.children[this.selectId].onfocus = () => {
        this.$emit("openList");
      };
    }
    if (this.selectValue && Object.keys(this.selectValue).length) {
      this.$emit("selectItem", this.selectValue);
    }
  },
};
</script>

<style scoped></style>
