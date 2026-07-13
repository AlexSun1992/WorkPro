import * as Sentry from "@sentry/vue";
import Vue from "vue";

export default () => {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  Sentry.init({
    Vue,
    dsn: process.env.SENTRY_LK_PRJ_DSN,
    environment: process.env.NODE_ENV,
  });
};
