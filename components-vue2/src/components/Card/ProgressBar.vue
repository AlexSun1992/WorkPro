<template>
  <div>
    <h2>{{ name }}</h2>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    wizardRels: {
      type: Array,
      required: true,
    },
    wizardCursor: {
      type: Array || undefined,
      required: true,
    },
    wizardIDCARDS: {
      type: Array,
      required: false,
      default: null,
    },
    wizardNavigation: {
      type: Object,
      required: false,
      default: null,
    },
  },
  computed: {
    currentId() {
      return this.wizardNavigation.current?.IDCARD;
    },
    step() {
      return this.wizardCursor.find((item) => item.NITEM === this.currentId);
    },
    name() {
      return this.step?.SNAME;
    },
  },
};
</script>

<style scoped></style>
