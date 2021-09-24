<template>
  <div class="filterBlock">
    <ul>
      <li v-for="(item, idx) in group" :key="idx">
        <button v-on:click="revealItem(item)">{{ item }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FilterBlock",
  props: ["group"],

  methods: {
    revealItem(item, idx) {
      this.$store.commit("blocks/setFilters", item);
      this.$emit("addCount");
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
