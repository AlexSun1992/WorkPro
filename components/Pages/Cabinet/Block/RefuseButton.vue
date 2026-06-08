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
  data() {
    return {};
  },
  methods: {
    refuseChoice() {
      this.$emit("update", this.rowData.content[0]);
    },
  },
};
</script>
