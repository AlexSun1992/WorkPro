<template>
  <div class="login-form-content">
    <div class="block-registration">
      <b-nav card-header tabs>
        <b-nav-item
          @click="toggleForm"
          :active="visibleForm === 'login' ? true : false"
          >Вход</b-nav-item
        >
        <b-nav-item
          @click="toggleForm"
          :active="visibleForm === 'registration' ? true : false"
          >Регистрация</b-nav-item
        >
      </b-nav>
    </div>
    <login-form v-if="visibleForm === 'login'"></login-form>
    <reg-form v-else></reg-form>
    <button @click="toggleForm" class="login-btn-mobile d-lg-none mt-3">
      Регистрация
    </button>
    <button @click="toggleForm" class="login-btn-mobile d-lg-none">ВХОД</button>
  </div>
</template>
<script>
import LoginForm from "../LoginForm.vue";
import RegForm from "../RegForm/RegForm.vue";

export default {
  name: "AuthForm",
  components: {
    LoginForm,
    RegForm,
  },
  data() {
    return {
      visibleForm: null,
    };
  },
  methods: {
    getToEnter() {
      window.history.pushState(null, "", "/login");
      this.registrationRender = false;
      this.isRegistrationInURL = false;
    },
    getToRegistration() {
      window.history.pushState(null, "", "/login/registration");
      this.registrationRender = true;
    },
    toggleForm() {
      if (this.visibleForm === "registration") {
        this.visibleForm = "login";
        window.history.pushState(null, "", "/login");
      } else {
        this.visibleForm = "registration";
        window.history.pushState(null, "", "/login/registration");
      }
    },
  },
  mounted() {
    const currentURL = window.location.pathname;
    this.isRegistrationInURL = currentURL.includes("registration");
    this.isLoginExistInURL = currentURL.includes("login");
    this.visibleForm = currentURL.includes("registration")
      ? "registration"
      : "login";
  },
};
</script>

<style scoped></style>
