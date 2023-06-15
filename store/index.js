import consts from "../api/urls";

export const actions = {
  async nuxtServerInit(
    { dispatch },
    { params, $auth, $axios, req, $winstonLog }
  ) {
    try {
      $winstonLog.log("info", `HTTP GET ${req.url}`, {
        url: req.url,
        userid: req?.cookies["auth.user_id"],
      });
      if ($auth.loggedIn) {
        if (await dispatch("menu/fetchMenu", params)) {
          const data = await $axios.get(`${consts.USERPROFILE}`);
          const user = data?.data[0]._data[0];
          if (user) {
            $auth.setUser(user);
            $auth.$storage.setCookie("user_id", user.ID);
          }
          await dispatch("menu/fetchCounters", null);
        }
      }
    } catch (e) {
      $winstonLog.log("error", `HTTP GET ${req.url}`, {
        url: req.url,
        userid: req?.cookies["auth.user_id"],
      });
    }
  },
};

export const getters = {
  isAuthenticated(state) {
    return state.auth?.user?.length;
  },
  loggedInUser(state) {
    return state.auth.user;
  },
};
