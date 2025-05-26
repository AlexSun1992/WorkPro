<template>
  <div>
    <div
      v-if="filterType !== 'query' && filterType !== 'combobox'"
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
      <div
        v-for="item in filterItems"
        :key="item.text"
      >
        <button
          v-if="!item.isOptional || getSameTypeUnitsCount(getUnfilteredItemsCount, item.name) > 0"
          :data-activeitems="
            showFilteredItemsCount === true ? getSameTypeUnitsCount(getUnfilteredItemsCount, item.name) : null
          "
          :disabled="getSameTypeUnitsCount(getUnfilteredItemsCount, item.name) === 0 ? true : false"
          :class="{
            'filter-checked': item.isChecked,
          }"
          @click="toggleFilter(propertyName, item.name)"
        >
          {{ item.name }}
        </button>
      </div>
      <div>
        <slot></slot>
      </div>
    </div>

    <div
      v-else-if="filterType === 'combobox'"
      class="search"
    >
      <b-form-select
        v-model="selected"
        :options="filterItemsCombobox"
        value-field="item"
        text-field="name"
        @change="toggleFilter(propertyName, filterItemsCombobox[selected].name)"
      />
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
import { changeKeyboardLayout } from "../../../../../utils/utils";
import { getSameTypeUnitsCount } from "./FilterBlock.helper";

export default {
  name: "FilterBlock",

  props: {
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
    },

    itemId: {
      required: true,
      default: () => null,
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
      const block = this.$store.getters["blocks/getUnfilteredBlockById"](this.itemId);

      if (block) {
        const dataItems = this.isSecondaryFilter ? this.getMainFilteredItems : block.data.items;
        const filterItems = dataItems.map((item) => item[this.propertyName]);

        const uniqueItems = this.uniqueItems || Array.from(new Set(filterItems));

        const filter =
          this.$store.getters["blocks/getFilters"].find((item) => item.propertyName === this.propertyName)?.filter ||
          [];

        return uniqueItems.map((name) => {
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
      }
      return [];
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
  },

  watch: {
    searchString(str) {
      this.$store.commit("blocks/setSearchParams", {
        searchString: changeKeyboardLayout(str),
        searchProperty: this.propertyName,
        id: this.itemId,
      });
    },

    filterItems(filters) {
      const checkedHiddenItem = filters.some((item) => {
        const count = this.getSameTypeUnitsCount(this.getUnfilteredItemsCount, item.name);
        return item.isChecked && count === 0;
      });
      const isAnyCheckedFilter = filters.some(({ isChecked }) => isChecked);
      if (
        (this.isSecondaryFilter && filters.length && !isAnyCheckedFilter && !this.isAllFilters) ||
        checkedHiddenItem
      ) {
        this.clearFilter(this.propertyName);
      }
    },
  },

  unmounted() {
    this.$store.commit("blocks/setFilter", []);
  },

  created() {
    const currentFilter = this.$route.query[this.propertyName];
    if (currentFilter) {
      this.isAllFilters = false;
      this.$store.commit("blocks/setFilter", {
        propertyName: this.propertyName,
        filter: Array.isArray(currentFilter) ? currentFilter : [currentFilter],
        id: this.itemId,
        filterType: this.filterType,
        isMainFilter: !this.isSecondaryFilter,
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
        isMainFilter: !this.isSecondaryFilter,
      });
      this.setQueryURL();
      const target = this.$store.getters["blocks/getFilters"].find((elem) => elem.propertyName === propertyName);
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
        filterType: this.filterType,
        isMainFilter: !this.isSecondaryFilter,
      });
      this.setQueryURL();
    },

    setQueryURL() {
      const urlObject = new URL(window.location.href);

      [...urlObject.searchParams.keys()].filter((item) => item !== "q");
      urlObject.searchParams.delete(this.propertyName);
      this.$store.getters["blocks/getFilters"].forEach((item) => {
        const { propertyName, filter } = item;
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

<style scoped lang="scss">
.filterblock > div {
  display: inline-block;
}
.filterblock .button:hover,
.filterblock .button:hover,
.filterblock .button,
.filterblock button {
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

  .filter-mob-flex .filterblock > div {
    white-space: nowrap;
    width: auto;
    overflow: visible;
  }
  .filterblock > div {
    display: flex;
  }
}
.filterblock button.arch-btn {
  color: #0000008e;
  background: none;
  padding: 0;
  position: relative;
}

.filterblock button.arch-btn:hover {
  color: #000000;
}

.filterblock button.arch-btn:after {
  position: absolute;
  content: "";
  width: 100%;
  height: 1px;
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTAiIGhlaWdodD0iMSIgdmlld0JveD0iMCAwIDkwIDEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxsaW5lIHkxPSIwLjUiIHgyPSI5MCIgeTI9IjAuNSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLW9wYWNpdHk9IjAuNyIgc3Ryb2tlLWRhc2hhcnJheT0iMiAyIi8+Cjwvc3ZnPgo=")
    0 0 repeat;
  bottom: 5px;
  left: 0;
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
