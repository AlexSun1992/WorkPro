<template>
  <div>
    <model-list-select
      :ref="selectId"
      :id="selectId"
      :list="options"
      v-model="selectValue"
      :option-value="optionsValue"
      :custom-text="displayText"
      :placeholder="placeholder || 'Выберите из списка'"
    >
    </model-list-select>
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
  },
  mounted() {
    if (this.$refs[this.selectId]) {
      this.$refs[this.selectId].$el.children[this.selectId].onfocus = () => {
        this.$emit("openList");
      };
    }
  },
  computed: {
    selectValue: {
      get: function () {
        return this.itemValue;
      },
      set: function (value) {
        this.$emit("selectItem", value);
      },
    },
  },
};
</script>

<style scoped></style>
