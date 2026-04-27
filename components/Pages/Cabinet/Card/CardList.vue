<template>
  <div>
    <grid
      :load="load"
      :action="isAction"
      :total="count"
      :fields="data.fields"
      :items="data.items"
    >
      <template #actions="slotProps">
        <button
          type="button"
          @click="showItem(slotProps)"
          class="btn btn-secondary btn-table-open"
        >
          Открыть
        </button>
        <button
          type="button"
          @click="deleteItem(slotProps)"
          class="btn btn-secondary mt-2 btn-table-delete"
        >
          Удалить
        </button>
      </template>
    </grid>
  </div>
</template>

<script>
import Grid from "~/components/Libs/Table/Grid";

export default {
  name: "CardList",
  components: { Grid },
  data() {
    return {
      count: 10,
    };
  },
  props: {
    load: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    isAction: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  methods: {
    showItem(record) {
      this.$emit("action-clicked", record);
    },
    deleteItem(record) {
      this.$emit("delete-item", record);
    },
  },
};
</script>

<style scoped></style>
