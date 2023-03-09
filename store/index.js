/* eslint-disable */
export const state = () => ({
  registrationError: null,
});

export const actions = {
  async nuxtServerInit({ dispatch, store }, { params, $cookiz, $auth }) {
    try {
      if ($cookiz.get("auth._token.local")) {
        await dispatch("menu/fetchMenu", params);
        await dispatch("menu/fetchCounters", null);
      }
    } catch (e) {
      console.error(e);
    }
  },
  async registerUser({ commit }, params) {
    try {
      const headers = {
        headers: { recaptcha: params.token },
      };
      delete params.token;
      const regResponse = await this.$axios.post(
        "/am/free/v2/registration",
        params,
        headers
      );
      return regResponse;
    } catch (e) {
      return e?.response;
    }
  },

  async search({ commit }, params) {
    try {
      const { data } = await this.$axios.get(
        `/wp-json/wp/v2/pages?search=${params}`
      );
      return data;
    } catch (e) {
      console.log(e);
    }
  },

  async getCode({ commit }, params) {
    try {
      const recaptcha = params.token;
      const loginType = params.loginType;
      const modeType = params.modeType;
      const headers = {
        headers: { recaptcha: recaptcha },
      };
      const error = params.error;
      delete params.loginType;
      delete params.token;
      delete params.modeType;
      delete params.error;
      if (
        loginType === "phone" ||
        modeType === "REG" ||
        modeType === "RECOVERY"
      ) {
        let method = error ? "sendsmscode2" : "sendsmscode";
        return await this.$axios.post(
          `/am/free/v2/${method}` +
            `${modeType === "RECOVERY" ? `?smstype=recovery` : ``}`,
          params,
          headers
        );
      } else {
        return await this.$axios.post(
          "/am/free/v2/sendemailcode",
          params,
          headers
        );
      }
    } catch (e) {
      return e?.response;
    }
  },

  async resetPassword({ commit }, params) {
    try {
      const response = await this.$axios.post(
        "/am/free/v2/restorepassword",
        params,
        config
      );
      return response;
    } catch (e) {
      console.log(e);
      return e.response;
    }
  },
  async updateUser({ commit }) {
    try {
      const { data } = await this.$axios.get("/am/main/v2/userinfo");
      commit("updateUser", data);
    } catch (e) {
      console.log(e);
    }
  },

  clearAxiosError({ commit }) {
    commit("clearAxiosError");
  },
};

export const mutations = {
  setAxiosError(state, error) {
    if (error && error.response) {
      state.registrationError = error.response.data.INFO
        ? error.response.data.INFO
        : error.response.data.MESSAGE;
    }
  },

  resetUser(state) {
    state.auth.user = [];
  },

  updateUser(state, params) {
    state.auth.user = params;
  },

  clearAxiosError(state) {
    state.registrationError = null;
  },
};

export const getters = {
  isAuthenticated(state) {
    return state.auth?.user?.length;
  },

  loggedInUser(state) {
    return state.auth.user;
  },

  getRegistrationError(state) {
    return state.registrationError;
  },
};
