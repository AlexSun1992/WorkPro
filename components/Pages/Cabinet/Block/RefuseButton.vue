<template>
  <div>
    <button
      type="button"
      class="btn btn-secondary"
      @click="refuseChoice"
    >
      {{ title }}
    </button>
  </div>
</template>

<script>
export default {
  name: "RefuseButton",
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      required: true,
      default: () => null,
    },
    rowData: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  methods: {
    refuseChoice() {
      this.$emit("update", this.rowData.content[0]);
    },
  },
};
</script>
