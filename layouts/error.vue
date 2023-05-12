<template>
  <div class="container">
    <h1>Ошибка</h1>
    <div v-if="error">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { getErrorMessage } from "@/utils/transform";

export default {
  head: {
    title: "Страница не найдена",
  },
  props: ["error"],
  layout: "ErrorLayout",
  computed: {
    errorMessage() {
      if (this.error === undefined) {
        return false;
      }
      return getErrorMessage(this.error);
    },
  },
};
</script>
