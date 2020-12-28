<template>
  <v-runtime-template :template="data.value"></v-runtime-template>
</template>

<script>
import VRuntimeTemplate from "v-runtime-template";
export default {
  name: "ControlLabel",
  components: { VRuntimeTemplate },
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
