<template>
  <div class="container">
    <div class="row mt-4">
      <div class="col-12 col-lg-9">
        <PasswordRecoveryForm />
      </div>
    </div>
  </div>
</template>

<script>
import PasswordRecoveryForm from "./PasswordRecoveryForm.vue";

export default {
  name: "PasswordRecoveryFormWrapper",
  components: {
    PasswordRecoveryForm,
  },

  head: {
    link: [
      {
        rel: "stylesheet",
        type: "text/css",
        href: "https://reso.ru/export/system/modules/ru.reso.v2/resources/css/bootstrap.css",
      },
      {
        rel: "stylesheet",
        type: "text/css",
        href: "https://reso.ru/export/system/modules/ru.reso.v2/resources/css/main_site_styles.css",
      },
      {
        rel: "stylesheet",
        type: "text/css",
        href: "https://reso.ru/export/system/modules/ru.reso.v2/resources/css/vue_components_styles/vue_components_styles.css",
      },
      {
        rel: "stylesheet",
        type: "text/css",
        href: "https://reso.ru/export/system/modules/ru.reso.v2/resources/css/formatter_styles/resoContainer.css",
      },
    ],
  },
};
</script>
