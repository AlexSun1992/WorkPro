<template>
  <div>
    <LoginModal  ref="refLogin"/>
    <client-only>
      <b-button v-if="!isAuthenticated" v-on:click="login" size="bg" class="my-2 my-sm-0" type="submit"  variant="success">Ваш кабинет</b-button>
      <b-nav-item-dropdown v-else right no-caret variant="primary">
        <template slot="button-content">
          <header-user-name :user-data="loggedInUser"></header-user-name>
        </template>
        <b-dropdown-item @click="goInCabinet"><i class="fa fa-home"></i> Личный кабинет</b-dropdown-item>
        <b-dropdown-item @click="logout"><i class="fa fa-lock"></i> Выход</b-dropdown-item>
      </b-nav-item-dropdown>
    </client-only>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import HeaderUserName from './HeaderUserName'
  import LoginModal from '../Pages/Login/LoginModal'
  export default {
    name: 'header-dropdown',
    components: {HeaderUserName, LoginModal},
    methods: {
      login () {
        this.$router.push('/login')
      },
      logout() {
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

