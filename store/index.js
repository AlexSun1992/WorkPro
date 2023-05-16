import consts from "../api/urls";

export const actions = {
  async nuxtServerInit({ dispatch }, { params, $auth, $axios }) {
    try {
      if ($auth.loggedIn) {
        if (await dispatch("menu/fetchMenu", params)) {
          const data = await $axios.get(`${consts.USERPROFILE}`);
          const user = data?.data[0]._data[0];
          if (user) {
            $auth.setUser(user);
          }
          await dispatch("menu/fetchCounters", null);
        }
      }
    } catch (e) {
      console.error(e);
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
