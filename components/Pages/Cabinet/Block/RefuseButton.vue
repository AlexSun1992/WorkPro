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
  },
  methods: {
    refuseChoice() {
      console.log("работает!");
    },
  },
};
</script>
