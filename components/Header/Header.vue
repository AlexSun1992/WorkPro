<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <b-link class="navbar-brand" to="/"></b-link>
    <b-navbar-nav class="d-md-down-none">
    <MainMenu :pageId="pageId"/>
    <!-- <NLink class="px-3" :to="item.link.url" @click.native="setUrl(item.link.url)" v-for="item in menu">
      {{ item.link.title }}
    </NLink> -->
    <!-- <NLink class="px-3" to="/about">
      Купить полис
    </NLink>
    <NLink class="px-3" to="/about">
      Ближайший офис
    </NLink>
    <NLink class="px-3" to="/about">
      Справочный офис
    </NLink>
    <NLink class="px-3" to="/about">
      РЕСО для бизнеса
    </NLink> -->
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto header-dropdown-button">
      <HeaderDropdown/>
    </b-navbar-nav>
  </header>
</template>

<script>
  import HeaderDropdown from './HeaderDropdown.vue'
  import MainMenu from './MainMenu/MainMenu'

  export default {
    name: 'c-header',
    components: {
      HeaderDropdown,
      MainMenu
    },

    data() {
      return {
        pageId: 415
      }
    },

    methods: {
      sidebarToggle (e) {
        e.preventDefault()
        document.body.classList.toggle('sidebar-hidden')
      },
      sidebarMinimize (e) {
        e.preventDefault()
        document.body.classList.toggle('sidebar-minimized')
      },
      mobileSidebarToggle (e) {
        e.preventDefault()
        document.body.classList.toggle('sidebar-mobile-show')
      },
      asideToggle (e) {
        e.preventDefault()
        document.body.classList.toggle('aside-menu-hidden')
      }
    }
  }
</script>
<style scoped>
.header-dropdown-button {
  padding-right: 40px;
}
.app-header.navbar {
  border-bottom: 1px solid #f0f3f5;
}
.app-header.navbar .navbar-brand {
  border-bottom: 1px solid #f0f3f5;
}
</style>
