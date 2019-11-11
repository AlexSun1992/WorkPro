<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col lg="12">
          <b-card v-if="isAuthenticated">
            <div><span style="color: red"><b>Вы авторизованы!</b></span> Перейти в  <NLink  to="/cabinet">личный кабинет</NLink>.</div>
          </b-card>
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
  import { mapGetters } from 'vuex';
  export default {
    async asyncData () {
      const {data} = await axios.get('http://192.168.200.89:8080/wp-json/wp/v2/posts/14')
      return {title:data.title.rendered, content:data.content.rendered}
    },
    head () {
      return {
        title: this.title,
        meta: [
          // hid is used as unique identifier. Do not use `vmid` for it as it will not work
          { hid: 'description', name: 'description', content: 'My custom description' }
        ]
      }
    },
    computed: {
      ...mapGetters(['isAuthenticated'])
    },
  }
</script>

<style scoped>

</style>

