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
            <grid  :load="load" :total="count" :fields="data.fields" :items="data.items"></grid>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>

  import Grid from '~/components/Libs/Table/Grid'

  export default {
    name: 'Card',
    components: {Grid},
    data () {
      return {
        data: {},
        count: null,
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
      this.loadData()
    },
    watch: {
      'params': 'loadData'
    },
    methods: {
      loadData () {
        this.load = true
        this.$axios({url: `/api/list/${this.params.page.idModule}/${this.params.page.idItem}`, method: 'GET'})
          .then(resp => {
            this.count = resp.data.length
            this.data = resp.data
            this.load = false
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    computed: {
      head () {
        return this.params.settings ? `${this.params.settings.text}` : ``
      }
    }
  }
</script>

