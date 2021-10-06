<template>
  <div class="container">
    <div v-for="(filter, index) in filters" :key="index">
      <button class="mr-2" @click="$emit('update', filter)">
        {{ filter.text }}
      </button>
    </div>
    <button class="ml-3" @click="$emit('update', '')">Сбросить фильтры</button>
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

button {
  border: 1px solid #ccc;
  padding: 10px 30px;
  border-radius: 3px;
  cursor: pointer;
}

button:focus {
  background: #a7a0a0;
  outline: none;
}
</style>
