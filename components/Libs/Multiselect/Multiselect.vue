<template>
  <div>
    <model-select
      ref="select"
      :options="list"
      v-model="selectedItem"
      :placeholder="placeholder"
      :isDisabled="isReadonlyAfterSelect"
    >
    </model-select>
  </div>
</template>

<script>
import { ModelSelect } from "vue-search-select";

export default {
  components: {
    ModelSelect,
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    isReadonlyAfterSelect: {
      type: Boolean,
      default: false,
    },
    isAutoSelectSingleRow: {
      type: Object,
      required: false,
    },
    isAutoOpen: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      selectedItem: {
        value: "",
        text: "",
      },
    };
  },

  watch: {
    selectedItem(val) {
      this.$emit("update", val);
    },
    list(val) {
      if (val.length > 1 && this.isAutoOpen) {
        this.$refs.select.showMenu = true;
      }
    },
    isAutoSelectSingleRow(val) {
      this.selectedItem = val;
    },
  },
};
</script>
