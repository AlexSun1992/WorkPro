<template>
  <div>
    <b-modal v-if="modalData" :title="modalData.data.label" cancel-title="Отмена" centered @cancel="cancelCard" @ok="saveCard" v-model="modalData.show">
      <modal :data="modalData.data"></modal>
    </b-modal>
    <Form ref="form" :data="editDataForm" @modal="openModal($event)" :edit="editForm"></Form>
  </div>
</template>

<script>
  import Form from '~/components/Libs/Form/Form'
  import Modal from '~/components/Pages/Cabinet/Profile/Modal/Modal'
  
  export default {
    name: 'ProfileForm',
    components: {Form, Modal},
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
        editDataForm: this.data,
        modalData: null
      }
    },
    methods: {
      setData () {
        this.editDataForm = this.data;
      },
      openModal(e) {
        this.modalData = e;
      },
      saveCard() {},
      cancelCard() {}
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
