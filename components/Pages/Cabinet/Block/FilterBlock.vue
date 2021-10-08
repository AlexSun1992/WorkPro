<template>
  <div class="test">
    <ul class="menu">
      <li
        defaultValue
        propertyName
        v-for="item in filterItems"
        :key="item.name"
      >
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
        <b-button v-on:click="clearFilter(propertyName)">ALL</b-button>
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
      isAllChecked: true,
    };
  },

  props: {
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
    if (this.defaultValue !== undefined) {
      this.$store.commit("blocks/toggleFilter", {
        propertyName: this.propertyName,
        filterType: this.filterType,
        filterItem: this.defaultValue,
      });
    }
  },

  methods: {
    toggleFilter(propertyName, item) {
      console.log(this.isAllChecked);
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
<style>
.cabinet .btn.btn-secondary .btn-filter-checked {
  background-color: #008b4e;
  color: white;
}
</style>
