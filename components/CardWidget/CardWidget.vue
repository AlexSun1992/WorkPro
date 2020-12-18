<template>
  <div>{{ data }}</div>
</template>

<script>
import STORES from "@/store/stores.json";
export default {
  name: "CardWidget",
  props: {
    widgetId: {
      type: Number,
      required: true,
      default: () => 0,
    },
  },
  mounted() {
    this.$store.dispatch(`${this.store}/fetchData`);
  },
  computed: {
    store() {
      return STORES[this.widgetId];
    },
    data: function () {
      return this.$store.getters[`${this.store}/getData`];
    },
  },
};
</script>

<style scoped></style>
