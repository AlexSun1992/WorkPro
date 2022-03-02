<template>
  <div class="office-zoom-metro">
    <b-button-group>
      <b-button @click="$emit('zoom', '+')" variant="office-zoom-up"></b-button>
      <b-button
        @click="$emit('zoom', '-')"
        variant="office-zoom-down"
      ></b-button>
      <b-button
        @click="$emit('zoom', '0')"
        variant="office-zoom-none"
      ></b-button>
    </b-button-group>
  </div>
</template>

<script>
import { BButtonGroup, BButton } from "bootstrap-vue";

export default {
  name: "ZoomComponent",
  components: {
    BButtonGroup,
    BButton,
  },
};
</script>

<style scoped></style>
