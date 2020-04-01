<template>
  <div class="wrapper">
    <!-- <div v-html="link"></div> -->
    <a :href="link">Первая страница</a>
    <div class="animated fadeIn">
      <div class="container">
        <div class="justify-content-lg-center">
          <products
            v-if="page.products"
            :items="page.products"
          />
          <about
            v-if="page.about"
            :data="page.about"
          />
          <offers
            v-if="page.offers"
            :items="page.offers"
          />
          <banners
            v-if="page.banners"
            :items="page.banners"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Products from './LandingPage/LandingPageProducts'
  import About from './LandingPage/LandingPageAbout'
  import Offers from './LandingPage/LandingPageOffers'
  import Banners from './LandingPage/LandingPageBanners'

  const pageId = 57
  export default {
    components: {Banners, Offers, About, Products},

    data () {
      return {
        pageTitle: null,
        link: null,
        pageId: null
      }
    },

    async asyncData ({store}) {
      await store.dispatch('pages/get', pageId)
    },

    async created() {
      debugger
      const response = await this.$axios.get("http://wpress.reso.ru/wp-json/wp/v2/main/343");
      this.pageTitle = response.data.title.rendered;
      debugger
      this.link = response.data.slug;
    },

    head () {
      return {
        title: this.title,
        meta: [
          // hid is used as unique identifier. Do not use `vmid` for it as it will not work
          {hid: 'description', name: 'description', content: 'My custom description'}
        ]
      }
    },
    computed: {
      page () {
        return this.$store.getters['pages/getPageById'](pageId).data.acf
      }
    }
  }
</script>

<style scoped>

</style>

