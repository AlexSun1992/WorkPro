<template>
  <div>
    <b-modal v-if="editData" :title="editData.data.label" @cancel="cancelCard" @ok="saveCard" no-close-on-backdrop @close="cancelCard" centered v-model="editData.show">
      <card :data="editData.data" @actions="actions=$event" @update="updateNumber($event)"></card>
      <action-button :disabled="noPhone" class="w-100" v-if="actions" :body="body" :actions="actions" item-id="actions.NITEM" action-id="33223"/>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button :disabled="(noCode || noPhone) && noEmail" pill type="button" variant="success" @click="ok()">
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
        cardId: null,
        body: null,
        number: null,
        code: null,
        email: null,
        noPhone: true,
        noCode: true,
        noEmail: true,
      }
    },
    methods: {
      setData () {
        this.editDataForm = this.data;
      },
      openEdit(e) {
        this.editData = e;
        this.cardId = this.editData.data.name.split('Card')[1];
      },
      async saveCard() {
        let params = {
          "idItem": this.cardId
        };
        if (this.cardId == 719) {
          params['NUMBER'] = this.number;
          params['CODE'] = this.code
        }
        else if (this.cardId == 718) {
          params['NEWEMAIL'] = this.email;
        }
        let resp = await this.$store.dispatch('card/editCard', params);
        if (resp.status == 200) {
          this.$emit('saved');
          this.$emit('field-changed');
        }
        else {
          this.$emit('error');
        }
      },
      cancelCard() {
        this.noPhone = true;
        this.noCode = true;
        this.noEmail = true;
        this.phone = null;
        this.code = null;
        this.email = null;
      },
      updateNumber(e) {
        if (e.name === 'SNEWPHONE') {
          this.number = e.value;
          this.body = {
            "sNumber": e.value
          }
        } else if (e.name === 'SCODEFIELD') {
          this.code = e.value;
        } else if (e.name === 'SNEWEMAIL') {
          this.email = e.value;
        }
      }
    },
    watch: {
      'data': 'setData',
      number(val) {
        const reg = /^[0-9]{10}$/;
        this.noPhone = !reg.test(val);
      },
      code(val) {
        const reg = /^[0-9]{4}$/;
        this.noCode = !reg.test(val);
      },
      email(val) {
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        this.noEmail = !reg.test(val);
      }
    }
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
