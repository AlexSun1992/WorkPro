<template>
  <b-form-group :label="data.label" :label-for="data.name" class="mb-3">
    <div>{{ data.value }}</div>
  </b-form-group>
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
