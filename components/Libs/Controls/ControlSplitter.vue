<template>
  <div>
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
