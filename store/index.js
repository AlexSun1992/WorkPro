export const state = () => ({
  registrationError: null
})

export const actions = {
  async registerUser({commit}, params) {
    try {
      // const RECAPTCHA = params.RECAPTCHA;
      // delete params.RECAPTCHA;
      // return await this.$axios.post("/free/v2/registration", params, {
      //   headers: {
      //     RECAPTCHA
      //   }
      // });
      const regResponse = await this.$axios.post("/free/v2/registration", params);
      if (regResponse.data[0].MESSAGE_CODE == 200) {
        const authParams = {
          "username": params.PHONE,
          "password": params.PASSWORD,
          "mode": 2
        }
        const authResponse = await this.$axios.post("am/auth/v2/authorize", JSON.stringify(authParams));
        return {'ACCESS_TOKEN': authResponse.data.ACCESS_TOKEN}
      }
    } catch(e) {
      console.log(e);
    }
  },

  async getCode({commit}, params) {
    try {
      return await this.$axios.post("/free/v2/sendsmscode", params);
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
    state.registrationError = error;
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
