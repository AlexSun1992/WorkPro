<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col lg="12">
          <b-card>
            <div
              v-html="content"
            />
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    async asyncData () {
      const {data} = await axios.get('http://192.168.200.89:8080/wp-json/wp/v2/posts/14')
      return {content:data.content.rendered}
    },
    head: {
      title: 'О компании'
    }
  }
</script>

<style scoped>

</style>

