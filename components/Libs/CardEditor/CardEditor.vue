<template>
  <div>
    <Form :data="data" @update="updateValue($event)" @clear="clearRelation($event)" :edit="edit"></Form>
     <div class="mt-3 row button-container">
      <div class="col-12">
        <b-button pill v-on:click="saveDataCard" type="button" variant="success" class="col-12 col-md-auto mr-4">Сохранить</b-button>
        <b-button pill v-on:click="cancelDataCard" type="button" variant="outline-success" class="col-12 col-md-auto mt-2 mt-md-0">Отменить</b-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Form from '~/components/Libs/Form/Form'
  export default {
    name: 'CardEditor',
    components: {Form},
    data() {
      return {
        invalidFields: []
      }
    },
    props: {
      params: {
        type: Object,
        required: true,
        default: () => {}
      },
      data: {
        type: Array,
        required: true,
        default: () => []
      },
      edit: {
        type: Boolean,
        required: false,
        default: () => true
      },
    },
    methods: {
      updateValue(e) {
        this.$store.commit('data_card/setFormField', {fieldId: e.fieldId, value: e.value});
      },
      clearRelation(e) {
        this.$store.commit('data_card/clearFormRelationField', {fieldName:this.data.name});
      },
      validateData(data) {
        this.invalidFields.length = 0;
        let valid = true
        for (let i = 0; i < data.length; i++) {
          let value = data[i].type === 'enum' ? data[i].value.value : data[i].value
          data[i].checked = true
          if (data[i].required && !value && data[i].type !== 'boolean') {
            data[i].state = false;
            valid = false;
            this.invalidFields.push(data[i]);
          }
        }
        return valid;
      },
      async saveDataCard() {
        let data = JSON.parse(JSON.stringify(this.$store.getters['data_card/getForm']))
        if(this.validateData(data)){
          try {
            let fields = this.$store.getters['data_card/getForm'];
            await this.$store.dispatch('data_card/saveDataCard', {moduleId: this.params.page.idModule, itemId: this.params.page.idItem,  form: fields});
            this.$bvToast.toast('Успешно сохранено', {
              title: ``,
              variant: 'success',
              solid: true
            })
          } catch(err) {
            this.$bvToast.toast(err.response.data.MESSAGE, {
              title: `Ошибка`,
              variant: 'danger',
              noAutoHide: true,
              solid: true
            })
          }
        }
      },
      cancelDataCard(e) {
        this.$emit('cancel');
      }
    }
  }
</script>

<style scoped>
  .modal-content {
    min-height: 500px;
  }
  .action-button {
    position: absolute;
    right: 220px;
    bottom: 65px;
  }

</style>
