<template>
  <div>
    <div
      v-if="filterType !== 'query' && filterType !== 'combobox'"
      class="filterblock"
    >
      <button
        v-if="showButtonAll"
        :data-activeitems="
          showFilteredItemsCount === true
            ? getUnfilteredItemsCount.length
            : null
        "
        :class="{
          'filter-checked': isAllFilters,
        }"
        @click="clearFilter(propertyName)"
      >
        {{ allItemsButtonName }}
      </button>
      <button
        v-for="item in filterItems"
        :key="item.name"
        :data-activeitems="
          showFilteredItemsCount === true
            ? getSameTypeUnitsCount(getUnfilteredItemsCount, item.name)
            : null
        "
        :disabled="
          getSameTypeUnitsCount(getUnfilteredItemsCount, item.name) === 0
            ? true
            : false
        "
        :class="{
          'filter-checked': item.isChecked,
        }"
        @click="toggleFilter(propertyName, item.name)"
      >
        {{ item.name }}
      </button>
      <slot></slot>
    </div>

    <div v-else-if="filterType === 'combobox'" class="search">
      <b-form-select
        v-model="selected"
        :options="filterItemsCombobox"
        value-field="item"
        text-field="name"
        @change="toggleFilter(propertyName, filterItemsCombobox[selected].name)"
      />
    </div>

    <div v-else class="search">
      <b-form-input
        v-model="searchString"
        placeholder="Введите поисковый запрос"
      />
    </div>
  </div>
</template>
<script>
import { changeKeyboardLayout } from "../../../../../utils/utils";
import { getSameTypeUnitsCount } from "./FilterBlock.helper";

export default {
  name: "FilterBlock",

  props: {
    uniqueItems: {
      type: Array,
      required: false,
      default: () => null,
    },
    defaultValue: {
      type: String,
      required: false,
      default: () => null,
    },
    propertyName: {
      type: String | Array[String],
      required: true,
      default: () => null,
    },
    filterType: {
      type: String,
      required: false,
      default: () => "checkbox",
    },

    itemId: {
      required: true,
      default: () => null,
    },

    showButtonAll: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    allItemsButtonName: {
      type: String,
      required: false,
      default: () => "Все",
    },

    showFilteredItemsCount: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },

  data() {
    return {
      isAllFilters: true,
      searchString: "",
      id: null,
      selected: "placeholder",
      placeHolder: { item: "placeholder", name: "Выберите время посещения" },
    };
  },
  computed: {
    filterItems() {
      const block = this.$store.getters["blocks/getUnfilteredBlockById"](
        this.itemId
      );

      if (block) {
        const items = block.data.items.map((item) => item[this.propertyName]);
        const uniqueItems = this.uniqueItems || Array.from(new Set(items));
        const filter =
          this.$store.getters["blocks/getFilters"].find(
            (item) => item.propertyName === this.propertyName
          )?.filter || [];
        return uniqueItems.map((name) => ({
          name,
          isChecked: filter.includes(name),
        }));
      }
      return [];
    },

    getUnfilteredItemsCount() {
      const allBlocks = this.$store.getters["blocks/getUnfilteredBlockById"](
        this.itemId
      );
      if (allBlocks) {
        return allBlocks.data.items;
      }
      return [];
    },

    filterItemsCombobox() {
      const options = this.filterItems.map(({ name }, idx) => ({
        item: idx,
        name,
      }));

      options.push(this.placeHolder);
      return options;
    },
  },

  watch: {
    searchString(str) {
      this.$store.commit("blocks/setSearchParams", {
        searchString: changeKeyboardLayout(str),
        searchProperty: this.propertyName,
        id: this.itemId,
      });
    },
  },

  unmounted() {
    this.$store.commit("blocks/setFilter", []);
  },

  created() {
    if (this.$route.query.filters) {
      const filters = JSON.parse(this.$route.query.filters.toString());
      if (this.filterType === "radiobutton" && this.defaultValue === null) {
        this.isAllFilters = true;
      }
      if (this.filterType === "radiobutton" && this.defaultValue !== null) {
        this.$store.commit("blocks/setFilter", {
          propertyName: this.propertyName,
          filter: this.defaultValue,
          id: this.itemId,
        });
      }
      if (
        this.filterType === "radiobutton" &&
        filters.find((filter) => filter.propertyName === this.propertyName)
      ) {
        this.isAllFilters = false;
      }
      if (
        this.filterType === "checkbox" &&
        filters.find((filter) => filter.propertyName === this.propertyName)
      ) {
        this.isAllFilters = false;
      }
      this.$store.commit("blocks/setFilter", filters);
    } else if (this.defaultValue) {
      this.isAllFilters = false;
      this.$store.commit("blocks/setFilter", {
        propertyName: this.propertyName,
        filter: this.defaultValue,
        id: this.itemId,
      });
    }
    this.$store.commit("blocks/setSearchParams", null);
  },

  methods: {
    getSameTypeUnitsCount,
    toggleFilter(propertyName, item) {
      this.isAllFilters = false;
      this.$store.commit("blocks/toggleFilter", {
        propertyName,
        filterType: this.filterType,
        filterItem: item,
        id: this.itemId,
      });
      this.setQueryURL();
      const target = this.$store.getters["blocks/getFilters"].find(
        (elem) => elem.propertyName === propertyName
      );
      if (this.filterType === "checkbox" && target.filter.length === 0) {
        this.isAllFilters = true;
      }
    },
    clearFilter(propertyName) {
      this.isAllFilters = true;
      this.$store.commit("blocks/clearFilter", {
        propertyName,
        filterType: this.filterType,
      });
      this.setQueryURL();
    },

    toggleFilterCombobox(propertyName, item) {
      this.$store.commit("blocks/replaceFilter", {
        propertyName,
        filter: [item],
        id: this.itemId,
      });
      this.setQueryURL();
    },

    setQueryURL() {
      const urlObject = new URL(window.location.href);

      urlObject.searchParams.set(
        "filters",
        JSON.stringify(this.$store.getters["blocks/getFilters"])
      );

      window.history.replaceState(null, null, urlObject.search);

      const url = `${this.$route.path}${urlObject.search}`;

      this.$store.commit("menu/setQueriesUrlByIdMenu", {
        ...this.$route.params,
        url,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.filterblock > .button:hover,
.filterblock > button:hover,
.filterblock > .button,
.filterblock > button {
  margin-bottom: 1rem;
  background: #fff;
  border-radius: 100px;
  position: relative;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 30px;
  color: #43b02a;
  border: 0;
  padding: 0px 12px;
  margin-right: 8px;
  text-decoration: none;
  line-height: 36px;
  height: 38px;
  &:disabled {
    background: #a4a4a4;
    color: #dfe3e5;
    &:after {
      display: none;
    }
  }
  &[data-activeitems]:after {
    content: attr(data-activeitems);
    min-width: 25px;
    text-align: center;
    height: 23px;
    border-radius: 23px;
    background: #edf8ea;
    color: #43b02a;
    display: initial;
    padding: 4px 8px;
    font-weight: 700;
    font-size: 14px;
    margin-left: 5px;
  }
  &.filter-checked {
    background: #009639;
    color: #fff;
    &:after {
      color: #292929;
    }
  }
  &.y-btn {
    background-color: #f7b801;
    color: #292929;
  }
}
@media (max-width: 992px) {
  .filter-mob-flex .filterblock {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
  }

  .filter-mob-flex .filterblock > button {
    white-space: nowrap;
    width: auto;
    overflow: visible;
  }
}
</style>
<style>
.cabinet .btn.btn-secondary .btn-filter-checked {
  background-color: #009639;
  color: white;
}

.search {
  width: 20vw;
}
</style>
