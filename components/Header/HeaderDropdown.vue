<template>
  <div>
    <b-button v-if="!isAuthenticated" size="bg" class="my-2 my-sm-0" type="submit"  variant="success">Войти</b-button>
    <b-nav-item-dropdown v-else right no-caret variant="primary">
      <template slot="button-content">
        <header-user-name :user-data="loggedInUser"></header-user-name>
      </template>
      <b-dropdown-item @click="goInCabinet"><i class="fa fa-home"></i> Личный кабинет</b-dropdown-item>
      <b-dropdown-item @click="logout"><i class="fa fa-lock"></i> Выход</b-dropdown-item>
    </b-nav-item-dropdown>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import HeaderUserName from './HeaderUserName'
  export default {
    name: 'header-dropdown',
    components: {HeaderUserName},
    methods: {
      async logout() {
        try {
          this.$auth.logout()
          this.$router.push('/')
        } catch (e) {
          console.log(e)
        }
      },
      goInCabinet() {
        this.$router.push('/cabinet')
      }
    },
    computed: {
      ...mapGetters(['isAuthenticated','loggedInUser']),
    }
  }
</script>

