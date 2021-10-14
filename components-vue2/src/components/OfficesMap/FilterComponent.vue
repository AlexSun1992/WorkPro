<template>
  <div class="filters-container">
    <div class="filters">
      <div v-for="(f, i) in filters" :key="i">
        <input type="checkbox" :value="f" v-model="checkedFilters" />
        <label>{{ f.text }}</label>
      </div>
    </div>
    <button :disabled="disabled" @click="clearFilters" class="ml-3">
      Сбросить фильтры
    </button>
  </div>
</template>

<script>
import { BButton } from "bootstrap-vue";
import { getFilters } from "../../../../utils/map/filters";
export default {
  name: "FilterComponent",
  components: {
    BButton,
  },
  data() {
    return {
      checkedFilters: [],
    };
  },
  props: {
    filters: {
      type: Array,
    },
  },
  methods: {
    clearFilters() {
      this.checkedFilters = [];
    },
  },
  computed: {
    disabled() {
      return this.checkedFilters.length == 0;
    },
  },
  watch: {
    checkedFilters: function (filters) {
      this.$emit("update", getFilters(filters));
    },
  },
};
</script>

<style scoped>
.filters-container {
  display: flex;
}
.filters {
  display: grid;
  grid-template-columns: max-content max-content;
  grid-column-gap: 20px;
}
</style>
