<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <b-link class="navbar-brand" to="#"></b-link>
    <button class="navbar-toggler sidebar-toggler d-md-down-none" type="button" @click="sidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <b-navbar-nav class="d-md-down-none">
      <NLink class="px-3" to="/">
        Главная
      </NLink>
      <NLink class="px-3" to="/about">
        О компании
      </NLink>
      <NLink class="px-3" to="/calculator">
        Калькулятор
      </NLink>
      <NLink class="px-3" to="/feedback">
        Обратная связь
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
</style>
