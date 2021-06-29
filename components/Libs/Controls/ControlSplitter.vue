<template>
  <div class="mt-1 mb-2">
    <p>
      <strong>
        {{ data.label }}
      </strong>
    </p>
    <hr />
  </div>
</template>

<script>
export default {
  name: "ControlSplitter",
  data() {
    return {};
  },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
};
</script>

<style></style>
