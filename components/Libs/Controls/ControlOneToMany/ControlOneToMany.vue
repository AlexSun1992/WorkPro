<template>
  <div>
    <div data-v-15c7079a="" class="title-conf-block mt-4">{{ data.label }}</div>
    <div
      v-for="(item, i) in data.value"
      :key="i + 'block'"
      class="conf-block mt-4"
    >
      <div :key="i + 'title'" class="title-conf-block">
        <div class="row align-items-center justify-content-between mh-1">
          <div class="col-12 col-lg-6">
            {{ data.helpText || "Элемент" }} {{ i + 1 }}
          </div>
          <div class="col-12 text-lg-end col-lg-6 mt-lg-0 mt-3">
            <button
              @click="deleteItem(i)"
              :disabled="!editable"
              class="btn btn-primary"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
      <form-block
        class="mt-4"
        :key="i"
        :data="item"
        :edit="editable"
        @update="updateItem($event, i)"
      />
    </div>
    <button @click="addItem" :disabled="!editable" class="btn btn-primary mt-4">
      Добавить
    </button>
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
    editable() {
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
