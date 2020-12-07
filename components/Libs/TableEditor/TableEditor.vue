<template>
  <div>
    <TableEditorForm :data="oneToManyDataForm" />
    <grid
      :total="oneToManyDataTable.total"
      :fields="oneToManyDataTable.fields"
      :items="oneToManyDataTable.items"
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
import TableEditorForm from "@/components/Libs/TableEditor/TableEditorForm";
export default {
  name: "ArrayEditor",
  head: {
    link: [
      {
        rel: "stylesheet",
        href:
          "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css",
      },
    ],
  },
  components: { TableEditorForm, Grid },
  props: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  created() {
    this.$store.dispatch("data_card/fetchOneToManyDataTable", {
      routeParams: this.$route.params,
      id: this.id,
    });
  },
  computed: {
    oneToManyDataTable() {
      return this.$store.getters["data_card/getOneToManyDataTable"];
    },
    oneToManyDataForm() {
      return this.$store.getters["data_card/getOneToManyDataForm"];
    },
    menuParams() {
      return this.$store.getters["menu/getMenuByName"](this.name);
    },
  },
  methods: {
    showItem(record) {
      this.$store.dispatch("data_card/fetchOneToManyDataForm", {
        idModule: 55,
        idItem: this.menuParams.IDITEM,
        idCard: record.data.item.ID,
        idRel: record.data.item.REL,
      });
    },
  },
};
</script>

<style scoped></style>
