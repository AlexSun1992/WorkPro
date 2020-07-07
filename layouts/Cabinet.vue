<template>
    <div class="app">
      <Header/>
      <div class="app-body">
        <Sidebar  :navItems="nav"/>
        <main class="main">
          <b-breadcrumb :items="items"/>
          <div class="container-fluid">
            <nuxt/>
          </div>
        </main>
      </div>
      <Footer/>
    </div>
</template>
<script>
  import Header from '~/components/Header/Header'
  import Footer from '~/components/Footer'
  import Sidebar from '~/components/Sidebar/Sidebar'
  import breadcrumbs from '~/converters/breadcrumbs'

  export default {
    name: 'full',
    head: {
      title: 'РЕСО-Гарантия'
    },
    components: {
      Header,
      Sidebar,
      Footer
    },
    mounted () {
      // this.$store.dispatch('menu/fetchMenu', this.$route.params)
    },
    watch: {
      $route(to, from) {
        if(to.meta === 'Cabinet'){
          this.setParams();
        }else{
          let url;
          if (to.path === '/') {
            url = 'index'
          }
          this.$store.dispatch('pages/fetchPageByUrl', url);
        }
      }
    },
    methods: {
       setParams  () {
        const bc = breadcrumbs.getData(this.$store.getters['menu/menu'], this.$route.params)
        this.$store.commit('menu/setBreadcrumbs', bc)
        this.$store.dispatch('card/setCard', {page: this.$route.params, settings: bc.slice(-1).pop()});
      }
    },
    computed: {
      nav () {
        return this.$store.getters['menu/menu'][0].children
      },
      name () {
        return this.$route.name
      },
      items () {
        return this.$store.getters['menu/breadcrumbs']
      }
    }
  }
</script>

