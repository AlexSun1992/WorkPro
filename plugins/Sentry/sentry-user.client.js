import * as Sentry from "@sentry/vue";

export default ({ store, $cookiz }) => {
  store.watch(
    (state) => state.auth.user,
    (user) => {
      if (!user) {
        Sentry.setUser(null);
        return;
      }

      Sentry.setUser({
        id: user.ID,
        yandexID: $cookiz.get("_ym_uid"),
      });
    },
    { immediate: true }
  );
};
