<template>
  <div class="test">
    <ul v-if="this.dataItems.length !== 0" class="menu">
      <li propertyName v-for="(item, idx) in dataItems" :key="idx">
        <b-button v-on:click="toggleFilter(propertyName, item)">
          {{ item }}
        </b-button>
      </li>
    </ul>
    <ul v-else class="menu">
      <li propertyName v-for="(item, idx) in dataContent" :key="idx">
        <b-button v-on:click="toggleFilter(propertyName, item)">
          {{ item[propertyName] }}
        </b-button>
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
  },

  data() {
    return {
      dataItems: [],
    };
  },

  methods: {
    toggleFilter(propertyName, item) {
      this.$store.commit("blocks/toggleFilter", {
        propertyName: propertyName,
        filterItem: item,
      });

      const data = this.$store.getters["blocks/getFilters"];
      if (data) {
        console.log(data);
      }
    },
  },

  computed: {
    dataContent: {
      get: function () {
        const block = this.$store.getters["blocks/getBlockById"](712);
        if (block) {
          const group = [];
          block.data.items.forEach((item) => {
            if (!group.includes(item[this.propertyName])) {
              group.unshift(item[this.propertyName]);
            }
            if (!this.dataItems.includes(item[this.propertyName])) {
              this.dataItems.unshift(item[this.propertyName]);
            }
            return group;
          });
        } else {
          return {};
        }
      },
    },
    // isChecked() {
    //   const filters = this.$store.getters["blocks/getFilters"];
    //   const block = this.$store.getters["blocks/getBlockById"](712);
    //   if (filters.length !== 0 && block) {
    //     block.data.items.forEach((item) => {
    //       if (item[this.propertyName] === filters[0].filterItem) {
    //         return true;
    //       } else {
    //         return false;
    //       }
    //     });
    //   }
    // },
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
