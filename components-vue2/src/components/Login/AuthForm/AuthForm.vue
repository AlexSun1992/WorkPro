<template>
  <div class="login-form-content">
    <div class="block-registration">
      <b-nav card-header tabs class="d-none d-lg-block">
        <b-nav-item
          @click="toggleForm('login')"
          :active="visibleForm === 'login'"
          >Вход</b-nav-item
        >
        <b-nav-item
          @click="toggleForm('registration')"
          :active="visibleForm === 'registration'"
          >Регистрация</b-nav-item
        >

        <b-nav-item
          @click="goESIA()"
          class="goesia"
          id="btn_recovery-password_lk"
        >
          Войти через <span class="login_esia"></span>
        </b-nav-item>
      </b-nav>
    </div>
    <login-form v-if="visibleForm === 'login'"></login-form>
    <reg-form v-else></reg-form>
    <button
      v-if="visibleForm === 'login'"
      @click="toggleForm('registration')"
      class="login-btn-mobile d-lg-none mt-3"
    >
      Регистрация
    </button>
    <button
      v-else
      @click="toggleForm('login')"
      class="login-btn-mobile d-lg-none"
    >
      Вход
    </button>

    <div
      @click="goESIA()"
      class="goesia m-auto d-lg-none mt-4 d-table"
      id="btn_recovery-password_lk"
    >
      Войти через <span class="login_esia"></span>
    </div>
  </div>
</template>
<script>
import { BNav, BNavItem } from "bootstrap-vue";
import LoginForm from "../LoginForm.vue";
import RegForm from "../RegForm/RegForm.vue";

export default {
  name: "AuthForm",
  components: {
    LoginForm,
    RegForm,
    BNav,
    BNavItem,
  },
  data() {
    return {
      visibleForm: null,
    };
  },

  methods: {
    toggleForm(address) {
      if (address === "registration") {
        this.visibleForm = "registration";
        window.history.pushState(null, "", "/login/registration");
      }
      if (address === "login") {
        this.visibleForm = "login";
        window.history.pushState(null, "", "/login");
      }
    },
    goESIA() {
      document.location.href =
        "https://client.reso.ru/loginesia/loginesia/prod";
    },
  },
  mounted() {
    const currentURL = window.location.pathname;
    this.visibleForm = currentURL.includes("registration")
      ? "registration"
      : "login";
  },
};
</script>

<style scoped></style>
