function getRedirectUrl(oldRelativePath, newRelativePath) {
  if (
    oldRelativePath !== undefined &&
    oldRelativePath !== null &&
    newRelativePath !== undefined &&
    newRelativePath !== null
  ) {
    const originalUrlWithFakeHostName = new URL(
      oldRelativePath,
      "https://reso.ru"
    );
    const resultUrl = newRelativePath.concat(
      originalUrlWithFakeHostName.search.toString()
    );
    return resultUrl;
  }
  throw new Error("Url отсутвует!");
}

export default function defineNuxtRouteMiddleware({ route, redirect, $auth }) {
  try {
    if (
      (route.params.idItem === "782" || route.params.idItem === "901") &&
      $auth.$state.user.ID !== 1484278 &&
      $auth.$state.user.ID !== 1781030
    ) {
      redirect(getRedirectUrl(route.fullPath, "/cabinet/55/0/871"));
    }
  } catch (error) {
    console.error("Произошла ошибка при редиректе: ".concat(error));
  }
}
