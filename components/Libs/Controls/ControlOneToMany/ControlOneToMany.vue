<template>
  <div>
    <div data-v-15c7079a="" class="title-conf-block mt-4">{{ data.label }}</div>
    <div
      v-for="(item, i) in data.value"
      :key="i + 'block'"
      class="conf-block mt-4"
    >
      <div :key="i + 'title'" class="title-conf-block">
        Элемент {{ i + 1 }}
        <button @click="deleteItem(i)" class="btn btn-primary">Удалить</button>
      </div>
      <form-block
        class="mt-4"
        :key="i"
        :data="item"
        :edit="edit"
        @update="updateItem($event, i)"
      />
    </div>
    <button @click="addItem" class="btn btn-primary mt-4">Добавить</button>
  </div>
</template>

<script>
export default {
  name: "ControlOneToMany",
  components: { formBlock: () => import("../../Form/Form.vue") },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    edit: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },
  methods: {
    addItem() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        value: this.data.schema,
        action: "add",
      });
    },
    updateItem(value, index) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        value: { name: this.data.name, index, value },
        action: "update",
      });
    },
    deleteItem(index) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        value: { name: this.data.name, index },
        action: "delete",
      });
    },
  },
  computed: {
    loading() {
      return this.$store.getters["data_card/getLoading"];
    },
    disabled() {
      return this.data.readonly === false;
    },
  },
};
</script>

<style>
.button {
  display: flex;
  align-items: center;
}
</style>
