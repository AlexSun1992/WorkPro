<template>
  <div>
    <b-button
      :class="data.labelCols + ' link-button'"
      @click="$emit('open-card', data)"
      variant="secondary"
      >{{ data.label }}</b-button
    >
  </div>
</template>

<script>
export default {
  name: "ControlLink",
  data() {
    return {
      editShow: false,
    };
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

<style scoped></style>
