<template>
  <div>
    <Form :data="editDataForm" @edit="openEdit($event)" @update="$emit('update', $event)" :edit="editForm"></Form>
  </div>
</template>

<script>
  import Form from '~/components/Libs/Form/Form'
  
  export default {
    name: 'CardForm',
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
      },
      openEdit() {
       
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
