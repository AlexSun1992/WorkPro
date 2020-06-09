<template>
  <b-row>
    <b-col v-for="wizard in wizardData" :key="wizard.id" cols="12">
      <b-card :header="wizard.name" >
        <b-card-text>
          <client-only>
            <wizard-list :module-id="moduleId" :wizard-data="wizard"/>
          </client-only>
        </b-card-text>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
  import WizardList from './WizardList'
  export default {
    name: 'Wizard',
    components: {WizardList},
    props: {
      params: {
        type: Object,
        required: true,
        default: () => {}
      }
    },
    computed: {
      wizardData () {
        return this.params.settings.wizard
      },
      moduleId () {
        return this.params.page.idModule
      }
    }
  }
</script>

<style scoped>

</style>
