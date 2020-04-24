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
              <Form  v-if="isForm || isFilter" :data="formData" :edit="editForm"></Form>
              <!--<grid  v-if="showGrid" :load="load" :total="count" :fields="data.fields" :items="data.items" @action-clicked="showItem"></grid>-->
            </b-card>
          </b-col>
        </b-row>
      </div>
    </div>
</template>

<script>

  import Grid from '~/components/Libs/Table/Grid'
  import Form from '~/components/Libs/Form/Form'
  import Vue from 'vue'

  export default {
    name: 'Card',
    components: {Grid, Form},
    data () {
      return {
        editForm: true
      }
    },
    props: {
      params: {
        type: Object,
        required: true,
        default: () => {}
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
      isForm: {
        get: function () {
          return this.$store.getters['card/isForm'];
        }
      },
      isFilter: {
        get: function () {
          return this.$store.getters['card/isFilter'];
        }
      }
    }
  }
</script>

