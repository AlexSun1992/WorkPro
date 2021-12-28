<template>
  <div>
    <b-button @click="refuseChoice">{{ title }}</b-button>
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
      console.log("Начал отрабатывать метод refuseChoice");
      this.$emit("update", this.rowData.content[0]);
      // console.log(this.rowData);
    },
  },
};
</script>
