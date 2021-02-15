<template>
  <b-button
    class="mt-2"
    @click="$emit('update', { fieldId: data.fieldId, value: data.name })"
    :disabled="disabled"
    variant="primary"
  >
    <div class="button">
      {{ data.label }}
      <b-spinner
        v-if="loading"
        class="ml-2"
        variant="success"
        label="Spinning"
      ></b-spinner>
    </div>
  </b-button>
</template>

<script>
export default {
  name: "ControlButton",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    store: {
      type: String,
      required: false,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    loading: {
      type: Boolean,
      required: false,
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
