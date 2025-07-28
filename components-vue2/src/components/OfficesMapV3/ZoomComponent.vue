<template>
  <div class="office-zoom-metro">
    <div
      role="group"
      class="btn-group"
    >
      <button
        @click="$emit('zoom', '+')"
        type="button"
        class="btn btn-office-zoom-up"
      ></button>
      <button
        @click="$emit('zoom', '-')"
        type="button"
        class="btn btn-office-zoom-down"
      ></button>
      <button
        @click="$emit('zoom', '0')"
        type="button"
        class="btn btn-office-zoom-none"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ZoomComponent",
  components: {},
};
</script>

<style scoped></style>
