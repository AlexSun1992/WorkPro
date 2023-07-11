<template>
  <div>
    <p>{{ data.SFULLLPU_ADDRESS }}</p>
  </div>
</template>
<script>
export default {
  name: "ListRenderBaloon",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
};
</script>
