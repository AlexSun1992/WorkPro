/* eslint-disable */
import converter from "@/converters/menu";
import { getErrorMessage } from "../utils/transform";
export default function ({ app, store, redirect, $auth, $window }) {
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
              if (process.client) {
                if (window !== undefined) {
                  window.location.href = "/login";
                }
              } else {
                redirect("/login");
              }
            }
          }
          return app.$axios(originalRequest);
        })
        .catch((err) => {
          if (err?.response?.data?.STATUS === 401) {
            $auth.logout();
          }
        });
    }
    if (error.response.status !== 401) {
      try {
        if ($nuxt) {
          console.log(error.response.data);
          if (
            !originalRequest.__isRetryRequest &&
            error.response.data?.MESSAGE
          ) {
            if (
              error.response.data?.MESSAGE.includes("ограничение уникальности")
            ) {
              originalRequest.__isRetryRequest = true;
              return app.$axios(originalRequest);
            }
          }
          if (Boolean(error.response.data?.INFO) === false) {
            $nuxt.$bvToast.toast("Неизвестная ошибка", {
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
