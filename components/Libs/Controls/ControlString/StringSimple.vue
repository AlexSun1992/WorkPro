<template>
  <div>
    <b-form-input
      ref="autocomplete"
      :id="data.name"
      v-model="dataValue"
      class="form-control"
      :disabled="!edit ? !edit : data.readonly"
      :required="data.required"
      :state="state"
      type="text"
      :placeholder="data.placeholder"
    />

    <b-form-invalid-feedback :state="state">
      {{ data.error ? data.error : "Обязательно для заполнения" }}
    </b-form-invalid-feedback>
  </div>
</template>
<script>
export default {
  name: "StringSimple",
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
  data() {
    return {
      isValidationError: false,
    };
  },
  computed: {
    dataValue: {
      set(val) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: val.trim(),
        });
      },
      get() {
        return this.data.value;
      },
    },
    state() {
      return this.data.state;
    },
  },
};
</script>
