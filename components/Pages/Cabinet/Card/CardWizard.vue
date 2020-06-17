<template>
  <b-tabs v-if="wizardData" content-class="mt-3">
    <div v-for="(tab, i) in wizardData" :key="i">
      <b-tab :title="tab.name">
        <grid v-if="tab.list" :fields="tab.data.fields" :items="tab.data.items" :total="tab.data.count"></grid>
        <Form v-else :data="tab.data" :edit="editForm"></Form>
      </b-tab>
    </div>
  </b-tabs>
</template>

<script>
  import Grid from '~/components/Libs/Table/Grid'
  import Form from '~/components/Libs/Form/Form'
  export default {
    name: 'CardWizard',
    components: {Grid, Form},
    props: ['id', 'wizard'],
    data() {
      return {
        tabs: null,
        editForm: true
      }
    },
    computed: {
      wizardData() {
        return this.$store.getters['card/wizardData'];
      }
    }
  }
</script>

<style scoped>

</style>
