<template>
  <div>
    <model-select
      :options="list"
      v-model="selectedItem"
      :placeholder="placeholder"
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
      required: false,
    },
    autoValue: {
      type: Object,
      required: false,
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
    autoValue(val) {
      this.selectedItem = val;
    },
  },
};
</script>
