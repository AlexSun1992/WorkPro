<template>
    <div class="wrapper">
      <div class="animated fadeIn">
        <b-row>
          <b-col lg="12">
            <b-card
              header-tag="header"
              footer-tag="footer">
              <div slot="header">
                <i class="fa fa-align-justify"></i> {{head}}
              </div>
              <card-form  v-if="isForm" :data="formData" @action-clicked="saveForm"/>
              <card-filter  v-if="isFilter" :data="formData" @action-clicked="applyFilter"/>
              <card-list v-if="isList" :data="listData"/>
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
      applyFilter (data) {
        this.$store.dispatch('card/applyFilter', data);
      },
      saveForm (data) {
        this.$store.dispatch('card/saveForm', data);
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
      }
    }
  }
</script>

