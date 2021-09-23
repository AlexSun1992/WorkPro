<template>
  <div class="filterBlock">
    <ul>
      <li v-for="(item, idx) in dataDistinctName" :key="idx">
        <button v-on:click="revealItem(item)">{{ item }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FilterBlock",
  props: ["group"],

  computed: {
    dataDistinctName: {
      get: function () {
        const result = this.$store.getters["blocks/getBlockById"](712);
        if (result) {
          const dataDistinctNames = [];
          result.data.items.forEach((item) => {
            if (!dataDistinctNames.includes(item.SPRODUCTNAME)) {
              dataDistinctNames.unshift(item.SPRODUCTNAME);
            }
          });
          return dataDistinctNames;
        } else {
          return {};
        }
      },
    },
  },

  methods: {
    revealItem(item) {
      this.$store.commit("blocks/setFilters", item);

      // const result = this.$store.getters["blocks/getFilter"];
      // console.log(result);

      const block = this.$store.getters["blocks/getBlockById"](712);
      console.log(block);
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
