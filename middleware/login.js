export default function login({ store, redirect }) {
  if (store.state.auth.loggedIn) {
    return redirect("/");
  }
}
