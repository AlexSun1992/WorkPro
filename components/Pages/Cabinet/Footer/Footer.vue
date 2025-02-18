<template>
  <div v-html="footerHTML" />
</template>

<script>
import axios from "axios";

export default {
  name: "Footer",
  data() {
    return {
      footerHTML: null,
    };
  },

  async mounted() {},
};
</script>

<style scoped></style>
