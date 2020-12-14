export default function ({ app, store, redirect, auth }) {
  app.$axios.onError((error) => {
    if (error.response.status === 401) {
      if (app.router.history.pending) {
        app.$cookiz.set("url", app.router.history.pending.fullPath);
      }
      app.$auth.logout();
      return redirect("/login");
    }
  });
  app.$axios.onRequest((config) => {
    // console.log(`Making request to ${config.url}`);
  });
}
