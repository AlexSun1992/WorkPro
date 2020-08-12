<template>
  <div>
    <v-runtime-template v-if="templateData" :template="templateData"></v-runtime-template>
    <b-card v-else class="bg-six block border-block-one">
      <b-button v-on:click="destroyForm" type="submit" variant="primary" v-b-popover.hover.top="'Назад'"><i  class="fa fa-chevron-left"></i></b-button>
      <Form   :data="formData" :edit="edit"></Form>
    </b-card>
  </div>
</template>

<script>
  import Form from '~/components/Libs/Form/Form'
  import VRuntimeTemplate from "v-runtime-template";
  export default {
    name: 'WizardList',
    components: {Form,VRuntimeTemplate},
    props: {
      templateData: {
        type: String,
        required: false,
        default: () => null
      },
      edit: {
        type: Boolean,
        required: false
      },
    },
    data () {
      return {
        editForm: false
      }
    },
    methods: {
      destroyForm () {
        this.$store.dispatch('blocks/destroyForm');
      },
    },
    computed: {
      formData: {
        get: function () {
          return JSON.parse(JSON.stringify(this.$store.getters['blocks/getForm']));
        }
      }
    }
  }
</script>

<style>
  .form-row {
    align-items: baseline;
  }
</style>
