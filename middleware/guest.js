/* eslint-disable */
export default function ({ app, store, redirect, route }) {
  store.commit("data_card/clearFormData");
  store.commit("data_card/setError", false);
  if (process.server) {
    app.$auth.setUserToken(
      app.$cookiz.get("auth._token.local"),
      app.$cookiz.get("auth._refresh_token.local")
    );
  }
  if (!app.$cookiz.get("auth._token.local")) {
    app.$cookiz.set("url", route.path);
    if (process.client) {
      if (window !== undefined) {
        window.location.href = "/login";
      }
    } else {
      return redirect("/login");
    }
  }
}
