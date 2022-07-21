<template>
  <div class="login-form-content">
    <div class="block-registration">
      <b-nav card-header tabs>
        <b-nav-item @click="toggleForm" :active="visibleForm === 'login'"
          >Вход</b-nav-item
        >
        <b-nav-item @click="toggleForm" :active="visibleForm === 'registration'"
          >Регистрация</b-nav-item
        >
      </b-nav>
    </div>
    <login-form v-if="visibleForm === 'login'"></login-form>
    <reg-form v-else></reg-form>
    <button
      v-if="visibleForm === 'login'"
      @click="toggleForm"
      class="login-btn-mobile d-lg-none mt-3"
    >
      РЕГИСТРАЦИЯ
    </button>
    <button v-else @click="toggleForm" class="login-btn-mobile d-lg-none">
      ВХОД
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
    this.visibleForm = currentURL.includes("registration")
      ? "registration"
      : "login";
  },
};
</script>

<style scoped></style>
