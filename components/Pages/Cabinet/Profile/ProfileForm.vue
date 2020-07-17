<template>
  <div>
    <Form ref="form" :data="editDataForm" :edit="editForm"></Form>
  </div>
</template>

<script>
  import Form from '~/components/Libs/Form/Form'
  
  export default {
    name: 'ProfileForm',
    components: {Form},
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
      }
    },
    props: {
      data: {
        type: Array,
        required: true,
        default: () => []
      }
    }
  }
</script>

<style scoped>

</style>
