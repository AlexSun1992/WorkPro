<template>
  <div class="sidebar_client">
    <header-user-name :user-data="loggedInUser"></header-user-name>
    <ul class="sidebar-nav">
      <n-link  v-for="item in navItems" :key="item.id" :to="item.url" v-slot="{ href, route, navigate, isActive, isExactActive }">
      <li :class="isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'">
          <a :href="href" @click="navigate">
          <div :class="'menu-icon-'+ item.iconFileName"></div>
          <span>{{item.name}}</span>
          </a>
      </li>
      </n-link>
    </ul>
    <button class="sidebar-minimizer"></button>
  </div>
</template>

<script>
  import HeaderUserName from '../Header/HeaderUserName'
  import { mapGetters } from 'vuex';
  export default {
    name: 'Sidebar',
    components: {HeaderUserName},
    props: {
      navItems: {
        type: Array,
        required: true,
        default: () => []
      }
    },
    computed: {
      ...mapGetters(['isAuthenticated','loggedInUser']),
    }
  }
</script>

<style scoped>

</style>
