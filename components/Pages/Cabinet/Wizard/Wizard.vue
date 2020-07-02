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
  import OpenCardButton from '../Block/OpenCardButton'
  import VRuntimeTemplate from "v-runtime-template";
  export default {
    name: 'Wizard',
    components: {WizardList,NotifyBlock,OfferBlock,PolicyBlock, VRuntimeTemplate, ContentBlock, ActionButton, OpenCardButton, WizardCard},
    props: {
      params: {
        type: Object,
        required: true,
        default: () => {}
      }
    },
    created() {
      this.$store.dispatch('card/setCard', this.params);
    },
    data() {
      return {
        fieldsArr: []
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
        this.testTabs();
        return this.params.settings.portalgrid || this.params.settings.cardgrid
      },
      isForm: {
        get: function () {
          return this.$store.getters['blocks/getForm'].length
        }
      }
    },
    methods: {
      // Удалить. Временно создал для теста табов
      testTabs() {
        let data = this.$store.getters['card/list'];
        this.fieldsArr = [];
        if (data.fields && data.fields.length) {
          data.fields.forEach(field => {
            let obj = {};
            if (data.items[0][field['key']]) {
              obj.key = field.label;
              obj.value = data.items[0][field['key']];
              this.fieldsArr.push(obj)
            } else {
              obj.key = field.label;
            }
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>
