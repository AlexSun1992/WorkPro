<template>
  <div v-html="data.value" />
</template>

<script>
export default {
  name: "ControlLabel",
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
