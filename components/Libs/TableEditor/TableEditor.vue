<template>
  <div>
    <grid
      v-if="!isFormEdit"
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
    <div v-else-if="oneToManyDataForm">
      <TableEditorForm :data="oneToManyDataForm" />
      <b-button v-on:click="applyForm()">Применить</b-button>
    </div>
  </div>
</template>

<script>
import Grid from "~/components/Libs/Table/Grid";
import TableEditorForm from "@/components/Libs/TableEditor/TableEditorForm";
export default {
  name: "ArrayEditor",
  components: { TableEditorForm, Grid },
  data() {
    return {
      isFormEdit: false,
    };
  },
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
      this.isFormEdit = true;
    },
    applyForm() {
      this.isFormEdit = false;
    },
  },
};
</script>

<style scoped></style>
