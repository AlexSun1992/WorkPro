<template>
  <b-row>
    <b-col v-for="wizard in wizardData" :key="wizard.id" cols="12">
      <b-card :header="wizard.name" v-if="wizard.name !== 'Полисы'" >
        <b-card-text>
            <wizard-list :module-id="moduleId" :wizard-data="wizard"/>
        </b-card-text>
      </b-card>
      <div v-else>
        <v-runtime-template :template="content"></v-runtime-template>
      </div>
    </b-col>
  </b-row>
</template>

<script>
  import WizardList from './WizardList'
  import WizardSlot from './WizardSlot'
  import VRuntimeTemplate from "v-runtime-template";
  export default {
    name: 'Wizard',
    components: {WizardList,WizardSlot, VRuntimeTemplate},
    data(){
      return {
        content: '<demo-content>\n' +
        '  <template v-slot:data="{ content }">\n' +
        '    <b>{{ content.name }}</b>\n' +
        '    <i>{{ content.id }}</i>\n' +
        '  </template>\n' +
        '</demo-content>'
      }
    },
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
