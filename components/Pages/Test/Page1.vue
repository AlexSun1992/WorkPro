<template>
  <div style="text-align: center;">
    <span style="font-size: xx-large;">{{ pageTitle }}</span>
    <br>
    <div v-html="link"></div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        pageTitle: null,
        link: null,
        pageId: null
      }
    },

    async created() {
      const response = await this.$axios.get("http://wpress.reso.ru/wp-json/wp/v2/main/343");
      this.pageTitle = response.data.title.rendered;
      this.link = response.data.acf.next;
    }
  }
</script>

<style scoped>

</style>
