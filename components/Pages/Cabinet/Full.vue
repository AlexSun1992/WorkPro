<template>
  <div>
    <nuxt-child :key="$route.fullPath" />
  </div>
</template>

<script>
import consts from "@/api/urls";

export default {
  name: "Full",
  layout: "CabinetLayout",
  middleware: "guest",
  async fetch({ store, route, error: nuxtError }) {
    try {
      const settings =
        store.getters["menu/breadcrumbs"].slice(-1).pop() || null;
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
      console.error(error?.response || error);
    }
  },
  mounted() {
    this.$sentry.setUser({
      id: this.$auth.user.ID,
      yandexID: this.$cookiz.get("_ym_uid"),
    });
  },
};
</script>

<style scoped></style>
