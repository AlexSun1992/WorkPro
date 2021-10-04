<template>
  <div class="test">
    <ul v-if="this.dataItems.length !== 0" class="menu">
      <li propertyName v-for="(item, idx) in dataItems" :key="idx">
        <b-button v-on:click="revealItem(item, idx)">
          {{ item }}
        </b-button>
      </li>
    </ul>
    <ul v-else class="menu">
      <li propertyName v-for="(item, idx) in dataContent" :key="idx">
        <b-button v-on:click="revealItem(item[propertyName], idx)">
          {{ item[propertyName] }}
        </b-button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FilterBlock",
  props: ["propertyName", "distinctItems"],

  data() {
    return {
      dataItems: [],
      // items: [],
      // obj: {},
      // checked: false,
    };
  },

  methods: {
    revealItem(item, idx) {
      // console.log(item, idx);

      this.$store.commit("blocks/setFilters", {
        elementName: item,
        elementOrder: idx,
      });

      // this.items.push(item);
      // if (this.propertyName !== undefined) {
      //   this.$store.commit("blocks/setPropertyName", this.propertyName);
      // }
      // this.$store.commit("blocks/setFilters", {
      //   element: item,
      //   id: idx,
      // });
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
          });
        } else {
          return {};
        }
      },
    },
  },
  // created() {
  //   this.$store.commit("blocks/clearBlock");
  //   },
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
