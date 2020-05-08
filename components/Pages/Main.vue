<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <div class="container">
        <div class="justify-content-lg-center">
          <DynamicRoutesRenderer/>
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
  import DynamicRoutesRenderer from '~/components/Libs/DynamicRoutesRenderer/DynamicRoutesRenderer'

  const pageId = 415;
  export default {
    components: {Banners, Offers, About, Products, DynamicRoutesRenderer},

    data () {
      return {
        pageId: null
      }
    },

    async asyncData ({store}) {
      await store.dispatch('pages/get', pageId)
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

