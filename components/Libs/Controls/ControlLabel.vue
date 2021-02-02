<template>
  <div>
    <v-runtime-template
      :template="'<div>' + data.value + '</div>'"
    ></v-runtime-template>
  </div>
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
