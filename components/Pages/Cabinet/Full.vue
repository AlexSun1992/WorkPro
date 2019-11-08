<template>
  <nuxt-child />
</template>

<script>
  export default {
    middleware: 'guest',
    layout: 'Cabinet',
    name: 'Full'
  }
</script>

<style scoped>

</style>
