import * as Sentry from "@sentry/vue";

export default ({ store }) => {
  const settings = store.getters["menu/settings"]?.slice(-1)?.pop();

  if (!settings) return;

  Sentry.setTag("app_mode", settings.isCard ? "card" : "wizard");
  Sentry.setTag("app_version", process.env.APP_VERSION);
};
