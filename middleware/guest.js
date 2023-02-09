import { isBlackListOfRoute } from "./router.helper";
export default async function ({
  app,
  store,
  redirect,
  route,
  $auth,
  $sentry,
}) {
  store.commit("data_card/clearFormData");
  store.commit("data_card/clearFilters");
  store.commit("blocks/clearBlock");
  store.commit("blocks/clearFilters");
  store.commit("data_card/setError", false);
  if (app.$cookiz.get("auth._token.local")) {
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
  if (process.client) {
    if (!app.$cookiz.get("auth._token.local")) {
      if (window !== undefined) {
        window.location.href = "/login";
      }
    }
  }
}
