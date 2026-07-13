<template>
  <div>
    <input
      :id="componentId"
      ref="autocomplete"
      v-model="dataValue"
      :disabled="!edit ? !edit : data.readonly"
      :required="data.required"
      :class="['form-control', validClass(state)]"
      type="text"
      :placeholder="data.placeholder"
    />

    <div
      v-if="state === false"
      class="invalid-feedback"
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
    state() {
      return this.data.state;
    },
  },
  methods: {
    validClass(state) {
      if (state) {
        return "is-valid";
      }
      if (state === null) {
        return "";
      }
      return "is-invalid";
    },
  },
};
</script>
