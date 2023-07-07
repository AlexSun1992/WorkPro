<template>
  <div>
    {{ isFilterVisible }}
    <button
      type="button"
      @click="toggleFilterVisibility()"
      class="collapsegroup"
      :class="{ active: !isFilterVisible }"
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
      this.$store.commit("data_card/toggleFilterVisible", this.isFilterVisible);
    },
  },
};
</script>

<style>
.collapse-filter {
  display: none;
}
@media (max-width: 992px) {
  .collapse-filter {
    display: block;
  }
  .collapse-filter + .conf-block {
    display: none;
  }
  .collapse-filter + .conf-block + .conf-block,
  .collapse-filter + .conf-block {
    position: relative;
  }
  .collapse-filter + .conf-block .title-conf-block {
    position: absolute;
    top: -38px;
  }
  .collapse-filter + .conf-block:not(.d-block) + .conf-block .title-conf-block {
    position: absolute;
    top: -38px;
  }

  .collapse-filter {
    position: relative;
    min-height: 16px;
    margin-bottom: 1.5rem;
  }

  .collapsegroup {
    right: 0;
    top: 0;
    color: #43b02a;
    border: 0;
    background: 0;
    font-weight: 700;
    line-height: 20px;
    font-size: 0.875rem;
    position: absolute;
    padding-right: 28px;
  }
  .collapsegroup:after {
    content: "";
    width: 24px;
    height: 24px;
    background: url(/img/icon-chevron-r.svg) 50% 50% no-repeat;
    transform: rotate(90deg);
    position: absolute;
    display: inline-block;
    margin-top: -1px;
  }
  .collapsegroup.active:after {
    transform: rotate(270deg);
  }
  .collapse-filter + .conf-block > .row > div:nth-child(2),
  .collapse-filter
    + .conf-block:not(.d-block)
    + .conf-block
    > .row
    > div:nth-child(2) {
    margin-top: 0;
  }
}
</style>
