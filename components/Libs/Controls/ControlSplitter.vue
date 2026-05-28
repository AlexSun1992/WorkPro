<template>
  <div class="title-conf-block">
    {{ data.label }}
  </div>
</template>

<script>
export default {
  name: "ControlSplitter",
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
