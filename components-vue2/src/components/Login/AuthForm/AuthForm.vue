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

    <div class="login_more">
      или войти через<br />
      <button class="btn-alfa" @click="goALFA()" id="alfa-login">
        Alfa ID
      </button>
      <button class="btn-mts" @click="goMTS()" id="mts-login">
        <svg
          role="img"
          width="59"
          height="24"
          viewBox="0 0 59 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          data-test-id="logo"
          aria-label="Логотип MTS ID"
          class="sc-jcFjpl hKFLyG"
        >
          <rect width="24" height="24" fill="#FF0032"></rect>
          <path
            d="M15.9211 2V3.10223H18.2956V7.41451L18.2961 7.48551H19.6255V3.10223H22V2H15.9211Z"
            fill="white"
          ></path>
          <path
            d="M7.36953 2.01642L5.63285 5.62222L3.89616 2.01642H2V7.46861H3.32934V3.5666L5.02689 6.86313H6.23884L7.93686 3.5666V7.46861H9.26618V2.01642H7.36953Z"
            fill="white"
          ></path>
          <path
            d="M20.6673 20.1899C20.6425 20.3913 20.5508 20.5785 20.4068 20.7214C20.2573 20.8575 20.0736 20.9502 19.8753 20.9896C19.5856 21.047 19.2906 21.0737 18.9953 21.0693C18.6809 21.075 18.3677 21.0291 18.0681 20.9335C17.8225 20.8538 17.6106 20.694 17.4664 20.4798C17.3215 20.2653 17.25 19.9555 17.25 19.5617V19.0031C17.25 18.6064 17.323 18.2966 17.4664 18.0821C17.6103 17.8683 17.8216 17.7088 18.0666 17.6288C18.3662 17.5332 18.6795 17.4874 18.9939 17.493C19.2892 17.4886 19.5842 17.5153 19.8739 17.5728C20.0721 17.6123 20.2558 17.705 20.4054 17.8409C20.5493 17.9839 20.641 18.1711 20.6658 18.3725H21.9962C21.9721 17.9531 21.8122 17.5529 21.5405 17.2326C21.2725 16.9379 20.9258 16.7263 20.5412 16.6228C20.0368 16.4897 19.5164 16.4274 18.9949 16.4377C18.3575 16.4377 17.8047 16.5295 17.3519 16.7102C16.904 16.8826 16.5288 17.2035 16.2888 17.6191C16.0545 18.0217 15.9313 18.559 15.923 19.2176V19.278L15.9941 19.2809H15.923V19.3413C15.9313 19.9999 16.0545 20.5373 16.2888 20.9399C16.5288 21.3555 16.904 21.6763 17.3519 21.8488C17.8052 22.0295 18.3585 22.1213 18.9949 22.1213C19.5164 22.1318 20.0369 22.0695 20.5412 21.9362C20.9259 21.8331 21.2728 21.6214 21.5405 21.3264C21.8122 21.006 21.9722 20.6059 21.9962 20.1865L20.6673 20.1899Z"
            fill="white"
          ></path>
          <path d="M35.6522 3V21H32V3H35.6522Z" fill="currentColor"></path>
          <path
            d="M49.5545 18.0261C50.4762 18.0261 51.2849 17.9304 51.9806 17.7391C52.6936 17.5478 53.2936 17.2435 53.7806 16.8261C54.2675 16.3913 54.6327 15.8435 54.8762 15.1826C55.1197 14.5043 55.2414 13.687 55.2414 12.7304V11.1391C55.2414 9.27826 54.7545 7.95652 53.7806 7.17391C52.8067 6.37391 51.398 5.97391 49.5545 5.97391H43.6522V18.0261H49.5545ZM49.7632 3C51.2588 3 52.5806 3.16522 53.7284 3.49565C54.8762 3.8087 55.8327 4.33044 56.598 5.06087C57.3806 5.77391 57.9632 6.70435 58.3458 7.85217C58.7458 8.98261 58.9458 10.3652 58.9458 12C58.9458 13.6174 58.7458 15 58.3458 16.1478C57.9632 17.2783 57.3806 18.2087 56.598 18.9391C55.8327 19.6522 54.8762 20.1739 53.7284 20.5043C52.5806 20.8348 51.2588 21 49.7632 21H40V3H49.7632Z"
            fill="currentColor"
          ></path>
        </svg>
      </button>
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
      document.location.href = "/sso?auth&type=esia&ref=/cabinet";
    },
    goALFA() {
      this.$LogEvent({
        formName: "AuthForm",
        idEventType: 503,
        controlName: "AuthForm.vue",
        message: `Нажал на кнопку «Войти через AlfaID`,
        timeUser: new Date(),
      });
      document.location.href = "/sso?auth&type=alfa&ref=/cabinet";
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
