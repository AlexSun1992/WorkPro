import menuSettings from "../converters/menuSettings";

export const actions = {
  async nuxtServerInit(
    { dispatch, commit },
    { params, $auth, $axios, req, $winstonLog }
  ) {
    try {
      $winstonLog.log("info", `HTTP GET ${req.url}`, {
        url: req.url,
        userid: req?.cookies["auth.user_id"],
      });
      if ($auth.loggedIn) {
        await this.$axios.get("/api/module").then(async (res) => {
          if (res) {
            commit("menu/setMenu", res.data);

            if (params) {
              commit(
                "menu/setSettings",
                menuSettings.getData(res.data, params)
              );
            }
            await this.$axios.get(`/am/main/v2/userinfo`).then((data) => {
              const user = data?.data[0]._data[0];
              if (user) {
                this.$auth.setUser(user);
                this.$auth.$storage.setCookie("user_id", user.ID);
              }
            });
            await dispatch("menu/fetchCounters", null);
            return res;
          }
          throw new Error("Error /api/module");
        });
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
