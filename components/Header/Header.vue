<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <b-link class="navbar-brand" to="/"></b-link>
    <b-navbar-nav class="d-md-down-none">
      <NLink class="px-3" to="/">
        Купить полис
      </NLink>
      <NLink class="px-3" to="/">
        Ближайший офис
      </NLink>
      <NLink class="px-3" to="/">
        Справочный офис
      </NLink>
      <NLink class="px-3" to="/feedback">
       РЕСО для бизнеса
      </NLink>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto header-dropdown-button">
      <HeaderDropdown/>
    </b-navbar-nav>
  </header>
</template>

<script>
  import HeaderDropdown from './HeaderDropdown.vue'

  export default {
    name: 'c-header',
    components: {
      HeaderDropdown
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
