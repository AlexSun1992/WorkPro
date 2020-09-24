<template>
  <div>
    <component v-bind:is="params.component" :params="params"></component>
  </div>
</template>

<script>
  import Card from '~/components/Pages/Cabinet/Card/Card'
  import Wizard from '~/components/Pages/Cabinet/Wizard/Wizard'
  import FormPage from '~/components/Pages/FormPage'
  export default {
    name: 'Fluid',
    components: {Card, Wizard, FormPage},
    computed: {
      params () {
        let page = this.$route.params
        let settings = this.$store.getters['menu/breadcrumbs'].slice(-1).pop()
        let component;

        if (settings.isCard) {
          component = 'Card'
        } else if (settings.isForm) {
          component = 'FormPage'
        } else {
          component = 'Wizard'
        }
        return {page, settings, component}
      }
    }
  }
</script>

<style scoped>

</style>
