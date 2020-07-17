<template>
  <div>
    <Form :data="editDataForm" @modal="openModal($event)" :edit="editForm"></Form>
  </div>
</template>

<script>
  import Form from '~/components/Libs/Form/Form'
  
  export default {
    name: 'ModalForm',
    components: {Form},
    props: {
      data: {
        type: Array,
        required: true,
        default: () => []
      }
    },
    data () {
      return {
        editForm: true,
        editDataForm: this.data
      }
    },
    methods: {
      setData () {
        this.editDataForm = this.data;
      }
    },
    watch: {
      'data': 'setData'
    }
  }
</script>

<style scoped>
  .modal-content {
    min-height: 500px;
  }
</style>
