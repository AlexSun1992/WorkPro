export default function ({ app, store, redirect, auth }) {
  app.$axios.onError((error) => {
    if (error.response.status === 401) {
      app.$auth.logout();
      return redirect("/login");
    }
  });
  app.$axios.onRequest((config) => {
    // console.log(`Making request to ${config.url}`);
  });
}
