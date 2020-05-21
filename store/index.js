export const state = () => ({
  registrationError: null
})

export const actions = {
  async registerUser({commit}, params) {
    try {
      const regResponse = await this.$axios.post("/free/v2/registration", params);
      if (regResponse.data[0].MESSAGE_CODE == 200) {
        const authParams = {
          "username": params.PHONE,
          "password": params.PASSWORD,
          "mode": 2
        }
        const authResponse = await this.$axios.post("am/auth/v2/authorize", JSON.stringify(authParams));
        return {'ACCESS_TOKEN': authResponse.data.ACCESS_TOKEN}
      } else {
        return regResponse.data[0];
      }
    } catch(e) {
      console.log(e);
    }
  },

  async search({commit}, params) {
    try {
      const { data } = await this.$axios.get(`/wp-json/wp/v2/pages?search=${params}`);
      return data;
    } catch(e) {
      console.log(e);
    }
  },

  async getCode({commit}, params) {
    try {
      if (params.loginType === 'phone') {
        delete params.loginType;
        return await this.$axios.post("/free/v2/sendsmscode", params);
      } else {
        delete params.loginType;
        return await this.$axios.post("/free/v2/sendemailcode", params);
      }
    } catch(e) {
      console.log(e);
    }
  },

  async nuxtServerInit({ dispatch }, context) {
    let params;
    await dispatch('pages/setConfig', params);
    if (!context.params.pathMatch) {
      const mainPage = context.store.state.pages.config.wpreso_settings_index_page.value;
      params = `/${mainPage}`;
    } else {
      params = `/${context.params.pathMatch}`
    }
    await dispatch('pages/fetchPageByUrl', params);
    await dispatch('pages/setMenuIDs');
    await dispatch('pages/getMainMenu', context.store.getters['pages/getMainMenuId']);
    await dispatch('pages/getFooterMenu', context.store.getters['pages/getFooterMenuId']);

  },

  async resetPassword({commit}, params) {
    try {
      let response = await this.$axios.post("/free/v2/restorepassword", params);
      return response;
    } catch(e) {
      console.log(e);
    }
  },

  clearAxiosError({commit}) {
    commit('clearAxiosError')
  }
}

export const mutations = {
  setAxiosError(state, error) {
    if (error && error.response) {
      state.registrationError = error.response.data.INFO;
    }
  },

  clearAxiosError(state) {
    state.registrationError = null;
  }
}

export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn;
  },

  loggedInUser(state) {
    return state.auth.user;
  },

  getRegistrationError(state) {
    return state.registrationError;
  }
}
