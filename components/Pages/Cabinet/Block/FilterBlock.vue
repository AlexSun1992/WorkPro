<template>
  <div class="test">
    <ul v-if="this.dataItems.length !== 0">
      <li propertyName v-for="(item, idx) in dataItems" :key="idx">
        <button v-on:click="revealItem(item)">
          {{ item }}
        </button>
      </li>
    </ul>
    <ul v-else>
      <li propertyName v-for="(item, idx) in dataContent" :key="idx">
        <button v-on:click="revealItem(item[propertyName])">
          {{ item[propertyName] }}
        </button>
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
      items: [],
      obj: {},
      checked: false,
    };
  },

  methods: {
    revealItem(item) {
      this.items.push(item);
      console.log(this.items);

      if (this.propertyName !== undefined) {
        this.$store.commit("blocks/setPropertyName", this.propertyName);
      }
      this.$store.commit("blocks/setFilters", item);
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

              // if (!this.dataItems.includes(this.allElements)) {
              //   this.dataItems.push(this.allElements);
              // }
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
.red {
  background-color: red;
}

li {
  list-style: none;
  cursor: pointer;
}
</style>
