<template>
  <div>
    <Form :data="editDataForm" :edit="editForm"></Form>
    <div class="form-group">
      <button v-on:click="applyFilter" type="button" class="btn btn-primary">
        Применить
      </button>
    </div>
  </div>
</template>

<script>
import Form from "~/components/Libs/Form/Form";
export default {
  name: "CardFilter",
  data() {
    return {
      editForm: true,
      editDataForm: this.data,
    };
  },
  watch: {
    data: "setData",
  },
  methods: {
    setData() {
      this.editDataForm = this.data;
    },
    applyFilter() {
      this.$emit("action-clicked", this.editDataForm);
    },
  },
  components: { Form },
  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
};
</script>

<style scoped></style>
