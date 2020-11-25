<template>
  <b-form-checkbox
    v-model="fieldValue"
    :disabled="!edit ? !edit : data.readonly"
    >{{ data.label }}</b-form-checkbox
  >
</template>

<script>
export default {
  name: "ControlBoolean",
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
  computed: {
    fieldValue: {
      get: function () {
        return this.data.value;
      },
      set: function (value) {
        this.$emit("update", { fieldId: this.data.fieldId, value: value });
      },
    },
  },
};
</script>

<style scoped></style>
