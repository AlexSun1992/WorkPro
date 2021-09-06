<template>
  <b-form-group :label="data.label" :label-for="data.name" class="mb-3">
    <template #label>
      <span v-html="data.label" />
    </template>
    <div v-html="data.value" />
  </b-form-group>
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
