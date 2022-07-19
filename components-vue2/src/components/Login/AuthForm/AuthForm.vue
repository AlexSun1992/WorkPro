<template>
  <div class="login-form-content">
    <div class="block-registration">
      <b-nav card-header tabs>
        <b-nav-item
          @click="getToEnter"
          :active="isRegistrationInURL || registrationRender ? false : true"
          >Вход</b-nav-item
        >
        <b-nav-item
          @click="getToRegistration"
          :active="isRegistrationInURL || registrationRender ? true : false"
          >Регистрация</b-nav-item
        >
      </b-nav>
    </div>
    <login-form v-if="!registrationRender && !isRegistrationInURL"></login-form>
    <reg-form v-if="registrationRender || isRegistrationInURL"></reg-form>
    <button
      v-if="!registrationRender && !isRegistrationInURL"
      @click="getToRegistration"
      class="login-btn-mobile d-lg-none mt-3"
    >
      Регистрация
    </button>
    <button
      v-if="registrationRender || isRegistrationInURL"
      @click="getToEnter"
      class="login-btn-mobile d-lg-none"
    >
      ВХОД
    </button>
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
      registrationRender: null,
      isRegistrationInURL: null,
      isLoginExistInURL: null,
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
  },
  mounted() {
    const currentURL = window.location.pathname;
    this.isRegistrationInURL = currentURL.includes("registration");
    this.isLoginExistInURL = currentURL.includes("login");
  },
};
</script>

<style scoped></style>
