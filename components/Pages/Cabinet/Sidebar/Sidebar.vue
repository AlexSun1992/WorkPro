<template>
  <div class="sidebar_client">
    <div class="ppl-info percent70 ppl-female">
      <div class="ppl-avatar">
        <img src="">
      </div>
      <span class="ppl-name"><header-user-name :user-data="loggedInUser"></header-user-name></span>
    </div>
    <ul class="sidebar-nav">
      <n-link  v-for="item in navItems" :key="item.id" :to="item.url" v-slot="{ href, route, navigate, isActive, isExactActive }">
      <li :class="isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'">
          <a :href="href" @click="navigate">
          <div class="menu-icon-profile"></div>
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
