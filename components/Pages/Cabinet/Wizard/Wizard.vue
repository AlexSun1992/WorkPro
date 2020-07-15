<template>
  <div>
      <wizard-card v-if="isForm"/>
      <v-runtime-template v-if="!isForm" :template="templateData"></v-runtime-template>
  </div>
</template>

<script>
  import WizardList from './WizardList'
  import WizardCard from './WizardCard'
  import NotifyBlock from '../Block/NotifyBlock'
  import OfferBlock from '../Block/OfferBlock'
  import PolicyBlock from '../Block/PolicyBlock'
  import ContentBlock from '../Block/ContentBlock'
  import ActionButton from '../Block/ActionButton'
  import Profile from '../Profile/Profile'
  import OpenCardButton from '../Block/OpenCardButton'
  import VRuntimeTemplate from "v-runtime-template";
  export default {
    name: 'Wizard',
    components: {WizardList,NotifyBlock,OfferBlock,PolicyBlock, VRuntimeTemplate, ContentBlock, ActionButton, OpenCardButton, WizardCard, Profile},
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
      },
      isForm: {
        get: function () {
          return this.$store.getters['blocks/getForm'].length
        }
      }
    }
  }
</script>

<style scoped>

</style>
