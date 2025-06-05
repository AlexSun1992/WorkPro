<template>
  <div>
    <div class="container-skeleton">
      <div
        class="grid-item"
        v-for="(item, index) in items"
        :key="index"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SkeletonBox",
  props: ["items"],
};
</script>
