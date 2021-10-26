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
            'filter-checked': isFilters.length === 0,
          }"
          v-on:click="clearFilter(propertyName, filterType)"
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
      activeColor: "red",
      fontSize: 30,
      isFilters: [],
      AllUnits: "Все",
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
      default: () => {},
    },
    propertyName: {
      type: String,
      required: true,
      default: () => {},
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
    const params = new URLSearchParams(window.location.search);
    const value = params.get(this.propertyName);

    if (this.defaultValue && value === null) {
      this.$store.commit("blocks/setFilter", {
        propertyName: this.propertyName,
        filter: this.defaultValue,
        className: "filter-checked",
      });
    } else {
      let value = this.$router.history.current.query[`${this.propertyName}`];
      if (value) {
        console.log(value);
        this.isFilters.push(value);
        this.$store.commit("blocks/setFilter", {
          propertyName: this.propertyName,
          filter: value.split(","),
          className: "filter-checked",
        });
      }
    }
  },

  destroyed() {
    this.clearFilter(this.propertyName, this.filterType);
  },

  methods: {
    toggleFilter(propertyName, item) {
      const r = new URLSearchParams();

      this.$store.commit("blocks/toggleFilter", {
        propertyName: propertyName,
        filterType: this.filterType,
        filterItem: item,
      });
      if (this.filterType === "radiobutton") {
        const status = this.$store.getters["blocks/getFilters"];
        const currentQuery = {};
        currentQuery[propertyName] = item;
      }

      if (this.filterType === "checkbox") {
        const status = this.$store.getters["blocks/getFilters"];
        status.forEach((item) => {
          if (propertyName === item.propertyName) {
            this.isFilters = item.filter;
          }
        });
      }
    },

    clearFilter(propertyName, filterType) {
      this.isFilters.length = 0;
      this.$store.commit("blocks/clearFilter", {
        propertyName: propertyName,
        filterType: filterType,
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
