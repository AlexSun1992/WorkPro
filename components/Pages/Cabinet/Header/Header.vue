<template>
  <!--  <header>
    <div class="relative">
      <a href="/" class="header-logo"></a>
      <div class="header-text col-auto mr-auto">
        Страхование на все случаи жизни
      </div>
      <ul class="header-nav col-auto">
        <li class="header-nav-item">
          <button
            v-on:click="goToNotify()"
            type="button"
            class="header-nav-notifications"
          />
        </li>
        <li class="header-nav-item">
          <button v-on:click="logout()" type="button" class="header-nav-exit" />
        </li>
        <li class="header-nav-item mobile-menu-btn">
          <button
            v-on:click="mobileMenu()"
            type="button"
            class="header-nav-mobile"
          />
        </li>
      </ul>
    </div>
  </header>
  -->
  <header>
    <div class="menu-container">
      <a
        href="/"
        aria-current="page"
        class="logo router-link-exact-active router-link-active"
      ></a>
      <button class="burger mr-4 d-block d-md-none"></button>
      <div class="row header-height align-items-start align-items-md-center">
        <div
          class="middle_menu col-lg-7 col-md-8 pl-md-4 pr-md-0 offset-lg-2 offset-md-2"
        >
          <div class="menu-link d-md-flex ms-md-3 ms-lg-0">
            <div class="slogan-reso">С нами надёжнее!</div>
            <div>
              <a href="/individual" class="d-none d-md-block">Купить полис</a>
            </div>
            <div>
              <a href="/incase" class="d-none d-md-block">Страховой случай</a>
            </div>
            <div>
              <a href="/corporate" class="d-none d-md-block">Бизнесу</a>
            </div>
          </div>
          <div class="anonsed-block">
            <button class="anonsed" type="button"></button>
          </div>
        </div>
        <div class="top_menu mt-4 mt-md-0">
          <div class="float-md-start">
            <span class="icon-left icon-location"
              ><span class="d-inline-block light-gray">Ваш город:</span></span
            >
            <div class="d-inline-block">
              <!-- <button type="button" class="btn select-sity btn-link">
                Владивосток
              </button> -->
              <!-- <change-city :changeCity="test"></change-city> -->
              <show-city :changeCity="test"></show-city>
            </div>
          </div>
          <div class="float-md-start ms-lg-5 mt-3 mt-lg-0">
            <a
              class="icon-left icon-search-office gray-one txtdn"
              href="/about/contacts"
              >Офисы и отделения</a
            >
          </div>
          <div class="float-md-end d-none d-lg-block">
            <a
              href=""
              class="icon-left icon-eye gray-one txtdn visuallyImpairedButton"
              >Версия для слабовидящих</a
            >
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
      <div class="login-form">
        <div class="LoginButton">
          <!-- <button type="button" class="btn dropdown-toggle btn-login-link">
            Вячеслав Головлев
          </button> -->
          <!-- <login-button></login-button> -->

          <header-user-name :user-data="userInfo"></header-user-name>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
// import LoginButton from "../../../../components-vue2/src/components/Login/LoginButton.vue";
import ShowCity from "../../../../components-vue2/src/components/ShowCity/ShowCity.vue";
import HeaderUserName from "./HeaderUserName.vue";

export default {
  name: "Header",
  components: {
    // LoginButton,
    ShowCity,
    HeaderUserName,
  },
  data() {
    return {
      userInfo: null,
    };
  },
  methods: {
    test() {},
    mobileMenu() {
      this.$emit("mini-sidebar");
    },
    async logout() {
      try {
        await this.$auth.logout();
        localStorage.removeItem("USER_INFO");
        window.$nuxt.$cookiz?.remove("url");
        window.location.href = "/";
      } catch (e) {
        console.log(e);
      }
    },
    goToNotify() {
      this.$router.push("/cabinet/55/0/705");
    },
  },
  created() {
    this.userInfo = this.$auth.user;
  },
};
</script>

<style scoped></style>
