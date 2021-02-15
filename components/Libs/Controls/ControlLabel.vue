<template>
  <div class="row">
    <div class="col-3 py-2">{{ data.label }}:</div>
    <div class="col-9 py-2">
      <b>{{ data.value }}</b>
    </div>
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
