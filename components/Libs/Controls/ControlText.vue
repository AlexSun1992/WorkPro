<template>
  <b-form-group
    :label="label"
    :label-for="data.name"
    :label-cols="data.labelCols ? '' : 2"
    :label-class="data.labelCols"
  >
    <b-form-textarea
      id="textarea1"
      v-model="fieldValue"
      :disabled="!edit ? !edit : data.readonly"
      :state="data.state"
      placeholder="Введите текст"
      :rows="3"
      :max-rows="6"
    >
    </b-form-textarea>
    <b-form-invalid-feedback>
      Обязательно для заполнения
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
export default {
  name: "ControlText",
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
    label() {
      return this.data.label;
    },
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

<style scoped>
/* .form-control:disabled, .form-control[readonly]{
    background-color: white;
  } */
</style>
