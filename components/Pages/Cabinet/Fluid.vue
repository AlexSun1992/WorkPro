<template>
  <div>
    <component v-bind:is="params.component" :params="params"></component>
  </div>
</template>

<script>
  import Card from '~/components/Pages/Cabinet/Card/Card'
  import Wizard from '~/components/Pages/Cabinet/Wizard/Wizard'
  export default {
    name: 'Fluid',
    components: {Card, Wizard},
    computed: {
      params () {
        let page = this.$route.params
        let settings = this.$store.getters['menu/breadcrumbs'].slice(-1).pop()
        let component = settings.isCard ? 'Card' : 'Wizard'
        return {page, settings, component}
      }
    }
  }
</script>

<style scoped>

</style>
