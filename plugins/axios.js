export default function ({ $axios, app, redirect, store, $router }) {
  $axios.onError((error) => {
    if (error?.response?.status == 401) {
      store.commit("resetUser");
      let path = store.$router.currentRoute.path
      app.$cookiz?.set("url", path);
      if (path.includes('login')) {
        return
      } else {
        redirect("/login")
      }
    } else {
      store.commit("setAxiosError", error);
    }
  });
}