<template>
  <div class="chip">
    <img
      v-if="icon"
      :src="icon"
    />
    <span>{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: "Chip",
  props: {
    icon: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
  },
};
</script>

<style scoped>
.chip {
  border-style: solid;
  border-color: var(--lgreen);
  border-radius: 100px;
  background-color: #fff;
  border-width: 1px;
  padding: 0 12px 0 8px;
  line-height: 26px;
  font-size: 1rem;
  white-space: nowrap;
}
.chip img {
  height: 20px;
  width: auto;
}
</style>
