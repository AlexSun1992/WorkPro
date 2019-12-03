<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <div class="container">
        <div class="row justify-content-lg-center">
          <products
            :items="products"
          />
          <about
            :data="about"
          />
          <offers
            :items="offers"
          />
          <banners
            :items="banners"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import Products from '../LandingPage/Products'
  import About from '../LandingPage/About'
  import Offers from '../LandingPage/Offers'
  import Banners from '../LandingPage/Banners'
  export default {
    components: {Banners, Offers, About, Products},
    async fetch({store}) {
      await store.dispatch("pages/get", "177")
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
      ...mapGetters(['isAuthenticated']),
      ...mapState({
        products: state => state.pages.page.products,
        about: state => state.pages.page.about,
        offers: state => state.pages.page.offers,
        banners: state => state.pages.page.banners
      })
    },
  }
</script>

<style scoped>

</style>

