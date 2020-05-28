<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">Страница не найдена</h1>
    <b-button variant="link" href="/">Главная страница</b-button>
  </div>
</template>

<script>
  export default {
    head: {
      title: 'Страница не найдена'
    },
    props: ['error'],
    layout: 'ErrorLayout'
  }
</script>
