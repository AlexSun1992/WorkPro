<template>
  <div>
    <v-runtime-template v-if="templateData" :template="templateData"></v-runtime-template>
    <!--<div v-if="templateData">-->
      <!--<card-viewer :params="params" label="Мой профиль" context="profile">-->
        <!--<template v-slot="slotProps">-->
          <!--<div class="sideblock">-->
            <!--<div class="sideblock__text">-->
              <!--<p>Пожалуйста, убедитесь в том, что вся информация заполнена и актуальна в настоящий момент.</p>-->
              <!--<div class="sideblock__img">-->
                <!--<img src="/img/notification-helper.svg">-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</template>-->
      <!--</card-viewer>-->
    <!--</div>-->

     <!--<div v-if="templateData">-->
      <!--<card-viewer :params="params" label="Карточка автомобиля" :edit="isEdit">-->
        <!--<template v-slot="slotProps">-->
          <!--<div class="sideblock">-->
            <!--<div class="sideblock__text">-->
              <!--<p>Пожалуйста, убедитесь в том, что вся информация заполнена и актуальна в настоящий момент.</p>-->
            <!--<div class="sideblock__img">-->
              <!--<img src="/img/notification-helper.svg">-->
            <!--</div>-->
          <!--</div>-->
          <!--</div>-->
        <!--</template>-->
      <!--</card-viewer>-->
    <!--</div>-->

    <!--<div v-if="templateData">-->
      <!--<card-viewer :params="params" label="Полис ОСАГО" :edit="isEdit">-->
        <!--<template v-slot="slotProps">-->
          <!--<div class="sideblock">-->
            <!--<div class="sideblock__text">-->
              <!--<p>Пожалуйста, убедитесь в том, что вся информация заполнена и актуальна в настоящий момент.</p>-->
              <!--<div class="sideblock__img">-->
                <!--<img src="/img/notification-helper.svg">-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</template>-->
      <!--</card-viewer>-->
    <!--</div>-->

    <b-card v-else class="bg-six block border-block-one">
      <b-button v-on:click="destroyForm" type="submit" variant="success" pill v-b-popover.hover.top="'Назад'"><i  class="fa fa-chevron-left"></i></b-button>
      <Form   :data="editDataForm" :edit="isEdit"></Form>
      <p class="mb-10 mt-3"></p>
      <b-button v-if="isEdit"  v-on:click="saveForm"  pill type="button" variant="success">
        Сохранить
      </b-button>
      <b-button  v-if="isEdit" pill type="button" variant="outline-success" @click="cancelForm()">
        Отменить
      </b-button>
    </b-card>
  </div>
</template>

<script>
  import Form from '~/components/Libs/Form/Form'
  import CardViewer from '~/components/Pages/Cabinet/CardViewer/CardViewer'
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
    components: {Form,VRuntimeTemplate, CardViewer},
    props: {
      params: {
        type: Object,
        required: true,
        default: () => {}
      },
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
        editDataForm: this.formData,
        copyDataForm: JSON.parse(JSON.stringify(this.formData))
      }
    },
    watch: {
      'formData': 'setData'
    },
    methods: {
      setData () {
        this.editDataForm = this.formData;
        this.copyDataForm = JSON.parse(JSON.stringify(this.formData));
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
      },
      cancelForm () {
        this.editDataForm = JSON.parse(JSON.stringify(this.copyDataForm));
      },
    },
  }
</script>

<style>
  .form-row {
    align-items: baseline;
  }
</style>
