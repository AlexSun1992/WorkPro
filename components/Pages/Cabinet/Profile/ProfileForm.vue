<template>
  <div>
    <b-modal v-if="editData" :title="editData.data.label" @cancel="cancelCard" @ok="saveCard" no-close-on-backdrop @close="cancelCard" centered v-model="editData.show">
      <card :data="editData.data" @actions="actions=$event" @update="updateNumber($event)"></card>
      <action-button class="action-button" v-if="actions" :body="body" :actions="actions" item-id="actions.NITEM" action-id="33223"/>
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
    <!-- <nuxt-link to="/cabinet/55/0/719"><b-button  type="button">test</b-button></nuxt-link> -->
  </div>
</template>

<script>
  import Form from '~/components/Libs/Form/Form'
  import Card from '~/components/Pages/Cabinet/Profile/Card/Card'
  import ActionButton from '../Block/ActionButton'
  
  export default {
    name: 'ProfileForm',
    components: {Form, Card, ActionButton},
    props: ['data', 'params'],
    data () {
      return {
        editForm: true,
        editDataForm: this.data,
        editData: null,
        actions: null,
        body: null,
        number: null,
        code: null
      }
    },
    methods: {
      setData () {
        this.editDataForm = this.data;
      },
      openEdit(e) {
        this.editData = e;
      },
      async saveCard() {
        // Перенести в actions
        let params = {
            "NUMBER": this.number,
            "CODE": this.code
        }
        try {
          // Заменить на idModule, idItem
          await this.$axios.put(`/am/main/v2/datacard/55/719/0`, params)
          .then(async resp => {
            if (resp.status == 200) {
              this.$bvToast.toast('Успешно сохранено', {
                title: ``,
                variant: 'success',
                solid: true
              })
            }
          })
        } catch (e) {
          this.$bvToast.toast('Error', {
            title: `Ошибка`,
            variant: 'danger',
            noAutoHide: true,
            solid: true
          })
        }
      },
      cancelCard() {
      },
      getCode() {
      },
      updateNumber(e) {
        if (e.length > 5) {
          this.number = e;
          this.body = {
            "sNumber": e
          }
        } else {
          this.code = e;
        }
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
  .action-button {
    position: absolute;
    right: 140px;
    bottom: 61px;
  }
</style>
