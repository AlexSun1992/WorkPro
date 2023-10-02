<template>
  <div class="login-form-content">
    <div class="block-registration">
      <div @click="goESIA()" class="goesia d-lg-none my-3" id="esia-login">
        Войти через <span class="login_esia"></span>
      </div>
      <button
        v-if="visibleForm === 'registration'"
        @click="toggleForm('login')"
        class="login-btn-mobile d-lg-none mb-3"
      >
        Вход
      </button>
      <b-nav card-header tabs class="d-none d-lg-block">
        <b-nav-item
          @click="toggleForm('login')"
          :active="visibleForm === 'login'"
          >Вход</b-nav-item
        >
        <b-nav-item
          @click="toggleForm('registration')"
          :active="visibleForm === 'registration'"
          data-testid="registrationBtn"
          >Регистрация</b-nav-item
        >

        <b-nav-item @click="goESIA()" class="goesia" id="esia-login">
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
        window.location.href = "/login/registration";
      }
      if (address === "login") {
        window.location.href = "/login";
      }
    },
    goESIA() {
      this.$LogEvent({
        formName: "AuthForm",
        idEventType: 18,
        controlName: "AuthForm.vue",
        message: `Нажал на кнопку «Войти через ГОСУСЛУГИ»`,
        timeUser: new Date(),
      });
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
