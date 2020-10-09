<template>
  <div class="d-inline-block">
    <LoginModal ref="refLogin" />
    <client-only>
      <b-button
        v-if="!isAuthenticated"
        v-on:click="login"
        size="bg"
        class="gotolk btn_trn btn-p-sm btn-icon-left"
        type="submit"
        variant="success"
      >
        <span class="d-none d-lg-block">Личный кабинет</span>
        <span class="d-lg-none">Вход</span>
      </b-button>
      <b-nav-item-dropdown v-else right no-caret variant="primary">
        <template slot="button-content">
          <header-user-name :user-data="loggedInUser"></header-user-name>
        </template>
        <b-dropdown-item @click="goInCabinet"
          ><i class="fa fa-home"></i> Личный кабинет</b-dropdown-item
        >
        <b-dropdown-item @click="logout"
          ><i class="fa fa-lock"></i> Выход</b-dropdown-item
        >
      </b-nav-item-dropdown>
    </client-only>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HeaderUserName from "../Pages/Cabinet/Header/HeaderUserName";
import LoginModal from "../Pages/Login/LoginModal";
export default {
  name: "header-dropdown",
  components: { HeaderUserName, LoginModal },
  methods: {
    login() {
      this.$router.push("/login");
    },
    logout() {
      try {
        this.$auth.logout();
        window.$nuxt.$cookiz?.remove("url");
        this.$router.push("/");
      } catch (e) {
        console.log(e);
      }
    },
    goInCabinet() {
      this.$router.push("/cabinet");
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
  },
};
</script>
