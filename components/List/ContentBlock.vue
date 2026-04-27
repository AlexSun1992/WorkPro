<template>
  <div>
    <div
      v-for="(item, id) in data.items"
      :key="id"
    >
      <slot
        name="data"
        :content="item"
      ></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContentBlock",
  props: {
    data: {
      type: Object,
      default: () => ({}),
      required: true,
    },
  },
};
</script>

<style scoped></style>
