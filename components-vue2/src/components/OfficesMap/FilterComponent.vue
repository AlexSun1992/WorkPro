<template>
  <div class="container">
    <div v-for="(filter, index) in filters" :key="index">
      <button class="mr-2 btn-success btn" @click="$emit('update', filter)">
        {{ filter.text }}
      </button>
    </div>
  </div>
</template>

<script>
import { BButton } from "bootstrap-vue";
export default {
  name: "FilterComponent",
  props: {
    filters: {
      type: Array,
    },
  },
  components: {
    BButton,
  },
};
</script>

<style scoped>
.container {
  display: flex;
}
.btn {
  cursor: pointer;
}
</style>
