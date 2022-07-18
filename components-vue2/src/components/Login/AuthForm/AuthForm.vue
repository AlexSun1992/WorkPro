<template>
  <div>
    <login-form></login-form>
    <reg-form></reg-form>
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
      url: window.location.pathname,
    };
  },

  computed: {
    getUrl() {
      return window.location.pathname;
    },
  },
};
</script>

<style scoped></style>
