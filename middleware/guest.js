export default function ({
  app,
  store,
  redirect,
  route
}) {
  if (!store.state.auth.loggedIn) {
    app.$cookiz.set('url', route.path);
    return redirect('/login');
  }
}
