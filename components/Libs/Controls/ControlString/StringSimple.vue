<template>
  <div>
    <b-form-input
      :id="data.name"
      v-model="data.value"
      class="form-control"
      :disabled="!edit ? !edit : data.readonly"
      :required="data.required"
      :state="data.state"
      type="text"
      :placeholder="data.placeholder"
      @input="updateValue($event)"
      @blur="updateValueBlur()"
    />

    <b-form-invalid-feedback :state="isState">{{
      data.error ? data.error : "Обязательно для заполнения"
    }}</b-form-invalid-feedback>
  </div>
</template>
<script>
export default {
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
    isState() {
      let state = null;
      if (this.data.state === false) {
        state = false;
      }
      if (this.data.error) {
        if (this.data.error !== null) {
          state = false;
        }
      }
      if (this.data.state) {
        state = !this.data.error;
      }
      return state;
    },
  },
  methods: {
    checkFieldName(fieldsNameHub, compareName) {
      const isAutocompleteField = fieldsNameHub.find((item) =>
        item.includes(compareName)
      );

      return Boolean(isAutocompleteField);
    },
    updateValue(val) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: val,
      });
    },
    updateValueBlur() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.data.value,
      });
    },
  },
};
</script>
