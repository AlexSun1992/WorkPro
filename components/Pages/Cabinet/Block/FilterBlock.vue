<template>
  <div class="filterBlock">
    <ul>
      <li propertyName v-for="(item, idx) in group" :key="idx">
        <button v-on:click="revealItem(item)">{{ item }}</button>
      </li>
      <div><button v-on:click="showAll">Все</button></div>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FilterBlock",
  props: ["group", "propertyName"],

  data() {
    return {
      item: "",
    };
  },

  methods: {
    revealItem(item) {
      this.$store.commit("blocks/setFilters", item, this.propertyName);
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
