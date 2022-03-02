/* eslint-disable */
export default function ({ app, store, redirect, route }) {
  store.commit("data_card/clearFormData");
  store.commit("data_card/setError", false);
  if (process.server) {
    console.log("guest");
    app.$cookiz.remove("url");
    app.$auth.setUserToken(
      app.$cookiz.get("auth._token.local"),
      app.$cookiz.get("auth._refresh_token.local")
    );

    ////-- код, ломающий редирект (в рамках задачи LK2-398)/////
    // return app.$auth
    //   .setUserToken(
    //     app.$cookiz.get("auth._token.local"),
    //     app.$cookiz.get("auth._refresh_token.local")
    //   )
    //   .then((response) => {
    //     return redirect(route.path);
    //   })
    //   .catch(() => {
    //     return redirect("/login");
    //   });
    //////-----///////////
  }

  if (!app.$cookiz.get("auth._token.local")) {
    const homePage = "http://localhost:8080";

    const target = new URL("/login", homePage);

    target.searchParams.set("ref", route.fullPath);

    const redirectUrl = `${target.pathname}${target.search}`;

    if (process.client) {
      if (window !== undefined) {
        window.location.href = `${redirectUrl}`;
      }
    } else {
      return redirect(`${redirectUrl}`);
    }
  }
}
