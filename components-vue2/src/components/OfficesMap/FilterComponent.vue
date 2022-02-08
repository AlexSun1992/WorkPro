<template>
  <div class="filters-container row">
    <div class="col-9">
      <div class="filters row">
        <div v-for="(f, i) in filters" :key="i" class="col-3 checkbox-hide">
          <input
            type="checkbox"
            :value="f"
            v-model="checkedFilters"
            class="custom-control-input"
          />
          <label class="custom-control-label">{{ f.text }}</label>
        </div>
      </div>
    </div>
    <div class="col-3">
      <button
        :disabled="disabled"
        @click="clearFilters"
        class="del-office-filters"
      >
        Сбросить фильтры
      </button>
    </div>
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

<style scoped></style>
