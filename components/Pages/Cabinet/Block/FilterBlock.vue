<template>
  <div class="test">
    <ul class="menu">
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
          v-if="this.filterType !== 'radiobutton'"
          :class="{
            'filter-checked': isAllFilters,
          }"
          v-on:click="clearFilter(propertyName)"
          >{{ AllUnits }}</b-button
        >
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "FilterBlock",

  data() {
    return {
      AllUnits: "Все",
      isAllFilters: true,
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
      type: String,
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
  },

  created() {
    if (this.$route.query.filters) {
      const filters = JSON.parse(this.$route.query.filters.toString());
      if (
        this.filterType === "checkbox" &&
        filters.find((filter) => filter.propertyName === this.propertyName)
      ) {
        this.isAllFilters = false;
      }
      this.$store.commit("blocks/setFilter", filters);
    } else {
      if (this.defaultValue) {
        this.$store.commit("blocks/setFilter", {
          propertyName: this.propertyName,
          filter: this.defaultValue,
        });
      }
    }
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
      });
      this.setQueryURL();
    },
    clearFilter: function (propertyName) {
      this.isAllFilters = true;
      this.$store.commit("blocks/clearFilter", {
        propertyName: propertyName,
        filterType: this.filterType,
      });
      this.setQueryURL();
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
  },
};
</script>

<style scoped>
.menu {
  display: flex;
}

.red {
  background-color: red;
}

li {
  list-style: none;
  cursor: pointer;
}
</style>
<style>
.cabinet .btn.btn-secondary .btn-filter-checked {
  background-color: #008b4e;
  color: white;
}
</style>
