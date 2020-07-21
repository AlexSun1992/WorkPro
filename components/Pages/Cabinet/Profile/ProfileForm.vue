<template>
  <div>
    <b-modal v-if="modalData" :title="modalData.data.label" @cancel="cancelCard" @ok="saveCard" centered v-model="modalData.show">
      <modal :data="modalData.data"></modal>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button pill type="button" variant="success" @click="ok()">
          Сохранить
        </b-button>
        <b-button pill type="button" variant="outline-success" @click="cancel()">
          Отменить
        </b-button>
      </template>
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
    props: ['data'],
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
      saveCard() {

      },
      cancelCard() {

      },
      getCode() {

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
