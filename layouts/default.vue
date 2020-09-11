<template>
  <div class="app main_page">
    <Header/>
    <div class="app-body">
      <main class="main">
        <!--<breadcrumb :list="list"/>-->
        <p class="mb-10 mt-3"></p>
        <div>
          <nuxt />
        </div>
      </main>
    </div>
    <!--<Footer/>-->
  </div>
</template>
<script>
  import nav from './menu'
  import Header from '~/components/Header/Header';
  import Footer from '~/components/Footer';
  import Sidebar from '~/components/Sidebar/Sidebar';
  import Breadcrumb from '~/components/Breadcrumb';
  export default {
    name: 'full',
    head: {
      title: 'РЕСО-Гарантия'
    },
    components: {
      Header,
      Sidebar,
      Footer,
      Breadcrumb
    },
    data () {
      return {
        nav: nav.items
      }
    },
    watch: {
      $route(to, from) {
        if(to.meta === 'Cabinet'){
         return
        }
        let url = to.path
        if(url === '/login'){
          return
        }
        if (to.path === '/') {
          url = 'index'
        }
        this.$store.dispatch('pages/fetchPageByUrl', url);
      }
    },
    computed: {
      name () {
        return this.$route.name
      },
      list () {
        return this.$route.matched
      }
    }
  }
</script>

