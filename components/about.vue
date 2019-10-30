<template>
  <div class="col-lg-6">
    <ul id="example-1">
      <li v-for="item in agencies">
        {{ item.SADDRESS }}
        <button class="btn btn-success"  v-on:click="add(item)" >Добавить</button>
      </li>
    </ul>
    <input class="form-control" v-model="test"/>
    <NLink to="/">
      Home page
    </NLink>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    async asyncData () {
      const {data} = await axios.get('/free/v2/agencies/77')
      return {agencies:data}
    },
    head: {
      title: 'About page'
    },
    data () {
      return {
        test: '123'
      };
    },
    methods: {
      add (data) {
        this.agencies.unshift(data);
      }
    },
  }
</script>
