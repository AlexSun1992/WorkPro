<template>
  <div class="app">
    <Header/>
    <div class="app-body">
      <Sidebar :navItems="nav"/>
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
    data () {
      return {
        nav: [],
        data: null
      }
    },
    async mounted () {
      const {data} = await this.$axios.get('/api/module')
      this.nav = data
      this.setParams()
    },
    watch: {
      '$route': 'setParams'
    },
    methods: {
       setParams  () {
        this.$store.commit('menu/setBreadcrumbs', breadcrumbs.getData(this.nav, this.$route.params))
      }
    },
    computed: {
      name () {
        return this.$route.name
      },
      items () {
        return this.$store.getters['menu/breadcrumbs']
      }
    }
  }
</script>

