<template>
  <div>
    <div
      v-if="filterType !== 'query' && filterType !== 'combobox'"
      class="filterblock"
    >
      <button
        v-for="item in filterItems"
        :data-activeitems="
          showFilteredItemsCount === true
            ? getSameTypeUnitsCount(getUnfilteredItemsCount, item.name)
            : null
        "
        :key="item.name"
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

      <button
        v-if="showButtonAll"
        :class="{
          'filter-checked': isAllFilters,
        }"
        @click="clearFilter(propertyName)"
      >
        {{ allItemsButtonName }}

        {{
          showFilteredItemsCount === true
            ? getUnfilteredItemsCount.length
            : null
        }}
      </button>
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
      ></b-form-input>
    </div>
  </div>
</template>
<script>
import { changeKeyboardLayout } from "../../../../../utils/utils";
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
        this.isAllFilters = false;
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
    getSameTypeUnitsCount(allItems, target) {
      const sameTypeUnitLength = allItems.filter((item) =>
        Object.values(item).includes(target)
      );
      return sameTypeUnitLength.length;
    },

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
      window.history.replaceState(
        null,
        null,
        `?filters=${JSON.stringify(this.$store.getters["blocks/getFilters"])}`
      );
      const { url } = {
        url: `${this.$route.path}?filters=${JSON.stringify(
          this.$store.getters["blocks/getFilters"]
        )}`,
      };

      this.$store.commit("menu/setQueriesUrlByIdMenu", {
        ...this.$route.params,
        url,
      });
    },
  },
};
</script>

<style scoped>
.menu {
  display: flex;
  flex-wrap: wrap;
}

.red {
  background-color: red;
}

li {
  list-style: none;
  cursor: pointer;
  white-space: nowrap;
  margin-bottom: 5px;
}
</style>
<style>
.cabinet .btn.btn-secondary .btn-filter-checked {
  background-color: #008b4e;
  color: white;
}

.search {
  width: 20vw;
}
</style>
