<template>
  <div>
    <v-runtime-template v-if="templateData" :template="templateData"></v-runtime-template>
    <b-card v-else class="bg-six block border-block-one">
      <b-button v-on:click="destroyForm" type="submit" variant="primary" v-b-popover.hover.top="'Назад'"><i  class="fa fa-chevron-left"></i></b-button>
      <Form   :data="editDataForm" :edit="isEdit"></Form>
      <p class="mb-10 mt-3"></p>
      <button v-if="isEdit"  v-on:click="saveForm" type="button" class="btn btn-primary">Сохранить</button>
    </b-card>
  </div>
</template>

<script>
  import Form from '~/components/Libs/Form/Form'
  import VRuntimeTemplate from "v-runtime-template";
  const validateData = (data) => {
    let valid = true
    for (let i = 0; i < data.length; i++) {
      let value = data[i].type === 'enum' ? data[i].value.value : data[i].value
      data[i].checked = true
      if (data[i].required && !value && data[i].type !== 'boolean') {
        data[i].state = false
        valid = false
      }
    }
    return valid
  }
  export default {
    name: 'WizardList',
    components: {Form,VRuntimeTemplate},
    props: {
      templateData: {
        type: String,
        required: false,
        default: () => null
      },
      formData: {
        type: Array,
        required: true,
        default: () => []
      },
      moduleId: {
        type: String,
        required: false,
        default: () => null
      },
      itemId: {
        type: String,
        required: false,
        default: () => null
      },
      isEdit: {
        type: Boolean,
        default: () => false
      },
    },
    data () {
      return {
        editDataForm: this.formData
      }
    },
    watch: {
      'formData': 'setData'
    },
    methods: {
      setData () {
        this.editDataForm = this.formData;
      },
      destroyForm () {
        this.$store.dispatch('blocks/destroyForm');
      },
      async saveForm () {
        try {
          if(validateData(this.editDataForm)){
            await this.$store.dispatch('blocks/saveForm', {moduleId:this.moduleId, form: this.editDataForm});
            this.$bvToast.toast('Успешно сохранено', {
              title: ``,
              variant: 'success',
              solid: true
            })
          }
        } catch(err) {
          this.$bvToast.toast(err.response.data.MESSAGE, {
            title: `Ошибка`,
            variant: 'danger',
            noAutoHide: true,
            solid: true
          })
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
