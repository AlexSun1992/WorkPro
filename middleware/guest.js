export default function ({ app, store, redirect, route }) {
  store.dispatch("blocks/clearBlock");
  store.commit("data_card/clearFormData");
  store.commit("data_card/setError", false);
  if (!store.state.auth.loggedIn) {
    app.$cookiz.set("url", route.path);
    return redirect("/login");
  }
}
