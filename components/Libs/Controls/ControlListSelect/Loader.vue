<template>
  <div>
    <b-spinner></b-spinner>
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
      required: false,
      default: () => "",
    },
  },
};
</script>
