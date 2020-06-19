<template>
  <b-row>
      <slot v-for="item in dataContent.items"  name="data" v-bind:content="item"></slot>
  </b-row>
</template>

<script>
  import Grid from '~/components/Libs/Table/Grid'
  export default {
    name: 'WizardList',
    components: {Grid},
    data () {
      return {
        dataContent: {},
      }
    },
    props: {
      itemId: {
        type: String,
        required: true,
        default: () => null
      }
    },
    async  fetch () {
      this.dataContent = await this.$axios.$get(`/api/list/55/${this.itemId}/{}`)
    }
  }
</script>

<style scoped>

</style>
