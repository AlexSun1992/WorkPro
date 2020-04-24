<template>
  <div>
    <grid  :load="load" :total="count" :fields="data.fields" :items="data.items"/>
  </div>
</template>

<script>
  import Grid from '~/components/Libs/Table/Grid'
  export default {
    name: 'CardList',
    components: {Grid},
    data () {
      return {
        load: false,
        count: 10
      }
    },
    props: {
      data: {
        type: Object,
        required: true,
        default: () => {}
      }
    },
  }
</script>

<style scoped>

</style>
