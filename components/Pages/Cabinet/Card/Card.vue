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
            <Form  v-if="showForm && formData" :data="formData" :edit="formEdit" :cols="formCols" @action-clicked="showList"></Form>
            <grid  v-if="showGrid" :load="load" :total="count" :fields="data.fields" :items="data.items" @action-clicked="showItem"></grid>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>

  import Grid from '~/components/Libs/Table/Grid'
  import Form from '~/components/Libs/Form/Form'

  export default {
    name: 'Card',
    components: {Grid, Form},
    data () {
      return {
        data: {},
        count: null,
        id: null,
        showForm: false,
        showGrid: true,
        formData: null,
        formEdit: true,
        formCols: 12,
        load: false
      }
    },
    props: {
      params: {
        type: Object,
        required: true,
        default: () => {}
      }
    },
    created () {
      this.initData()
    },
    watch: {
      'params': 'initData'
    },
    methods: {
      initData () {
        if(this.params.settings){
          this.showGrid = this.params.settings.recordLoad && !this.params.settings.newRecord
          if(!this.showGrid){
            if(this.isFilter){
              this.formData = JSON.parse(JSON.stringify(this.params.settings.filters))
            }
            if(this.params.settings.newRecord){
              this.showItem(0)
            }
            this.showForm = true
          }
          if(this.showGrid){
            this.showForm = false
            this.load = true
            this.loadGrid()
          }
        }
      },
      loadGrid () {
        this.$axios({url: `/api/list/${this.params.page.idModule}/${this.params.page.idItem}`, method: 'GET'})
          .then(resp => {
            this.count = resp.data.length
            this.data = resp.data
            this.load = false
          })
          .catch(err => {
            console.log(err)
          })
      },
      showItem (record) {
        if(record === 0){
         this.id = 0
        }
        else{
          this.id = record.item.ID
        }
        this.$axios({url: `/api/card/${this.params.page.idModule}/${this.params.page.idItem}/${this.id}`, method: 'GET'})
          .then(resp => {
            this.formData = resp.data
            this.showGrid = false
            this.showForm = true
          })
          .catch(err => {
            console.log(err)
          })
      },
      showList () {
        this.showGrid = true
        this.showForm = false
      }
    },
    computed: {
      head () {
        return this.params.settings ? `${this.params.settings.text}` : ``
      },
      isFilter () {
        return this.params.settings ? this.params.settings.filters.length : false
      }
    }
  }
</script>

