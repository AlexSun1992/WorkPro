/* eslint-disable */
import { getErrorNumber } from "../plugins/auth/toast.helper";
const MAX_ORA_ERROR = "ORA-10000";

export default function ({ app, redirect, $auth, $sentry }) {
  app.$axios.onResponseError((error) => {
    if (!error?.response) {
      return;
    }
    if (!error?.response?.config) {
      return;
    }
    if (error.response?.config?.url.includes("/am/auth/v2/token_refresh")) {
      return;
    }
    const {
      config,
      response: { status },
    } = error;
    const originalRequest = config;
    if (process.client) {
      if (window.reload) {
        return;
      }
    }
    if (error.response.status === 401 && !originalRequest.__isRetryRequest) {
      originalRequest.__isRetryRequest = true;
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
                redirect(`/login?ref=${app.router.history.current.fullPath}`);
              }
            }
          } else {
            redirect(`/login?ref=${app.router.history.current.fullPath}`);
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
        if (error.response.status === 520 && error.response?.data?.MESSAGE) {
          const errNumber = getErrorNumber(error.response?.data?.MESSAGE);
          if (MAX_ORA_ERROR > errNumber) {
            $sentry.captureException(
              new Error(error.response?.data?.MESSAGE),
              (scope) => {
                scope.setLevel("error");
                scope.setTransactionName("Ошибка 520");
                return scope;
              }
            );
          }
          if (
            !originalRequest.__isRetryRequest &&
            error.response.data?.MESSAGE
          ) {
            if (
              error.response.data?.MESSAGE.includes(
                "ограничение уникальности"
              ) ||
              error.response.data?.MESSAGE.includes(
                "количество открытых курсоров превысило допустимый максимум"
              )
            ) {
              originalRequest.__isRetryRequest = true;
              return app.$axios(originalRequest);
            }
          }
        }
        if (error.response.status === 500) {
          $sentry.captureException(new Error(error.response.data), (scope) => {
            scope.setLevel("fatal");
            scope.setTransactionName("Ошибка 500");
            return scope;
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  });
  app.$axios.onRequest((config) => {
    console.log(`Making request to ${config.url}`);
  });
  $auth.onError((error, name, endpoint) => {
    console.log(error);
    $sentry.captureException(error);
  });
}
