<template>
  <div class="container">
    <h1>Страница не найдена</h1>
    <b-alert :show="errorMessage" variant="danger">{{ errorMessage }}</b-alert>
    <b-button variant="link" href="/">Главная страница</b-button>
  </div>
</template>

<script>
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
      return this.error.message;
    },
  },
};
</script>
