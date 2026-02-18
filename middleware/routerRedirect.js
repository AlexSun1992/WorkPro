function getRedirectUrl(oldRelativePath, newRelativePath) {
  if (
    oldRelativePath !== undefined &&
    oldRelativePath !== null &&
    newRelativePath !== undefined &&
    newRelativePath !== null
  ) {
    const originalUrlWithFakeHostName = new URL(oldRelativePath, "https://reso.ru");
    const resultUrl = newRelativePath.concat(originalUrlWithFakeHostName.search.toString());
    return resultUrl;
  }
  throw new Error("Url отсутвует!");
}

export default function defineNuxtRouteMiddleware({ route, redirect, $auth }) {
  try {
    if (["782", "901"].includes(route.params.idItem) && ![1484278, 1781030].includes($auth.$state.user.ID)) {
      redirect(getRedirectUrl(route.fullPath, "/cabinet/55/0/871"));
    }
    if (route.params.idWizard === "744" && route.params.idItem === "745") {
      redirect({
        name: route.name,
        params: {
          ...route.params,
          idWizard: 1123,
          idItem: 1124,
        },
        query: route.query,
      });
    }
  } catch (error) {
    console.error("Произошла ошибка при редиректе: ".concat(error));
  }
}
