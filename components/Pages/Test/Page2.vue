<template>
  <div style="text-align: center;">
    <span style="font-size: xx-large;">{{ pageTitle }}</span>
    <br>
    <a :href="link" v-if="link">{{ decodeURIComponent(link) }}</a>
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

    async created() {
      const structure = await axios.get("http://wpress.reso.ru/wp-json/wp/v2/url?slug=calculators");
      const pageId = structure.data[0].id;

      let responseTitle = await axios.get(`http://wpress.reso.ru/wp-json/wp/v2/main?url=${pageId}`);
      this.pageTitle = responseTitle.data[0].title.rendered;

      let responseLink = await axios.get("http://wpress.reso.ru/wp-json/wp/v2/main/343");
      this.link = responseLink.data.slug;
    }
  }
</script>
