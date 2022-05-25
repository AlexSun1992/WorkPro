<template>
  <header>
    <div class="menu-container">
      <a
        href="/"
        aria-current="page"
        class="logo router-link-exact-active router-link-active"
      ></a>
      <button class="burger" @click="toggleClassActive"></button>
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
              <show-city></show-city>
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
          <header-user-name :user-data="userInfo"></header-user-name>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import ShowCity from "../../../../components-vue2/src/components/ShowCity/ShowCity.vue";
import HeaderUserName from "./HeaderUserName.vue";

export default {
  name: "Header",
  components: {
    ShowCity,
    HeaderUserName,
  },
  data() {
    return {
      userInfo: null,
    };
  },
  methods: {
    toggleClassActive(e) {
      document.querySelector("body").classList.toggle("menu-open");
      document.querySelector(".menu").classList.toggle("show");
      return;
    },
    // test() {
    //   console.log("!!!");
    // },
    /// использовано в качестве заглушки
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

<style>
body:after {
  left: -100%;
  background-color: rgba(0, 0, 0, 0.3);
  transition: left 0.3s;
  content: "";
  width: 100%;
  height: 100%;
  top: 0;
  position: absolute;
  z-index: 1;
}
body.menu-open {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
body.menu-open:after {
  left: 0;
  transition: left 0.3s;
}
body.menu-open header {
  z-index: 0;
}
</style>
