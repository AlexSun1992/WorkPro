<template>
  <div class="app">
    <Header/>
    <div class="app-body">
      <Sidebar :navItems="nav"/>
      <main class="main">
        <breadcrumb :list="list"/>
        <div class="container-fluid">
          <nuxt />
        </div>
      </main>
    </div>
    <Footer/>
  </div>
</template>
<script>
  import nav from './cabinet-menu'
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
        nav: []
      }
    },
    async mounted() {
      const { data } = await this.$axios.get('/api/module');
      this.nav = data
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

