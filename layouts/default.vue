<template>
  <div class="app header-fixed sidebar-fixed aside-menu-fixed aside-menu-hidden">
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

