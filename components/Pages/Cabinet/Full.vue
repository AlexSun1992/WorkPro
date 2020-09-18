<template>
  <div>
    <nuxt-child />
  </div>
</template>

<script>
  export default {
    middleware: 'guest',
    layout: 'DemoLayout',
    name: 'Full',
    async fetch ({ store, route }) {
      await store.dispatch('menu/fetchMenu', route.params)
      const setting =  store.getters['menu/breadcrumbs'].slice(-1).pop()
      if(setting.isCard){
        await store.dispatch('card/setCard', {page: route.params, settings: setting});
      }
    }
  }
</script>

<style scoped>

</style>
