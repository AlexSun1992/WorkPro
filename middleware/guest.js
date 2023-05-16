import { isBlackListOfRoute } from "./router.helper";

export default async function ({ store, redirect, route, $auth, $cookiz, $sentry }) {
  store.commit("data_card/clearFormData");
  store.commit("data_card/clearFilters");
  store.commit("blocks/clearBlock");
  store.commit("blocks/clearFilters");
  store.commit("data_card/setError", false);
  if (process.server) {
    if (!$auth.loggedIn) {
      $sentry.captureException(`Редирект на страницу /login?ref=${route.fullPath}`);
      await $auth.logout();
      redirect(`/login?ref=${route.fullPath}`);
    }
  }
  if (process.client) {
    if (!$cookiz.get("auth._token.local")) {
      await $auth.logout();
      redirect(`/login?ref=${route.fullPath}`);
    }
  }
  if ($auth.loggedIn) {
    await store.dispatch("menu/fetchMenuById", route.params);
    if (
      isBlackListOfRoute(
        route.params.idModule,
        route.params.idParent,
        route.params.idItem
      ) === true
    ) {
      redirect("/error");
    }
  }
}
