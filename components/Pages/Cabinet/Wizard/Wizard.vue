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
    components: {WizardList, NotifyBlock, OfferBlock, PolicyBlock, VRuntimeTemplate, ContentBlock},
    props: {
      params: {
        type: Object,
        required: true,
        default: () => {}
      }
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
      }
    },
    methods: {
      // Удалить. Временно создал для теста табов
      testTabs() {
        debugger
        let data = this.$store.getters['card/list'];
        this.fieldsArr = [];
        if (data.fields && data.fields.length) {
          data.fields.forEach(field => {
            if (data.items[0][field['key']]) {
              let obj = {};
              obj.key = field.label;
              obj.value = data.items[0][field['key']];
              this.fieldsArr.push(obj)
            }
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>
