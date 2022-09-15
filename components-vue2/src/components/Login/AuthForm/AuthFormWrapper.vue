<template>
  <div class="container">
    <div class="row mt-4">
      <div class="col-9">
        <AuthForm />
      </div>
    </div>
  </div>
</template>
<script>
import AuthForm from "./AuthForm.vue";

export default {
  name: "AuthFormWrapper",
  components: {
    AuthForm,
  },

  head: {
    link: [
      {
        rel: "stylesheet",
        type: "text/css",
        href: "https://reso.ru/system/modules/ru.reso.v2/resources/css/bootstrap-grid.css",
      },
      {
        rel: "stylesheet",
        type: "text/css",
        href: "https://reso.ru/system/modules/ru.reso.v2/resources/css/bootstrap-reboot.css",
      },
      {
        rel: "stylesheet",
        type: "text/css",
        href: "https://reso.ru/system/modules/ru.reso.v2/resources/css/bootstrap-utilities.css",
      },
      {
        rel: "stylesheet",
        type: "text/css",
        href: "https://reso.ru/system/modules/ru.reso.v2/resources/css/style_new.css",
      },
      {
        rel: "stylesheet",
        type: "text/css",
        href: "https://reso.ru/system/modules/ru.reso.v2/resources/css/style_main.css",
      },
    ],
  },
};
</script>
