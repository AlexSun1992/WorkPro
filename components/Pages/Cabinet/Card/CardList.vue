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
export default {
  name: "CardList",
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
  data() {
    return {
      count: 10,
    };
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
