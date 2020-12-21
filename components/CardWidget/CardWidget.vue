<template>
  <div>
    <CardEditor2 v-if="getFormData" :store="store" :data="getFormData" />
  </div>
</template>

<script>
import STORES from "@/store/stores.json";
import CardEditor2 from "~/components/Libs/CardEditor2/CardEditor2";
export default {
  name: "CardWidget",
  components: {
    CardEditor2,
  },
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
    getFormData: function () {
      return this.$store.getters[`${this.store}/getForm`];
    },
  },
};
</script>

<style scoped></style>
