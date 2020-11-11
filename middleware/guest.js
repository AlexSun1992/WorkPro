export default function ({ app, store, redirect, route }) {
  store.dispatch("blocks/clearBlock");
  store.commit("data_card/setError", false);
  app.$cookiz.set("url", route.path);
  if (!store.state.auth.loggedIn) {
    return redirect("/login");
  }
}
