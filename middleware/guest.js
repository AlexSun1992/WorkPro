export default function ({ app, store, redirect, route }) {
  store.dispatch("blocks/clearBlock");
  if (!store.state.auth.loggedIn) {
    app.$cookiz.set("url", route.path);
    console.log(app.$cookiz.get("url", route.path));
    return redirect("/login");
  }
}
