<template>
  <div>
    <ul v-if="this.dataItems.length !== 0">
      <li
        distinctItems
        propertyName
        v-for="(item, idx) in dataItems"
        :key="idx"
      >
        <button @click="revealItem(item)">
          {{ item }}
        </button>
      </li>
    </ul>

    <ul v-else>
      <li
        distinctItems
        propertyName
        v-for="(item, idx) in dataContent"
        :key="idx"
      >
        <button @click="revealItem(item[propertyName])">
          {{ item[propertyName] }}
        </button>
      </li>
      <div>
        <button>Все</button>
      </div>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FilterBlock",
  props: {
    propertyName: {
      type: String,
      default: undefined,
    },
    distinctItems: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      dataItems: [],
    };
  },

  computed: {
    dataContent: {
      get() {
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

          return group;
        }
        return {};
      },
    },
  },

  methods: {
    revealItem(item) {
      if (this.propertyName !== undefined) {
        this.$store.commit("blocks/setPropertyName", this.propertyName);
      }
      this.$store.commit("blocks/setFilters", item);
    },
  },
};
</script>

<style scoped>
li {
  list-style: none;
  cursor: pointer;
}
</style>
