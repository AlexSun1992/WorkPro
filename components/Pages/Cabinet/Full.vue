<template>
  <div>
    <nuxt-child
      v-if="isRouterChanged === false"
      :key="urlScript"
    />
  </div>
</template>

<script>
const reqJson = require("@/package");

export default {
  name: "Full",
  layout: "CabinetLayout",
  middleware: "guest",
  async fetch({ store, route, error: nuxtError, $winstonLog }) {
    try {
      const settings = store.getters["menu/settings"].slice(-1).pop() || null;
      if (!settings) {
        nuxtError({
          statusCode: 500,
          message: "Не удалось загрузить настройки страницы",
        });
      }
      if (settings) {
        if (settings.isCard || settings.isWizard) {
          await store.dispatch("card/setCard", {
            page: route.params,
            settings,
          });
        }
      }
    } catch (error) {
      $winstonLog.error({
        level: "error",
        message: error?.response || error,
      });
    }
  },
  computed: {
    urlScript() {
      return this.$route.fullPath;
    },
    isRouterChanged() {
      return this.$store.getters["data_card/getRouterChanged"];
    },
  },
  mounted() {
    this.$router.afterEach(() => {
      this.$store.commit("data_card/setRouterChanged", false);
    });
  },
};
</script>

<style scoped></style>
