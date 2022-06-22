/* eslint-disable */
export default function ({ app, store, redirect, route }) {
  store.commit("data_card/clearFormData");
  store.commit("data_card/clearFilters");
  store.commit("blocks/clearBlock");
  store.commit("blocks/clearFilters");
  store.commit("data_card/setError", false);
  if (process.server) {
    return app.$auth
      .setUserToken(
        app.$cookiz.get("auth._token.local"),
        app.$cookiz.get("auth._refresh_token.local")
      )
      .then((response) => {
        return redirect(route.fullPath);
      })
      .catch(() => {
        return redirect("/login");
      });
  }
  if (process.client) {
    if (!app.$cookiz.get("auth._token.local")) {
      if (window !== undefined) {
        window.location.href = "/login";
      }
    }
  }
}
