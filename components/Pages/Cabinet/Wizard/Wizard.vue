<template>
  <div>
      <v-runtime-template :template="templateData"></v-runtime-template>
  </div>
</template>

<script>
  import WizardList from './WizardList'
  import NotifyBlock from '../Block/NotifyBlock'
  import OfferBlock from '../Block/OfferBlock'
  import PolicyBlock from '../Block/PolicyBlock'
  import ContentBlock from '../Block/ContentBlock'
  import VRuntimeTemplate from "v-runtime-template";
  export default {
    name: 'Wizard',
    components: {WizardList,NotifyBlock,OfferBlock,PolicyBlock, VRuntimeTemplate, ContentBlock},
    props: {
      params: {
        type: Object,
        required: true,
        default: () => {}
      }
    },
    computed: {
      name () {
        return this.params.settings.text
      },
      wizardData () {
        return this.params.settings.wizard
      },
      moduleId () {
        return this.params.page.idModule
      },
      itemId () {
        return this.params.page.idItem
      },
      templateData () {
        return this.params.settings.portalgrid || this.params.settings.cardgrid
      }
    }
  }
</script>

<style scoped>

</style>
