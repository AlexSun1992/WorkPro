import * as Sentry from "@sentry/vue";

export default ({ $axios }) => {
  $axios.onError((error) => {
    const status = error.response?.status;
    if (status >= 500) {
      Sentry.captureException(error, {
        tags: {
          type: "axios",
        },
        extra: {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          response: error.response?.data,
        },
      });
    }
    return Promise.reject(error);
  });
};
