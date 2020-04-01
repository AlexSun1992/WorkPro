<template>
  <div style="text-align: center;">
    <span style="font-size: xx-large;">{{ pageTitle }}</span>
    <br>
    <nuxt-link to="/page1">Переход на 1 страницу</nuxt-link>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        pageTitle: null,
        link: null
      }
    },

    async beforeRouteEnter(to, from, next) {
      const structure = await axios.get("http://wpress.reso.ru/wp-json/wp/v2/url?slug=calculators");
      const pageId = structure.data[0].id;
      axios.get(`http://wpress.reso.ru/wp-json/wp/v2/main?url=${pageId}`).then(response => {
        next(vm => {
          vm.pageTitle = response.data[0].title.rendered;
          vm.link = response.data[0].acf.next;
        });
      }) 
    }
  }
</script>
