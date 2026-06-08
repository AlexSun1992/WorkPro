<template>
  <div>
    <span class="spinner-border"><span class="sr-only"></span></span>
  </div>
</template>

<script>
export default {
  name: "Loader",
  props: {
    itemId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
};
</script>
