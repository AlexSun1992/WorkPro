<template>
  <div class="title-conf-block">
    {{ data.label }}
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
