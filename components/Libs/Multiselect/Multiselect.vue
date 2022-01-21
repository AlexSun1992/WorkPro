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
    isAutoopenForMultipleRow: {
      type: Array,
      required: false,
    },
  },

  updated() {
    if (
      this.$refs["select"]._uid === 39 &&
      this.isAutoopenForMultipleRow.length > 1
    ) {
      this.$refs["select"].showMenu = true;
    }
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
  },
};
</script>
