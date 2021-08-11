<template>
  <div>
    <the-mask
      v-if="data.mask"
      :mask="data.mask"
      class="form-control"
      :placeholder="data.placeholder"
      :disabled="!edit ? !edit : data.readonly"
      v-bind:value="data.value"
      v-on:input="updateValue($event)"
      type="text"
      :masked="false"
    ></the-mask>
    <b-form-invalid-feedback :state="data.state"
      >Обязательно для заполнения</b-form-invalid-feedback
    >
    <p v-if="data.helpText" class="help-text">{{ data.helpText }}</p>
    <p class="error">{{ data.error }}</p>
  </div>
</template>

<script>
export default {
  name: "StringMasked",
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
    updateValue(val) {
      if (this.data.value !== val) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: val,
        });
      }
    },
  },
};
</script>
