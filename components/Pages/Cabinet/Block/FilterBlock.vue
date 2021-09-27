<template>
  <div class="filterBlock">
    <ul>
      <li
        distinctItems
        propertyName
        v-for="(item, idx) in distinctItems"
        :key="idx"
      >
        <button v-on:click="revealItem(item[propertyName])">
          {{ item[propertyName] }}
        </button>

        <!-- <input :id="idx" type="checkbox" />
        <label :for="idx">{{ item }}</label> -->
      </li>
      <div>
        <button v-on:click="showAll">Все</button>
        <!-- <input type="text">
      <label for=""></label> -->
      </div>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FilterBlock",
  props: ["propertyName", "distinctItems"],

  methods: {
    revealItem(item) {
      this.$store.commit("blocks/setFilters", item);
      this.$emit("addCount");
    },
    showAll() {
      this.$emit("changeData");
    },
  },

  created() {
    if (this.propertyName !== undefined) {
      this.$store.commit("blocks/setPropertyName", this.propertyName);
    }
  },
};
</script>

<style scoped>
li {
  list-style: none;
  cursor: pointer;
}
</style>
