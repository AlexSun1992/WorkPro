export default function defineNuxtRouteMiddleware({ route, redirect, $auth }) {
  if (
    (route.params.idModule === "55" &&
      route.params.idParent === "0" &&
      route.params.idItem === "782" &&
      $auth.$state.user.ID !== 1484278 &&
      $auth.$state.user.ID !== 1781030) ||
    route.fullPath === "/cabinet/55/0/901/0"
  ) {
    redirect("/cabinet/55/0/871");
  }
}
