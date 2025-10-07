<template>
  <div>
    <b-form-input
      ref="autocomplete"
      :id="data.name"
      v-model="dataValue"
      class="form-control"
      :disabled="!edit ? !edit : data.readonly"
      :required="data.required"
      :state="isState"
      type="text"
      :placeholder="data.placeholder"
      @input="updateValue($event)"
      @blur="handleBlur($event)"
    />

    <b-form-invalid-feedback :state="isState">
      {{ data.error ? data.error : "Обязательно для заполнения" }}
    </b-form-invalid-feedback>
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
  data() {
    return {
      isValidationError: false,
    };
  },
  computed: {
    isState() {
      if (this.isValidationError) {
        return false;
      }
      return this.data.state;
    },

    dataValue: {
      set(value) {
        this.isValidationError = false;
        return value;
      },
      get() {
        return this.data?.value;
      },
    },
  },
  mounted() {},

  methods: {
    handleBlur() {
      if (Boolean(this.$refs.autocomplete.value) === false && this.data.required) {
        this.isValidationError = true;
      } else {
        this.isValidationError = false;
      }
    },
    updateValue(val) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: val,
      });
    },
  },
};
</script>
