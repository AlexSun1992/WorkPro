<template>
  <div>
    <b-alert :show="true" variant="danger" class="mt-4">{{
      data.value
    }}</b-alert>
  </div>
</template>

<script>
export default {
  name: "ControlError",
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
