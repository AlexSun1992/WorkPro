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

    isAutoSelectSingleRow: {
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

  methods: {},
  watch: {
    selectedItem(val) {
      this.$emit("update", val);
    },
    isAutoOpenForMultipleRow(val) {
      console.log(val);
      if (val.length > 1) {
        this.$refs["select"].showMenu = true;
      }
    },
    isAutoSelectSingleRow(val) {
      this.selectedItem = val;
    },
  },
};
</script>
