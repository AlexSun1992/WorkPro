<template>
  <div class="login-form">
    <div class="container mt-5">
      <b-alert v-if="showMessage" class="m-2 text-center" show
        >Для того, чтобы продолжить, необходимо войти или
        зарегистрироваться.</b-alert
      >
      <b-row class="justify-content-center">
        <b-col md="10" lg="6" class="block bg-six block-border-one mb-5">
          <b-tabs ref="tabs" content-class="mt-4 block-registration">
            <b-tab
              title="Вход"
              @click="changeUrl"
              :active="$route.path === '/login'"
            >
              <login-form />
            </b-tab>
            <b-tab
              @click="changeUrl"
              title="Регистрация"
              :active="$route.path === '/register'"
            >
              <reg-form />
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import LoginForm from "./LoginForm/LoginForm";
import RegForm from "./RegForm/RegForm";

export default {
  name: "LoginPage",
  middleware: "login",
  layout: "MainLayout",
  components: {
    RegForm,
    LoginForm,
  },
  methods: {
    changeUrl() {
      if (this.$refs.tabs.currentTab == 0) {
        this.$router.push("/login");
      }
      if (this.$refs.tabs.currentTab == 1) {
        this.$store.dispatch("clearAxiosError");
        this.$router.push("/register");
      }
    },
  },
  computed: {
    showMessage() {
      return this.$cookiz.get("url") && this.$cookiz.get("url") !== "/";
    },
  },
  async beforeRouteLeave(to, from, next) {
    if (to.meta !== "Cabinet") {
      await this.$store.dispatch(
        "pages/fetchPageByUrl",
        to.path === "/" ? "index" : to.path
      );
    }
    next();
  },
};
</script>

<style scoped>
.login-form {
  background: url(/img/registration.svg) 50% top no-repeat;
  height: 100%;
  min-height: 900px;
  display: grid;
}
</style>
