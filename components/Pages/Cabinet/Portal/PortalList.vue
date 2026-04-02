<template>
  <div>
    <grid
      :load="load"
      :total="count"
      :fields="list.fields"
      :items="list.items"
    >
      <template>
        <button
          type="button"
          :disabled="true"
          class="btn btn-success"
        >
          Открыть
        </button>
      </template>
    </grid>
  </div>
</template>

<script>
import Grid from "~/components/Libs/Table/Grid";

export default {
  name: "WizardList",
  components: { Grid },
  data() {
    return {
      wizardId: null,
      list: [],
      count: 10,
      load: true,
    };
  },
  props: {
    wizardData: {
      type: Object,
      required: true,
      default: () => {},
    },
    moduleId: {
      type: String,
      required: true,
      default: () => "",
    },
  },
  async fetch() {
    this.load = true;
    this.wizardId = this.wizardData.idItem;
    this.list = await this.$axios.$get(`/api/list/${this.moduleId}/${this.wizardId}/{}`);
    this.load = false;
  },
};
</script>

<style scoped></style>
