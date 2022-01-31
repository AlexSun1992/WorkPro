<template>
  <div>
    <model-select
      :options="list"
      v-model="selectedItem"
      :placeholder="placeholder"
      ref="select"
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
    isAutoOpenForMultipleRow: {
      type: Array,
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

  methods: {},
  watch: {
    selectedItem(val) {
      this.$emit("update", val);
    },
    isAutoOpenForMultipleRow(val) {
      this.selectedItem = val;
      if (val.length > 1) {
        this.$refs["select"].showMenu = true;
      }
    },
  },
};
</script>
