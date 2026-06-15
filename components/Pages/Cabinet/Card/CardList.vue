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
          class="btn btn-secondary btn-table-open"
          @click="showItem(slotProps)"
        >
          Открыть
        </button>
        <button
          type="button"
          class="btn btn-secondary mt-2 btn-table-delete"
          @click="deleteItem(slotProps)"
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
