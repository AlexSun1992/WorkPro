<template>
  <div>
    <grid
      :total="oneToManyData.total"
      :fields="oneToManyData.fields"
      :items="oneToManyData.items"
    >
    </grid>
  </div>
</template>

<script>
import Grid from "~/components/Libs/Table/Grid";
export default {
  name: "ArrayEditor",
  components: { Grid },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  created() {
    this.$store.dispatch("data_card/fetchOneToManyData", {
      routeParams: this.$route.params,
      id: this.id,
    });
  },
  computed: {
    oneToManyData() {
      return this.$store.getters["data_card/getOneToManyData"];
    },
  },
};
</script>

<style scoped></style>
