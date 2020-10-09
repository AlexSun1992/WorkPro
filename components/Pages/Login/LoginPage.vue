<template>
  <div class="container">
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
};
</script>

<style scoped></style>
