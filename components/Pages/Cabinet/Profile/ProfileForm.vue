<template>
  <div>
    <b-modal v-if="editData" :title="editData.data.label" @cancel="cancelCard" @ok="saveCard" centered v-model="editData.show">
      <card :data="editData.data"></card>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button pill type="button" variant="success" @click="ok()">
          Сохранить
        </b-button>
        <b-button pill type="button" variant="outline-success" @click="cancel()">
          Отменить
        </b-button>
      </template>
    </b-modal>
    <Form ref="form" :data="editDataForm" @edit="openEdit($event)" :edit="editForm"></Form>
  </div>
</template>

<script>
  import Form from '~/components/Libs/Form/Form'
  import Card from '~/components/Pages/Cabinet/Profile/Card/Card'
  
  export default {
    name: 'ProfileForm',
    components: {Form, Card},
    props: ['data', 'params'],
    data () {
      return {
        editForm: true,
        editDataForm: this.data,
        editData: null
      }
    },
    methods: {
      setData () {
        this.editDataForm = this.data;
      },
      openEdit(e) {
        if (this.params.settings.isModal) {
          this.editData = e;
        } else {
          this.$emit('update', e);
        }
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
