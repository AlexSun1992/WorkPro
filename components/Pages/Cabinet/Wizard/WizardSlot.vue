<template>
  <div>
    <slot name="data" v-bind:content="list">
      <div v-if="load">Загрузка...</div>
    </slot>
  </div>
</template>

<script>
  import Grid from '~/components/Libs/Table/Grid'
  export default {
    name: 'WizardList',
    components: {Grid},
    data () {
      return {
        wizardId: null,
        list: [],
        count: 10,
        load: true
      }
    },
    props: {
      wizardData: {
        type: Object,
        required: true,
        default: () => {}
      },
      moduleId: {
        type: String,
        required: true,
        default: () => ''
      }
    },
    async  fetch () {
      this.load = true
      this.wizardId = this.wizardData.idItem
      this.list = await this.$axios.$get(`/api/list/${this.moduleId}/${this.wizardId}/{}`)
      this.load = false
    }
  }
</script>

<style scoped>

</style>
