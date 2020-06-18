<template>
  <div>
    <client-only>
      <v-runtime-template :template="templateData"></v-runtime-template>
    </client-only>
  </div>
</template>

<script>
  import WizardList from './WizardList'
  import NotifyBlock from '../Block/NotifyBlock'
  import OfferBlock from '../Block/OfferBlock'
  import PolicyBlock from '../Block/PolicyBlock'
  import VRuntimeTemplate from "v-runtime-template";
  export default {
    name: 'Wizard',
    components: {WizardList,NotifyBlock,OfferBlock,PolicyBlock, VRuntimeTemplate},
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
      },
      templateData () {
        return this.params.settings.portalgrid
      }
    }
  }
</script>

<style scoped>

</style>
