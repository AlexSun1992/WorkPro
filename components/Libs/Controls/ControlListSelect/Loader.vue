<template>
  <div>
    <span class="spinner-border"><span class="sr-only"></span></span>
  </div>
</template>

<script>
export default {
  name: "loader",
  data() {
    return {};
  },
  props: {
    itemId: {
      type: Number,
    },
  },
};
</script>
