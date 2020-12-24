<template>
  <b-button
    @click="$emit('update', { fieldId: data.fieldId, value: data.name })"
    class="button"
    variant="secondary"
    >{{ data.label }}</b-button
  >
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
  },
};
</script>
