/* eslint-disable */
import converter from "@/converters/menu";

export default function ({ app, store, redirect, $auth }) {
  app.$axios.onResponseError((error) => {
    if (!error?.response?.config) {
      return;
    }
    if (error.response?.config?.url.includes("/am/auth/v2/token_refresh")) {
      return;
    }
    if (!error?.response) {
      return app.router.push("/login");
    }
    const {
      config,
      response: { status },
    } = error;
    const originalRequest = config;
    if (error.response.status === 401 && !originalRequest.__isRetryRequest) {
      originalRequest.__isRetryRequest = true;
      if (app.router.history.pending) {
        app.$cookiz.set("url", app.router.history.pending.fullPath);
      }
      //
      return app.$auth
        .refreshTokens()
        .then((data) => {
          if (data?.data) {
            if (data?.data?.STATUS === 401) {
              $auth.logout();
              redirect("/login");
            }
          }
          return app.$axios(originalRequest);
        })
        .catch((err) => {
          $auth.logout();
        });
    }
    if (error.response.status !== 401) {
      try {
        store.commit("data_card/setLoading", false);
        store.commit("data_card/setDisabled", false);
        store.commit("data_card/setError", true);
        store.commit("data_card/setErrorMessage", error.response.data);
        if ($nuxt) {
          $nuxt.$bvToast.toast(error.response.data.MESSAGE, {
            title: "Ошибка",
            variant: "danger",
            autoHideDelay: 5000,
          });
        }
      } catch (e) {}
    }
  });
  app.$axios.onRequest((config) => {
    console.log(`Making request to ${config.url}`);
  });
  $auth.onError((error, name, endpoint) => {
    //console.log(name, error);
  });
}
