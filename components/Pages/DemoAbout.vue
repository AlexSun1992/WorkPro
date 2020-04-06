<template>
  <div>
    <header class="app-header navbar">
      <b-link class="navbar-brand" to="/"></b-link>
      <b-navbar-nav class="d-md-down-none">
        <NLink v-for="(item, index) in menu.list"  class="px-3" :to="item.url.slug" :key="index">
          {{item.name}}
        </NLink>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto header-dropdown-button">
      </b-navbar-nav>
    </header>
    <div  v-html="content"/>
  </div>
</template>

<script>
  import VRuntimeTemplate from "v-runtime-template";
  export default {
    layout: 'DemoLayout',
    name: 'DemoAbout',
    head: {
      title: 'Демонстрационная страница'
    },
    async asyncData ({ $axios }) {
      let dataPage = await $axios.get('/wp-json/wp/v2/pages/391')
      let dataMenu = await $axios.get(`/wp-json/acf/v3/main/${dataPage.data.acf.main_menu.component_id}`)
      return {
        content: dataPage.data.content.rendered,
        menu: dataMenu.data.acf
      }
    },
    components: {VRuntimeTemplate}
  }
</script>

<style scoped>

</style>
