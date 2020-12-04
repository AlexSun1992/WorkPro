<template>
  <div>
    <grid
      :total="oneToManyData.total"
      :fields="oneToManyData.fields"
      :items="oneToManyData.items"
    >
      <template v-slot:actions="slotProps">
        <b-button v-on:click="showItem(slotProps)" class="btn btn-success"
          >Редактировать</b-button
        >
      </template>
    </grid>
  </div>
</template>

<script>
import Grid from "~/components/Libs/Table/Grid";
export default {
  name: "ArrayEditor",
  // head: {
  //   link: [
  //     {
  //       rel: "stylesheet",
  //       href:
  //         "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css",
  //     },
  //   ],
  // },
  components: { Grid },
  props: {
    id: {
      type: Number,
      required: true,
    },
    name: {
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
    params() {
      return this.$store.getters["menu/getMenuByName"](
        this.$store.getters["blocks/blockId"]
      )?.SVJCARDTEMPLATE;
    },
  },
  methods: {
    showItem(record) {
      console.log(record.data.item);
    },
  },
};
</script>

<style scoped></style>
