<template>
  <div>
    <b-form-checkbox
      v-model="fieldValue"
      :state="data.state"
      :disabled="!edit ? !edit : data.readonly"
    >
      <span v-html="data.label"></span>
      <b-form-invalid-feedback :state="data.state"
        >Необходимо указать этот параметр</b-form-invalid-feedback
      >
    </b-form-checkbox>
  </div>
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
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: value,
        });
      },
    },
  },
};
</script>

<style scoped></style>
