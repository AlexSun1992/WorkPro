<template>
  <b-tabs v-if="wizardData" content-class="mt-3">
    <div v-for="(item, i) in wizardData" :key="i">
      <b-tab :title="item.name">
        <grid v-if="item.list" :fields="item.data.fields" :items="item.data.items" :total="item.data.count"></grid>
        <b-tabs v-if="!item.list" content-class="mt-3">
          <div v-for="(item, i) in item.data" :key="i">
            <b-tab :title="item.title">
              <Form :data="item.data" :edit="editForm"></Form>
            </b-tab>
          </div>
        </b-tabs>
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