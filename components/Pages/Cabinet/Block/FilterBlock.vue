<template>
  <div>
    <ul class="menu" v-if="filterType !== 'query' && filterType !== 'combobox'">
      <li v-for="item in filterItems" :key="item.name">
        <b-button
          :class="{
            'filter-checked': item.isChecked,
          }"
          v-on:click="toggleFilter(propertyName, item.name)"
        >
          {{ item.name }}
        </b-button>
      </li>
      <li>
        <b-button
          v-if="showButtonAll"
          :class="{
            'filter-checked': isAllFilters,
          }"
          v-on:click="clearFilter(propertyName)"
          >{{ AllUnits }}</b-button
        >
      </li>
    </ul>

    <div class="select" v-else-if="filterType === 'combobox'">
      <b-form-select
        v-model="selected"
        :options="filterItemsDate"
        value-field="item"
        text-field="name"
        @change="filterCombobox(propertyName, filterItemsDate[selected].name)"
      >
      </b-form-select>
    </div>

    <div class="search" v-else>
      <b-form-input
        v-model="searchString"
        placeholder="Введите поисковый запрос"
      ></b-form-input>
    </div>
  </div>
</template>
<script>
import { changeKeyboardLayout } from "../../../../utils/utils";
export default {
  name: "FilterBlock",
  data() {
    return {
      AllUnits: "Все",
      isAllFilters: true,
      searchString: "",
      id: null,
      selected: 0,
    };
  },

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
        // this.filterType === "combobox" &&
        filters.find((filter) => filter.propertyName === this.propertyName)
      ) {
        this.isAllFilters = false;
      }

      /* if (
        this.filterType === "checkbox" &&
        filters.find((filter) => filter.propertyName === this.propertyName)
      ) {
        console.log("2", this.filterType);
        this.isAllFilters = false;
      } */

      this.$store.commit("blocks/setFilter", filters);
    } else {
      if (this.defaultValue) {
        this.isAllFilters = false;
        this.$store.commit("blocks/setFilter", {
          propertyName: this.propertyName,
          filter: this.defaultValue,
          id: this.itemId,
        });
      }
    }
    this.$store.commit("blocks/setSearchParams", null);
  },

  destroyed() {
    this.$store.commit("blocks/setFilter", []);
  },

  methods: {
    toggleFilter(propertyName, item) {
      this.isAllFilters = false;
      this.$store.commit("blocks/toggleFilter", {
        propertyName: propertyName,
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
    clearFilter: function (propertyName) {
      this.isAllFilters = true;
      this.$store.commit("blocks/clearFilter", {
        propertyName: propertyName,
        filterType: this.filterType,
      });
      this.setQueryURL();
    },

    /* filterCombobox(propertyName, item) {
      console.log("propertyName", propertyName);
      console.log("item", item);
      this.isAllFilters = false;
      this.$store.commit("blocks/toggleFilter", {
        propertyName: propertyName,
        filterType: this.filterType,
        filterItem: item,
        id: this.itemId,
      });
      this.setQueryURL();
      const target = this.$store.getters["blocks/getFilters"].filter(
        (elem) => elem.filter[0] === item
      );
      if (this.filterType === "combobox" && target.filter.length === 0) {
        this.isAllFilters = true;
      }
    }, */

    filterCombobox(propertyName, item) {
      console.log("propertyName", propertyName);
      console.log("item", item);
      // this.isAllFilters = false;
      this.$store.commit("blocks/toggleFilter", {
        propertyName: propertyName,
        filterType: this.filterType,
        filterItem: item,
        id: this.itemId,
      });
      this.setQueryURL();
      return this.$store.getters["blocks/getFilters"].filter(
        (elem) => elem.filter[0] === item
      );
    },

    setQueryURL: function () {
      window.history.replaceState(
        null,
        null,
        `?filters=${JSON.stringify(this.$store.getters["blocks/getFilters"])}`
      );
      const { url } = {
        url:
          this.$route.path +
          `?filters=${JSON.stringify(
            this.$store.getters["blocks/getFilters"]
          )}`,
      };
      this.$store.commit("menu/setQueriesUrlByIdMenu", {
        ...this.$route.params,
        url,
      });
    },
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
    // ----- фильрация по дате и времени
    filterItemsDate() {
      const block = this.$store.getters["blocks/getUnfilteredBlockById"](
        this.itemId
      );
      if (block) {
        const items = block.data.items.map((item) => item[this.propertyName]);
        const uniqueItems = this.uniqueItems || Array.from(new Set(items));
        const res = uniqueItems.map((name, item) => ({ item, name }));
        console.log(res);
        this.selected = res[0].item;
        return res;
      }
      return [];
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

.select {
  width: 20vw;
}
</style>
