<template>
  <div>
    <div class="mt-4 alert alert-danger">
      {{ data.value }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ControlError",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  setup() {
    return {};
  },
};
</script>

<style scoped></style>
