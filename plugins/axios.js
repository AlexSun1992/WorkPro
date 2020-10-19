export default function ({ $axios, redirect, store, $router }) {
  $axios.onError((error) => {
    if (error?.response?.status == 401) {
      store.commit("resetUser");
      let path = store.$router.currentRoute.path
      path.includes('cabinet') ? redirect("/login") : redirect("/")
    } else {
      store.commit("setAxiosError", error);
    }
  });
}
