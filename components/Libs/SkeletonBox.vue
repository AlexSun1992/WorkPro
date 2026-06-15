<template>
  <div>
    <div class="container-skeleton">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="grid-item"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SkeletonBox",
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>
