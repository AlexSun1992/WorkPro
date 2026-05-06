<template>
  <div :id="filterBlockId">
    <div
      v-if="filterType !== 'query'"
      class="filterblock"
    >
      <div
        v-if="showButtonAll"
        :data-activeitems="showFilteredItemsCount === true ? getUnfilteredItemsCount.length : null"
      >
        <button
          :class="{
            'filter-checked': isAllFilters,
          }"
          @click="clearFilter(propertyName)"
        >
          {{ allItemsButtonName }}
        </button>
      </div>

      <div v-if="showClearFilter">
        <a
          class="clear-button"
          v-if="currentFilterItems.length"
          type="button"
          title="Очистить фильтры"
          @click.stop="clearFilter"
        >
          Сбросить
        </a>
      </div>

      <div
        v-for="item in filterItems"
        :key="item[keyField]"
      >
        <button
          v-if="isShowButton(item)"
          :data-activeitems="getFilterCount(item.name)"
          :data-test-id="`filter-button-${item[keyField]}`"
          :disabled="isFilterDisabled(item.name)"
          :class="{
            'show-counter': !filterIcons[item.name],
            'filter-checked': item.isChecked,
          }"
          @click="toggleFilter(propertyName, item.name)"
        >
          {{ item.name }}
          <img
            v-if="filterIcons[item.name]"
            class="filter-icon"
            :src="getFilterIcon(item.name)"
          />
        </button>
      </div>
      <slot></slot>
    </div>
    <div
      v-else
      class="search"
    >
      <b-form-input
        v-model="searchString"
        placeholder="Введите поисковый запрос"
      />
    </div>
  </div>
</template>
<script>
import { changeKeyboardLayout } from "@/utils/utils";
import { getFilterUsingCount, getSameTypeUnitsCount } from "./FilterBlock.helper";
import contentBlockHelper from "../contentBlock.helper";

const FILTER_TYPES = ["query", "radiobutton", "checkbox"];

export default {
  name: "FilterBlock",

  props: {
    // {"Скорая помощь": "/path/img.png"}
    filterIcons: {
      type: Object,
      default: () => ({}),
    },
    uniqueItems: {
      type: [Array, null],
      default: () => null,
    },
    defaultValue: {
      type: String,
      default: "",
    },
    propertyName: {
      type: [String, Array[String]],
      required: true,
    },
    filterType: {
      type: String,
      default: "checkbox",
      validator: (filterType) => FILTER_TYPES.includes(filterType),
    },
    isMultiSelect: {
      type: Boolean,
      default: false,
    },
    itemId: {
      type: String,
      required: true,
    },
    showButtonAll: {
      type: Boolean,
      default: false,
    },
    allItemsButtonName: {
      type: String,
      default: "Все",
    },
    showFilteredItemsCount: {
      type: Boolean,
      required: true,
    },

    // Признак "вторичного" фильтра, который зависит от остальных и сбрасывается, если не найдены элементы
    isSecondaryFilter: {
      type: Boolean,
      default: false,
    },
    resetFilterOnNoneFound: {
      type: Boolean,
      default: false,
    },
    radio: {
      type: Boolean,
      default: false,
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
    filterBlockId() {
      const id = this.propertyName?.toLowerCase() ?? "unknown";

      return `filter-block-${id}`;
    },
    showClearFilter() {
      return this.filterItems?.length && this.isMultiSelect;
    },
    currentFilters() {
      return this.$store.getters["blocks/getFilters"].find((elem) => elem.propertyName === this.propertyName);
    },
    currentFilterItems() {
      return this.currentFilters?.filter ?? [];
    },

    keyField() {
      return this.filterItems?.some((item) => item.text) ? "text" : "name";
    },

    filterItems() {
      const block = this.$store.getters["blocks/getUnfilteredBlockById"](this.itemId);

      if (block) {
        const dataItems = this.isSecondaryFilter ? this.getMainFilteredItems : block.data.items;
        const filterItems = dataItems.map((item) => item[this.propertyName]);
        const uniqueItems = this.uniqueItems || contentBlockHelper.getUniqueItemsFromHeal(filterItems);
        const isObjectFilter = uniqueItems.some((f) => typeof f === "object");
        const filter =
          this.$store.getters["blocks/getFilters"].find((item) => item.propertyName === this.propertyName)?.filter ||
          [];
        // check for any active filters that don't have an item
        const filtersWithItems = filter.filter((f) => {
          if (isObjectFilter) {
            return uniqueItems.some((itm) => itm.text === f);
          }
          return uniqueItems.includes(f);
        });
        if (filtersWithItems.length !== filter.length) {
          this.clearFilter();
          filtersWithItems.forEach((fil) => {
            this.toggleFilter(this.propertyName, fil);
          });
        }
        const mapped = uniqueItems.map((name) => {
          if (typeof name === "object") {
            return {
              name: name.text,
              isOptional: name.isOptional,
              isChecked: filter.includes(name.text),
            };
          }
          return {
            name,
            isChecked: filter.includes(name),
          };
        });
        const noneChecked = mapped.every((mappedFilter) => !mappedFilter.isChecked);
        if (this.resetFilterOnNoneFound && noneChecked) {
          this.clearFilter();
        }
        return mapped.filter((item) => !this.ignoredFilters.includes(item.name));
      }
      return [];
    },

    filterTypeComputed() {
      return FILTER_TYPES.includes(this.filterType) ? this.filterType : "checkbox";
    },

    getMainFilteredItems() {
      return this.$store.getters["blocks/getMainFilteredItems"](this.itemId);
    },

    getUnfilteredItemsCount() {
      const allBlocks = this.$store.getters["blocks/getUnfilteredBlockById"](this.itemId);

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
    isFilterSelected() {
      return this.filterItems.some((item) => item.isChecked);
    },
    blocksCount() {
      return this.$store.state.blocks.blocks?.length;
    },
    currentBlock() {
      return this.$store.getters["blocks/getBlockById"](this.itemId);
    },
    ignoredFilters() {
      if (!this.addFields?.SFAV_NAME) {
        return ["empty"];
      }
      return [];
    },
    addFields() {
      return this.currentBlock?.data?.addFields;
    },
    defaultFilter() {
      try {
        const filters = JSON.parse(this.addFields?.DEFAULT_FILTER);
        const filter = filters.find((item) => item.propertyName === this.propertyName)?.DEFAULT;

        return filter ? [filter] : [];
      } catch (err) {
        return [];
      }
    },
  },

  created() {
    const currentFilter = this.$route.query[this.propertyName];

    if (currentFilter) {
      this.isAllFilters = false;
      this.$store.commit("blocks/setFilter", {
        propertyName: this.propertyName,
        filter: Array.isArray(currentFilter) ? currentFilter : [currentFilter],
        id: this.itemId,
        filterType: this.filterTypeComputed,
        isMainFilter: !this.isSecondaryFilter,
      });
    }
    this.$store.commit("blocks/setSearchParams", null);
  },

  unmounted() {
    this.$store.commit("blocks/setFilter", []);
  },

  watch: {
    searchString(str) {
      this.$store.commit("blocks/setSearchParams", {
        searchString: changeKeyboardLayout(str),
        searchProperty: this.propertyName,
        id: this.itemId,
      });
    },
    blocksCount(val) {
      if (!this.isFilterSelected && val) {
        this.initDefaultFilter();
      }
    },
    filterItems(filters) {
      const checkedHiddenItem = filters.some((item) => {
        const count = getFilterUsingCount(this.getUnfilteredItemsCount, item.name, this.propertyName);
        return item.isChecked && count === 0;
      });
      const isAnyCheckedFilter = filters.some(({ isChecked }) => isChecked);
      if ((filters.length && !isAnyCheckedFilter && !this.isAllFilters) || checkedHiddenItem) {
        this.clearFilter(this.propertyName);
      }
    },
  },

  methods: {
    getFilterCount(name) {
      return this.showFilteredItemsCount === true
        ? getFilterUsingCount(this.getUnfilteredItemsCount, name, this.propertyName)
        : null;
    },
    isFilterDisabled(name) {
      return getFilterUsingCount(this.getUnfilteredItemsCount, name, this.propertyName) === 0;
    },
    isShowButton(item) {
      return !item.isOptional || getFilterUsingCount(this.getUnfilteredItemsCount, item.name, this.propertyName) > 0;
    },
    getSameTypeUnitsCount,
    getFilterIcon(name) {
      if (!name) {
        return "";
      }

      return this.filterIcons[name];
    },
    initDefaultFilter() {
      if (Array.isArray(this.defaultFilter)) {
        this.defaultFilter.forEach((filter) => {
          this.toggleFilter(this.propertyName, filter);
        });
      }
    },
    updateFilterArray(value) {
      const currentFilters = [...this.currentFilterItems] ?? [];

      if (currentFilters.includes(value)) {
        return currentFilters.filter((item) => item !== value);
      }

      if (this.isMultiSelect) {
        return [...currentFilters, value];
      }

      return [value];
    },
    // TODO: rewrite FilterBlock from scratch
    toggleFilter(propertyName, item) {
      const checkedItems = this.filterItems.filter((itm) => itm.isChecked);
      if (this.radio && checkedItems.length === 1 && checkedItems[0].name === item) {
        return;
      }
      this.isAllFilters = false;
      this.$store.commit("blocks/toggleFilter", {
        propertyName,
        filterType: this.filterTypeComputed,
        filterItem: [...this.updateFilterArray(item)],
        id: this.itemId,
        isMainFilter: !this.isSecondaryFilter,
      });
      this.setQueryURL();
      const target = this.currentFilters;

      if (this.filterTypeComputed === "checkbox" && target.filter.length === 0) {
        this.isAllFilters = true;
      }
    },
    clearFilter() {
      this.isAllFilters = true;
      this.$store.commit("blocks/clearFilter", {
        propertyName: this.propertyName,
        filterType: this.filterTypeComputed,
      });
      this.setQueryURL();
    },
    // TODO похоже, метод мертвый
    toggleFilterCombobox(propertyName, item) {
      this.$store.commit("blocks/replaceFilter", {
        propertyName,
        filter: [item],
        id: this.itemId,
        filterType: this.filterTypeComputed,
        isMainFilter: !this.isSecondaryFilter,
      });
      this.setQueryURL();
    },

    setQueryURL() {
      const urlObject = new URL(window.location.href);
      urlObject.searchParams.delete(this.propertyName);
      this.$store.getters["blocks/getFilters"].forEach((item) => {
        const { propertyName, filter } = item;
        if (propertyName !== this.propertyName) {
          return;
        }
        filter.forEach((filterValue) => {
          urlObject.searchParams.append(propertyName, filterValue);
        });
      });
      window.history.replaceState(null, null, urlObject);
      const url = `${this.$route.path}${urlObject.search}`;
      this.$store.commit("menu/setQueriesUrlByIdMenu", {
        ...this.$route.params,
        url,
      });
    },
  },
};
</script>

<style scoped>
.filterblock > div {
  display: inline-block;
}

.filterblock .button,
.filterblock .button:hover,
.filterblock button {
  background: #fff;
  border: 0;
  border-radius: 100px;
  color: #43b02a;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  height: 38px;
  line-height: 36px;
  margin-bottom: 1rem;
  margin-right: 8px;
  padding: 0 12px;
  position: relative;
  -webkit-text-decoration: none;
  text-decoration: none;
}

.filterblock .button:disabled,
.filterblock .button:hover:disabled,
.filterblock button:disabled {
  background: #a4a4a4;
  color: #dfe3e5;
}

.filterblock .button:disabled:after,
.filterblock .button:hover:disabled:after,
.filterblock button:disabled:after {
  display: none;
}

.filterblock .button:hover[data-activeitems]:after,
.filterblock .button[data-activeitems]:after,
.filterblock button[data-activeitems]:after {
  background: #edf8ea;
  border-radius: 23px;
  color: #43b02a;
  display: initial;
  font-size: 14px;
  font-weight: 700;
  height: 23px;
  margin-left: 5px;
  min-width: 25px;
  padding: 4px 8px;
  text-align: center;
}

.filterblock button[data-activeitems].show-counter:after {
  content: attr(data-activeitems);
}

.filterblock .button.filter-checked,
.filterblock .button:hover.filter-checked,
.filterblock button.filter-checked {
  background: #009639;
  color: #fff;
}

.filterblock .button.filter-checked:after,
.filterblock .button:hover.filter-checked:after,
.filterblock button.filter-checked:after {
  color: #292929;
}

.filterblock .button.y-btn,
.filterblock .button:hover.y-btn,
.filterblock button.y-btn {
  background-color: #f7b801;
  color: #292929;
}

@media (max-width: 992px) {
  .filter-mob-flex .filterblock {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
  }

  .filter-mob-flex .filterblock > div {
    overflow: visible;
    white-space: nowrap;
    width: auto;
  }

  .filterblock > div {
    display: flex;
  }
  .clear-button {
    padding-top: 6px;
  }
}

.filterblock button.arch-btn {
  background: none;
  color: rgba(0, 0, 0, 0.557);
  padding: 0;
  position: relative;
}

.filterblock button.arch-btn:hover {
  color: #000;
}

.filterblock button.arch-btn:after {
  background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5MCIgaGVpZ2h0PSIxIiBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgOTAgMSI+PHBhdGggc3Ryb2tlPSIjMDAwIiBzdHJva2UtZGFzaGFycmF5PSIyIDIiIHN0cm9rZS1vcGFjaXR5PSIuNyIgZD0iTTAgLjVoOTAiLz48L3N2Zz4=")
    0 0 repeat;
  bottom: 5px;
  content: "";
  height: 1px;
  left: 0;
  position: absolute;
  width: 100%;
}

.filter-icon {
  margin-left: 4px;
}

.clear-button {
  padding-right: 0.5em;
  text-decoration: underline;
  text-underline-offset: 0.2em;
  color: var(--lgreen);
}

.filter-checked img {
  filter: hue-rotate(180deg) brightness(10);
}
</style>
