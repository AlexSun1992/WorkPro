<template>
    <div><CardEditor :data="form" :params="settings" :edit="true"/></div>
</template>

<script>
  import CardEditor from '~/components/Libs/CardEditor/CardEditor'
  export default {
    name: 'CardPage',
    components: {CardEditor},
    async fetch ({ store, route }) {
      await store.dispatch('data_card/fetchForm',route.params)
    },
    computed: {
      form: {
        get: function () {
          return this.$store.getters['data_card/getForm']
        }
      },
      settings: {
        get: function () {
          return this.$store.getters['menu/breadcrumbs'].slice(-1).pop()
        }
      }
    },
  }
</script>

<style scoped>

</style>
