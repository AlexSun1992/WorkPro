export const state = () => ({
  registrationError: null
})

export const actions = {
  async registerUser(params) {
    try {
      return await this.$axios.post("/free/v2/registration", params);
    } catch(e) {
      console.log(e);
    }
  }
}

export const mutations = {
  setAxiosError(state, error) {
    state.registrationError = error;
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
