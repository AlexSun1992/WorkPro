/* eslint-disable */
import converter from "@/converters/menu";
import { getErrorMessage } from "../utils/transform";
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
          console.log(err?.response);
          if (err?.response?.data?.STATUS === 401) {
            $auth.logout();
          }
        });
    }
    if (error.response.status !== 401) {
      try {
        if ($nuxt) {
          console.log(error.response.data);
          if (getErrorMessage(error.response.data)) {
            $nuxt.$bvToast.toast(getErrorMessage(error.response.data), {
              title: "Ошибка",
              variant: "danger",
              autoHideDelay: 5000,
            });
          }
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
