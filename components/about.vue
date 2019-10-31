<template>
  <div class="col-lg-12">
    <b-table striped hover :items="items"></b-table>
    <dx-date-box
      :value="now"
      type="datetime"
    />
    <dx-data-grid
      :data-source="agencies"
      :show-borders="true"
      :allow-column-reordering="true"
      :row-alternation-enabled="true"
      :allow-column-resizing="true"
      :hover-state-enabled="true"
      :column-auto-width="true"
    />
    <NLink to="/">
      Home page
    </NLink>
  </div>
</template>

<script>
  import axios from 'axios'
  import DxDataGrid from 'devextreme-vue/data-grid';
  import { DxDateBox } from 'devextreme-vue';
  export default {
    components: {
      DxDataGrid,
      DxDateBox
    },
    async asyncData () {
      const {data} = await axios.get('/free/v2/agencies/77')
      const items = [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
        { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
        { age: 38, first_name: 'Jami', last_name: 'Carney' }
      ]
      return {agencies:data, items: items}
    },
    head: {
      title: 'About page'
    },
    data () {
      return {
        now: new Date()
      };
    },
    methods: {
      add (data) {
        this.agencies.unshift(data);
      }
    },
  }
</script>
