<template>
  <div>
    <b-button v-if="!params.settings" v-on:click="$router.go(-1)" type="submit" variant="success"><i class="fa fa-chevron-left"></i> Назад</b-button>
    <Form  v-if="data.length" :data="data" @update="updateValue($event)" @clear="clearRelation($event)" @open-card="openCard($event)" :edit="edit"></Form>
    <SkeletonBox v-else class="mt-5" :items="8"></SkeletonBox>
     <div class="mt-3 row button-container">
      <div class="col-12" v-if="edit">
        <b-button pill v-on:click="saveDataCard" type="button" variant="success" class="col-12 col-md-auto mr-4" :style="isButtonDisabled">Сохранить</b-button>
        <b-button pill v-on:click="cancelDataCard" type="button" variant="outline-success" class="col-12 col-md-auto mt-2 mt-md-0" :style="isButtonDisabled">Отменить</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import Form from '~/components/Libs/Form/Form'
import ActionButton from '~/components/Pages/Cabinet/Block/ActionButton'
import SkeletonBox from '~/components/Libs/SkeletonBox'
export default {
  name: 'CardEditor',
  components: { Form, ActionButton, SkeletonBox },
  data () {
    return {
      invalidFields: [],
      body: null,
      disabledButtons: {
        background: '#dddbdd',
        boxShadow: 'none',
        border: 'none',
        color: '#dddbdd'
      }
    }
  },
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
    }
  },
  destroyed () {
    this.$store.commit('data_card/cardChanged', false)
    this.$store.commit('data_card/setError', false)
  },
  methods: {
    async updateValue (e) {
      this.$store.commit('data_card/cardChanged', true)
      if (e.SCONST) {
        const form = this.$store.getters['data_card/getForm']
        await this.$store.dispatch('data_card/executeAction', { actionId: e.ID, rowId: 0, itemId: e.NITEM, body: form })
        return
      }
      this.$store.commit('data_card/setFormField', { fieldId: e.fieldId, value: e.value })
    },
    clearRelation (e) {
      this.$store.commit('data_card/clearFormRelationField', { fieldName: e.fieldName })
    },
    openCard (e) {
      const flatmenu = this.$store.getters['menu/flatmenu']
      const menuItem = flatmenu.find(item => {
        return item.SNAME == e.label
      })
      $nuxt._router.push(`/cabinet/${this.params.page.idModule}/0/${menuItem.IDITEM}/0`)
    },
    validateData (data) {
      let valid = true
      for (let i = 0; i < data.length; i++) {
        const value = data[i].type === 'enum' ? data[i].value.value : data[i].value
        data[i].checked = true
        if (data[i].required && !value && data[i].type !== 'boolean') {
          valid = false
        }
      }
      return valid
    },
    async saveDataCard () {
      this.$store.commit('data_card/cardChanged', false)
      this.$store.commit('data_card/saveButtonClicked', true)
      this.$store.commit('data_card/filterFields')
      const fields = this.$store.getters['data_card/getForm']
      if (this.validateData(fields)) {
        try {
          let itemId
          let moduleId
          let cardId
          if (!this.params.page) {
            itemId = this.$route.params.idItem
            moduleId = this.$route.params.idModule
            cardId = this.$route.params.idCard
          } else {
            itemId = this.params.page.idItem
            moduleId = this.params.page.idModule
            cardId = this.$store.getters['data_card/getCardId']
          }
          await this.$store.dispatch('data_card/saveDataCard', { moduleId, itemId, cardId, form: fields })
          if (this.$route.params.idItem == '710') {
            await this.$store.dispatch('updateUser')
          }
          this.$bvToast.toast('Успешно сохранено', {
            title: '',
            variant: 'success',
            solid: true
          })
        } catch (err) {
          this.$bvToast.toast(err.response.data.MESSAGE, {
            title: 'Ошибка',
            variant: 'danger',
            noAutoHide: true,
            solid: true
          })
        }
      }
    },
    cancelDataCard () {
      this.$store.commit('data_card/cardChanged', false)
      this.$store.commit('data_card/setForm', JSON.parse(JSON.stringify(this.$store.getters['data_card/getCopyForm'])))
    }
  },
  computed: {
    isButtonDisabled () {
      if (!this.data.length) {
        return this.disabledButtons
      }
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
