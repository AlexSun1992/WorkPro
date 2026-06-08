<template>
  <div>
    <b-form-input
      ref="autocomplete"
      :id="componentId"
      v-model="dataValue"
      class="form-control"
      :disabled="!edit ? !edit : data.readonly"
      :required="data.required"
      :state="data.state"
      type="text"
      :placeholder="data.placeholder"
    />

    <div
      class="invalid-feedback"
      v-if="data.state === false"
    >
      {{ data.error ? data.error : "Обязательно для заполнения" }}
    </div>
  </div>
</template>

<script>
export default {
  name: "StringSimple",
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    oneToMany: {
      type: Object,
      default: () => ({}),
    },
    edit: {
      type: Boolean,
      default: false,
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
    componentId() {
      const { fieldId } = this.data;
      if (this.oneToMany?.index !== undefined) {
        return `${this.data.name}-${fieldId}-${this.oneToMany.index}`;
      }
      return `${fieldId}-${this.data.name}`;
    },
  },
};
</script>
