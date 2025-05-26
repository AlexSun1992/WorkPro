<template>
  <div
    class="filters-container row align-items-center mh-1 justify-content-between"
  >
    <button class="popup-mobile-close" type="button"></button>
    <div class="d-lg-none col-12">
      <div class="popup-mobile-title">Фильтр поиска офисов</div>
    </div>
    <div class="col-lg-auto col-12">
      <div class="filters row align-items-center mh-1">
        <div
          v-for="(f, i) in filters"
          :key="i"
          class="col-lg-auto col-12 checkbox-hide"
        >
          <input
            type="checkbox"
            :value="f"
            v-model="checkedFilters"
            class="custom-control-input"
            :id="f.id"
          />
          <label class="custom-control-label" :for="f.id">{{ f.text }}</label>
        </div>
      </div>
    </div>
    <div class="col-lg-auto col-12 position-relative">
      <button
        :disabled="disabled"
        @click="clearFilters"
        class="del-office-filters"
      >
        <span class="d-none d-lg-block">Сбросить</span
        ><span class="d-lg-none">Очистить фильтр</span>
      </button>
    </div>
  </div>
</template>

<script>
import { getFilters } from "../../../../utils/map/filters";

export default {
  name: "FilterComponent",
  components: {},
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
