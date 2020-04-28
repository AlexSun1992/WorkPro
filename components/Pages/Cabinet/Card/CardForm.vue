<template>
  <div>
    <Form   :data="editDataForm" :edit="editForm"></Form>
    <p class="mb-10 mt-3"></p>
    <b-button-group  class="mr-1">
      <button v-if="!isActions" v-on:click="saveForm" type="button" class="btn btn-primary">Сохранить</button>
      <b-dropdown v-if="isActions" id="ddown-left" variant="primary" text="Действия" class="mr-1">
        <b-dropdown-item-button v-for='(item, index) in actions' :key='index'  v-on:click="applyAction(item)">{{item.label}}</b-dropdown-item-button>
      </b-dropdown>
    </b-button-group>
  </div>
</template>

<script>
  import Form from '~/components/Libs/Form/Form'
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
    name: 'CardForm',
    data () {
      return {
        editForm: true,
        editDataForm: this.data
      }
    },
    watch: {
      'data': 'setData'
    },
    methods: {
      setData () {
        this.editDataForm = this.data
      },
      saveForm () {
        if(validateData(this.editDataForm)){
          this.$emit('save-form',this.editDataForm)
        }
      },
      applyAction (data) {
        if(validateData(this.editDataForm)){
          this.$emit('apply-action',this.editDataForm, data.id)
        }
      }
    },
    components: {Form},
    props: {
      data: {
        type: Array,
        required: true,
        default: () => []
      },
      actions: {
        type: Array,
        required: true,
        default: () => []
      }
    },
    computed: {
      isActions () {
        return this.actions.length
      },
    }
  }
</script>

<style scoped>

</style>
