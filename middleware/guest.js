import { isBlackListOfRoute } from "./router.helper";
import consts from "@/api/urls";

export default async function ({
  store,
  redirect,
  route,
  $auth,
  $cookiz,
  $axios,
}) {
  store.commit("data_card/clearFormData");
  store.commit("data_card/clearFilters");
  store.commit("blocks/clearBlock");
  store.commit("blocks/clearFilters");
  store.commit("data_card/setError", false);
  if (process.server) {
    const ref = $cookiz.get("ref");
    if ($auth.loggedIn) {
      $cookiz.remove("ref");
      redirect(ref);
    }
    if (!$auth.loggedIn) {
      await $auth.logout();
      $cookiz.set("ref", route.fullPath);
      redirect("/login");
    }
  }
  if (process.client) {
    if (!$cookiz.get("auth._token.local")) {
      await $auth.logout();
      $cookiz.set("ref", route.fullPath);
      redirect("/login");
    }
  }
  if ($auth.loggedIn) {
    await store.dispatch("menu/fetchMenuById", route.params);
    if ($auth.user.ID !== $cookiz.get("auth.user_id")) {
      try {
        const data = await $axios.get(`${consts.USERPROFILE}`);
        const user = data?.data[0]._data[0];
        if (user) {
          $auth.setUser(user);
        }
      } catch (e) {
        throw new Error("Не удалось обновить пользователя");
      }
    }
    if (
      isBlackListOfRoute(
        route.params.idModule,
        route.params.idParent,
        route.params.idItem
      ) === true
    ) {
      redirect("/error");
    }
  }
}
