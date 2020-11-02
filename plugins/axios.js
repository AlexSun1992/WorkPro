export default function ({ $axios, redirect, store, $router }) {
  $axios.onError((error) => {
    if (error?.response?.status == 401) {
      store.commit("resetUser");
      let path = store.$router.currentRoute.path;
      if (path.includes("cabinet")) {
        redirect("/login");
      } else if (path.includes("login")) {
        return;
      } else {
        redirect("/");
      }
    } else {
      store.commit("setAxiosError", error);
    }
  });
}
