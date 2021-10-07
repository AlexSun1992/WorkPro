<template>
  <div class="test">
    <ul class="menu">
      <li propertyName v-for="item in filterItems" :key="item.name">
        <b-button v-on:click="toggleFilter(propertyName, item.name)">
          {{ item.name }} {{ item.isChecked }}
        </b-button>
      </li>
      <li>
        <b-button v-on:click="clearFilter(propertyName)"> ALL </b-button>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "FilterBlock",

  props: {
    propertyName: {
      type: String,
      required: true,
      default: () => {},
    },
    filterType: {
      type: String,
      default: () => "checkbox",
    },

    itemId: {
      required: true,
      default: () => null,
    },
  },

  methods: {
    toggleFilter(propertyName, item) {
      this.$store.commit("blocks/toggleFilter", {
        propertyName: propertyName,
        filterType: this.filterType,
        filterItem: item,
      });
    },
    clearFilter(propertyName) {
      this.$store.commit("blocks/clearFilter", {
        propertyName: propertyName,
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
        const uniqueItems = Array.from(new Set(items));
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
