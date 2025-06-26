<template>
  <div
    :id="data.fieldId"
    v-html="data.value || data.label"
  ></div>
</template>

<script>
export default {
  name: "ControlEmpty",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
};
</script>

<style scoped></style>
