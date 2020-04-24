<template>
 <nuxt-child />
</template>

<script>
  export default {
    middleware: 'guest',
    layout: 'Cabinet',
    name: 'Full',
    async fetch ({ store, route }) {
      await store.dispatch('menu/fetchMenu', route.params)
      await store.dispatch('card/setCard', {page: route.params, settings: store.getters['menu/breadcrumbs'].slice(-1).pop()});
    }
  }
</script>

<style scoped>

</style>
