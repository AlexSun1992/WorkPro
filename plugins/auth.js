export default function ({ app, store, redirect, auth }) {
  app.$axios.onError((error) => {
    if (error.response.status === 401) {
      app.$auth.logout();
      app.$cookiz.set("url", store.$router.history.pending.fullPath);
      return redirect("/login");
    }
  });
  app.$axios.onRequest((config) => {
    // console.log(`Making request to ${config.url}`);
  });
}
