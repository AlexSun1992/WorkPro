<template>
  <div>
    <Form :data="data" @update="updateValue($event)" @clear="clearRelation($event)" :edit="edit"></Form>
  </div>
</template>

<script>
  import Form from '~/components/Libs/Form/Form'
  export default {
    name: 'CardEditor',
    components: {Form},
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
      },
      clearRelation(e) {
      },
    },
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
