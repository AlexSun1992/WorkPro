<template>
  <client-only placeholder="Загрузка...">
    <div>
      <wizard-card :params="params" :is-edit="isEdit" :module-id="moduleId" :item-id="itemId" :form-data="formCardData" :template-data="templateCardData" v-if="isForm"/>
      <v-runtime-template v-if="!isForm" :template="templateData"></v-runtime-template>
    </div>
  </client-only>
</template>

<script>
  import WizardList from './WizardList'
  import WizardCard from './WizardCard'
  import NotifyBlock from '../Block/NotifyBlock'
  import OfferBlock from '../Block/OfferBlock'
  import PolicyBlock from '../Block/PolicyBlock'
  import ContentBlock from '../Block/ContentBlock'
  import ActionButton from '../Block/ActionButton'
  import CardViewer from '../CardViewer/CardViewer'
  import OpenCardButton from '../Block/OpenCardButton'
  import VRuntimeTemplate from "v-runtime-template";
  export default {
    name: 'Wizard',
    components: {WizardList,NotifyBlock,OfferBlock,PolicyBlock, VRuntimeTemplate, ContentBlock, ActionButton, OpenCardButton, WizardCard, CardViewer},
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
      templateCardData () {
        return this.$store.getters['menu/getMenuById'](this.$store.getters['blocks/blockId']).SVJCARDTEMPLATE
      },
      isForm: {
        get: function () {
          return this.$store.getters['blocks/getForm']?.length
        }
      },
      formCardData: {
        get: function () {
          return JSON.parse(JSON.stringify(this.$store.getters['blocks/getForm']));
        }
      },
      isEdit: {
        get: function () {
          return this.params.settings.edit
        }
      },
      isEmptyContent: {
        get: function () {
          let block =  this.$store.getters['blocks/getBlockById'](this.itemId)
          if(block){
            return !block.data.items.length
          }
          else{
            return false
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
