<template>
    <div class="wrapper">
      <div class="animated fadeIn">
        <b-row>
          <b-col lg="12">
            <b-card
              header-tag="header"
              footer-tag="footer">
              <div slot="header">
               {{head}}
              </div>
              <b-button class="mb-2" v-if="isList" v-on:click="refreshCardList" type="submit" variant="primary" v-b-popover.hover.top="'Обновить список'"><i  class="fa fa-refresh"></i></b-button>
              <b-button v-if="isForm && !isAddCardForEdit" v-on:click="openCardList" type="submit" variant="primary" v-b-popover.hover.top="'Перейти к списку'"><i  class="fa fa-chevron-left"></i></b-button>
              <card-form  v-if="isForm"  :data="formData" :actions="actionsData" @save-form="saveCardForm" @apply-action="applyCardActionForm"/>
              <card-filter  v-if="isFilter" :data="formData" @action-clicked="applyCardFilter"/>
              <card-list v-if="isList" :is-action="isEdit" :load="isListLoading" :data="listData"  @action-clicked="openCardForm"/>
            </b-card>
          </b-col>
        </b-row>
      </div>
    </div>
</template>

<script>

  import CardList from './CardList'
  import CardForm from './CardForm'
  import CardFilter from './CardFilter'

  export default {
    name: 'Card',
    components: {CardList, CardForm, CardFilter},
    props: {
      params: {
        type: Object,
        required: true,
        default: () => {}
      }
    },
    methods: {
      applyCardFilter (data) {
        this.$store.dispatch('card/applyFilter', data);
      },
      applyCardActionForm (data,id) {
        this.$store.dispatch('card/applyAction', {form: data, actionId: id}).then((data) => {
          this.$bvToast.toast('Успешно выполнено', {
            title: ``,
            variant: 'success',
            solid: true
          })
        }, err => {
          this.$bvToast.toast(err.MESSAGE, {
            title: `Ошибка`,
            variant: 'danger',
            noAutoHide: true,
            solid: true
          })
        });
      },
      async saveCardForm (data) {
        try {
          await this.$store.dispatch('card/saveForm', data);
          this.$bvToast.toast('Успешно сохранено', {
            title: ``,
            variant: 'success',
            solid: true
          })
        } catch(err) {
          this.$bvToast.toast(err.response.data.MESSAGE, {
            title: `Ошибка`,
            variant: 'danger',
            noAutoHide: true,
            solid: true
          })
        }

      },
      openCardForm (data) {
        this.$store.dispatch('card/fetchForm', data.data.item.ID)
      },
      openCardList () {
        this.$store.commit('card/setShowForm', false)
        this.$store.commit('card/setShowList', true)
      },
      async refreshCardList () {
        try {
          await this.$store.dispatch('card/fetchList');
          this.$bvToast.toast('Успешно  обновлено', {
            title: ``,
            variant: 'success',
            solid: true
          })
        } catch(err) {
          this.$bvToast.toast(err.response.data.MESSAGE, {
            title: `Ошибка`,
            variant: 'danger',
            noAutoHide: true,
            solid: true
          })
        }
      }
    },
    computed: {
      head () {
        return this.params.settings ? `${this.params.settings.text}` : ``
      },
      formData: {
        get: function () {
          if(this.isForm){
            return  JSON.parse(JSON.stringify(this.$store.getters['card/form']));
          }
          if(this.isFilter){
            return  JSON.parse(JSON.stringify(this.$store.getters['card/filters']));
          }
        }
      },
      listData: {
        get: function () {
          return this.$store.getters['card/list'];
        }
      },
      actionsData: {
        get: function () {
          return this.$store.getters['card/actions'];
        }
      },
      isForm: {
        get: function () {
          return this.$store.getters['card/isForm'];
        }
      },
      isFilter: {
        get: function () {
          return this.$store.getters['card/isFilter'];
        }
      },
      isList: {
        get: function () {
          return this.$store.getters['card/isList'];
        }
      },
      isFormLoading: {
        get: function () {
          return this.$store.getters['card/isFormLoading'];
        }
      },
      isListLoading: {
        get: function () {
          return this.$store.getters['card/isListLoading'];
        }
      },
      isEdit: {
        get: function () {
          return this.$store.getters['card/isEdit'];
        }
      },
      isAddCardForEdit: {
        get: function () {
          return this.$store.getters['card/componentType'] === 10;
        }
      },
      isActions: {
        get: function () {
          return this.$store.getters['card/componentType'] === 10 && this.$store.getters['card/actions'];
        }
      }
    }
  }
</script>

