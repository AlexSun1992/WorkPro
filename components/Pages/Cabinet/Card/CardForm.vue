<template>
  <div>
    <Form   :data="editDataForm" :edit="editForm"></Form>
    <p class="mb-10 mt-3"></p>
    <div class="form-group">
      <button v-on:click="saveForm" type="button" class="btn btn-primary">Отправить</button>
    </div>
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
          this.$emit('action-clicked',this.editDataForm)
        }
      }
    },
    components: {Form},
    props: {
      data: {
        type: Array,
        required: true,
        default: () => []
      }
    },
  }
</script>

<style scoped>

</style>
