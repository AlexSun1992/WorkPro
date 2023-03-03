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
  async fetch({ store, route, app, $sentry }) {
    try {
      const data = await app.$axios.get(`${consts.USERPROFILE}`);
      if (data?.data && data?.data?.STATUS !== 401) {
        const user = data.data[0]._data[0];
        app.$auth.setUser(user);
      }
      const setting = store.getters["menu/breadcrumbs"].slice(-1).pop();
      if (setting.isCard || setting.isWizard) {
        await store.dispatch("card/setCard", {
          page: route.params,
          settings: setting,
        });
      }
    } catch (error) {
      console.log(error?.response);
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
