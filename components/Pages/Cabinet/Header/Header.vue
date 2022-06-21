<template>
  <header>
    <div class="menu-container">
      <a
        href="/"
        aria-current="page"
        class="logo router-link-exact-active router-link-active"
      />
      <button class="burger" @click="toggleClassActive" />
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
        </div>
        <div class="top_menu mt-4 mt-md-0">
          <div class="float-md-start">
            <span class="icon-left icon-location"
              ><span class="d-inline-block light-gray">Ваш город:</span></span
            >
            <div class="d-inline-block">
              <show-city />
            </div>
          </div>
          <div class="float-md-start ms-lg-5 mt-3 mt-lg-0">
            <a
              class="icon-left icon-search-office gray-one txtdn"
              href="/about/contacts"
              v-text="'Офисы и отделения'"
            />
          </div>
          <div class="float-md-end d-none d-lg-block">
            <a
              href=""
              class="icon-left icon-eye gray-one txtdn visuallyImpairedButton"
              v-text="'Версия для слабовидящих'"
            />
          </div>
          <div class="clearfix" />
        </div>
      </div>
      <div class="login-form">
        <nuxt-link class="anonsed-block" to="/cabinet/55/0/705">
          <button type="button" class="anonsed" />
        </nuxt-link>

        <div class="LoginButton">
            <b-dropdown variant="login-link" toggle-class="text-decoration-none" no-caret>
              <template #button-content>
                  {{ userInfo.SSECONDNAME }} {{ userInfo.SFIRSTNAME }}
              </template>
              <b-dropdown-item href="https://new.reso.ru">На главную страницу РЕСО</b-dropdown-item>
              <b-dropdown-item href="#" @click="logout()">Ввыйти из аккаунта</b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import LoginButton from "../../../../components-vue2/src/components/Login/LoginButton.vue";
import ShowCity from "../../../../components-vue2/src/components/ShowCity/ShowCity.vue";
import HeaderUserName from "./HeaderUserName.vue";

export default {
  name: "Header",
  components: {
    LoginButton,
    ShowCity,
    HeaderUserName,
  },
  emits: { "mini-sidebar": null },
  data() {
    return {
      userInfo: null,
    };
  },
  created() {
    this.userInfo = this.$auth.user;
  },
  methods: {
    toggleClassActive() {
      document.querySelector("body").classList.toggle("menu-open");
      document.querySelector(".menu").classList.toggle("show");
    },
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
        console.error(e);
      }
    },
    goToNotify() {
      this.$router.push("/cabinet/55/0/705");
    },
  },
};
</script>

<style>
body:after {
  left: -100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: left 0.3s;
  content: "";
  width: 100%;
  height: 100%;
  top: 0;
  position: absolute;
  z-index: 3;
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
</style>
