<template>
  <div class="DynamicQuestionTab">
    <button class="btn" @click="$emit('action')">
      <slot />
    </button>
  </div>
</template>

<script>
export default {
  name: "DynamicQuestionTab",
  emits: ["action"],
};
</script>

<style scoped>
.DynamicQuestionTab {
  width: 10%;
  margin: 20px auto;
}
</style>
