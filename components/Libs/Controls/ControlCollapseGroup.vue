<template>
  <div>
    <button
      type="button"
      @click="toggleFilterVisibility()"
      class="collapsegroup"
      :class="{ active: isFiltersRendered }"
    >
      Фильтры поиска
    </button>
  </div>
</template>

<script>
export default {
  name: "ControlCollapseGroup",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    groupNumber: {
      type: Number,
      required: false,
      default: () => 0,
    },
  },
  data() {
    return {
      isFilterVisible: false,
    };
  },
  computed: {
    isFiltersRendered() {
      const isFiltersVisible = this.$store.getters["data_card/getFiltersVisibleStatus"];

      return isFiltersVisible;
    },
  },

  methods: {
    toggleFilterVisibility() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.isFiltersRendered,
      });
      this.$emit("remove", {
        value: this.isFilterVisible,
        name: this.data.name,
      });

      const filterVisibleStatus = !this.isFiltersRendered;
      this.$store.commit("data_card/toggleFilterVisible", filterVisibleStatus);
    },
  },
};
</script>
