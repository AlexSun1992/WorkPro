<template>
  <header>
    <div class="container">
      <div class="top_menu">
        <div class="float-left">
          <span class="icon-left icon-location"
            ><span class="d-none d-lg-inline-block">Ваш город:</span></span
          >
          <a href="" class="icon-right icon-arrow-small-down color-green pr-3"
            >Москва</a
          >
        </div>
        <div class="float-left">
          <div class="separator32"></div>
        </div>
        <div class="float-left">
          <a href="" class="icon-left icon-search-office"
            >Найти ближайший офис</a
          >
        </div>
        <div class="float-right">
          <a href="" class="icon-left icon-eye">Версия для слабовидящих</a>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
    <div class="container">
      <div class="middle_menu row align-items-center">
        <div class="col-2">
          <nuxt-link class="logo" to="/"></nuxt-link>
        </div>
        <div class="col-lg-6 col-md-7 pl-md-4 pr-md-0">
          <span v-for="(item, index) in menu" :key="index">
            <nuxt-link :to="item.link.url">{{ item.title }}</nuxt-link>
          </span>
        </div>
        <div class="col-lg-4 col-md-3 text-right">
          <button class="search mr-4"></button>
          <button
            v-if="!isAuthenticated"
            v-on:click="login"
            class="gotolk btn_trn btn-p-sm btn-icon-left"
          >
            <span class="d-none d-lg-block">Личный кабинет</span
            ><span class="d-lg-none">Вход</span>
          </button>
          <b-nav-item-dropdown
            v-else
            class="gotolk icon-right"
            variant="primary"
          >
            <template slot="button-content">
              <header-user-name
                :user-data="loggedInUser"
                class="color-green"
              ></header-user-name>
            </template>
            <b-dropdown-item @click="goInCabinet"
              ><i class="fa fa-home"></i> Личный кабинет</b-dropdown-item
            >
            <b-dropdown-item @click="logout"
              ><i class="fa fa-lock"></i> Выход</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import HeaderUserName from "../Pages/Cabinet/Header/HeaderUserName";
import { mapGetters } from "vuex";
export default {
  name: "c-header",
  components: {
    HeaderUserName
  },
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
    }
  },
  computed: {
    menu() {
      return this.$store.getters["pages/getMenu"];
    },
    ...mapGetters(["isAuthenticated", "loggedInUser"])
  }
};
</script>
<style scoped>
.logo {
  width: 120px;
  height: 40px;

  display: block;
}
.buy-block {
  background: #36ab4d;
  border-radius: 10px;
  height: 80px;
}
.logo {
  background: url(/img/main/logo.svg) 0 0 no-repeat;
}
.search {
  background: url(/img/main/search.svg) 0 0 no-repeat;
  height: 16px;
  width: 16px;
  border: 0;
}
</style>
