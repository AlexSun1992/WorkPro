<template>
  <div class="container">
    <b-alert v-if="showMessage" class="m-2 text-center" show
      >Для того, чтобы продолжить, необходимо войти или
      зарегистрироваться.</b-alert
    >
    <b-row class="justify-content-center">
      <b-col md="10" lg="6" class="block bg-six block-border-one mb-5">
        <b-tabs ref="tabs" content-class="mt-3">
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
</template>

<script>
import LoginForm from "./LoginForm/LoginForm";
import RegForm from "./RegForm/RegForm";

export default {
  name: "LoginPage",
  layout: "MainLayout",
  head: {
    link: [
      {
        rel: "stylesheet",
        href:
          "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css",
      },
    ],
  },
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
      return !!this.$cookiz.get("url");
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

<style scoped></style>
