<template>
  <div class="container">
    <div>
      <b-button-group>
        <b-button @click="$emit('zoom', '+')" variant="success">+</b-button>
        <b-button @click="$emit('zoom', '0')" variant="primary">0</b-button>
        <b-button @click="$emit('zoom', '-')" variant="info">-</b-button>
      </b-button-group>
    </div>
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
