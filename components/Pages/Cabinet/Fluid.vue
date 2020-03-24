<template>
  <card :params="params"></card>
</template>

<script>
  import Card from '~/components/Pages/Cabinet/Card/Card'
  export default {
    name: 'Fluid',
    components: {Card},
    computed: {
      params () {
        let page = this.$route.params
        let settings = this.$store.getters['menu/breadcrumbs'].slice(-1).pop()
        return {page, settings}
      }
    }
  }
</script>

<style scoped>

</style>
