<template>
  <div class="app">
    <Header/>
    <div class="app-body">
      <Sidebar :navItems="nav"/>
      <main class="main">
        <div class="container-fluid">
          <nuxt />
        </div>
      </main>
    </div>
    <Footer/>
  </div>
</template>
<script>
  import nav from './menu'
  import Header from '~/components/Header/Header';
  import Footer from '~/components/Footer';
  import Sidebar from '~/components/Sidebar/Sidebar';
  export default {
    name: 'full',
    components: {
      Header,
      Sidebar,
      Footer
    },
    data () {
      return {
        nav: nav.items
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

