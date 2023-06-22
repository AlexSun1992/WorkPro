<template>
  <div>
    <button
      type="button"
      @click="toggleFilterVisibility()"
      class="CollapseGroup"
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
      isFilterVisible: true,
    };
  },
  computed: {
    getControls() {
      const getTestData = this.$store.getters["data_card/getForm"];
      return getTestData;
    },
    isFiltersRendered() {
      const isFiltersVisible =
        this.$store.getters["data_card/getFiltersVisibleStatus"];

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
      this.isFilterVisible = !this.isFilterVisible;
    },
  },
};
</script>

<style>
.button {
  display: block;
}
</style>
