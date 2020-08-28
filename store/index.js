export const state = () => ({
  registrationError: null
})

export const actions = {
  async registerUser({commit}, params) {
    try {
      debugger
      let headers = {
        headers: {'recaptcha': '03AERD8Xq2P3I8lQIIsMsc-Ri851n1aQ6SuOt-qdBOgQcvdgOP6bMm_HzXuu7Cbf3ABQSZLLwOyZfEnVDb3dbOe3vFSOzXRP6ru9S8lSaXkw3ljoWYz1NloWlb82RzdoT38xiD0JyWE1JkoxMM0KBASjJOzOANyLaesprUmS0TALkgMBYYjrzZma9RUE12n3aYQAC0hyf5_-AyuHDNGh-NoyX3fkVRomyoWLN-sbvqbDSmFYUqM_DTrAS9Ki_gII688KxYAauHVXITkayinhDRmOROxBVqzFlSLNCw2a23MvkPCtt1uHyJ2wHstJKI2Q8Ca05w7Tr5GexJBhvDDVObSU-ra1jl_pKShvhsidFBhgVg5hJ1DK_67rc'}
      }
      const regResponse = await this.$axios.post("/free/v2/registration", params, headers);
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

  // async getCode({commit}, params) {
  //   try {
  //     let recaptcha = params.token;
  //     let loginType = params.loginType;
  //     let headers = {
  //       headers: {'recaptcha': '03AERD8Xq2P3I8lQIIsMsc-Ri851n1aQ6SuOt-qdBOgQcvdgOP6bMm_HzXuu7Cbf3ABQSZLLwOyZfEnVDb3dbOe3vFSOzXRP6ru9S8lSaXkw3ljoWYz1NloWlb82RzdoT38xiD0JyWE1JkoxMM0KBASjJOzOANyLaesprUmS0TALkgMBYYjrzZma9RUE12n3aYQAC0hyf5_-AyuHDNGh-NoyX3fkVRomyoWLN-sbvqbDSmFYUqM_DTrAS9Ki_gII688KxYAauHVXITkayinhDRmOROxBVqzFlSLNCw2a23MvkPCtt1uHyJ2wHstJKI2Q8Ca05w7Tr5GexJBhvDDVObSU-ra1jl_pKShvhsidFBhgVg5hJ1DK_67rc'}
  //     }
  //     delete params.loginType;
  //     delete params.token;
  //     if (loginType === 'phone') {
  //       return await this.$axios.post("/free/v2/sendsmscode", params, headers);
  //     } else {
  //       return await this.$axios.post("/free/v2/sendemailcode", params, headers);
  //     }
  //   } catch(e) {
  //     console.log(e);
  //   }
  // },

  async getCode({commit}, params) {
    try {
      let recaptcha = params.token;
      let loginType = params.loginType;
      let headers = {
        headers: {'recaptcha': '03AERD8Xq2P3I8lQIIsMsc-Ri851n1aQ6SuOt-qdBOgQcvdgOP6bMm_HzXuu7Cbf3ABQSZLLwOyZfEnVDb3dbOe3vFSOzXRP6ru9S8lSaXkw3ljoWYz1NloWlb82RzdoT38xiD0JyWE1JkoxMM0KBASjJOzOANyLaesprUmS0TALkgMBYYjrzZma9RUE12n3aYQAC0hyf5_-AyuHDNGh-NoyX3fkVRomyoWLN-sbvqbDSmFYUqM_DTrAS9Ki_gII688KxYAauHVXITkayinhDRmOROxBVqzFlSLNCw2a23MvkPCtt1uHyJ2wHstJKI2Q8Ca05w7Tr5GexJBhvDDVObSU-ra1jl_pKShvhsidFBhgVg5hJ1DK_67rc'}
      }
      delete params.loginType;
      delete params.token;
      if (loginType === 'phone') {
        return await this.$axios.post("/free/v2/sendsmscode", params, headers);
      } else {
        return await this.$axios.post("/free/v2/sendemailcode", params, headers);
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
    await dispatch('pages/fetchPageByUrl', params, context);
    if(context.store.state.pages.currentPage.code !== "rest_post_invalid"){
      await dispatch('pages/setMenuIDs');
      await dispatch('pages/getMainMenu', context.store.getters['pages/getMainMenuId']);
      await dispatch('pages/getFooterMenu', context.store.getters['pages/getFooterMenuId']);
    }
    else{
      context.error({ statusCode: 404, message: 'Post not found' })
    }
  },

  async resetPassword({commit}, params) {
    try {
      let response = await this.$axios.post("/free/v2/restorepassword", params);
      return response;
    } catch(e) {
      console.log(e);
    }
  },

  async updateUser({commit}) {
    try {
      const { data } = await this.$axios.get('/am/main/v2/userinfo');
      commit('updateUser', data)
    } catch(e) {
      console.log(e);
    }
  },

  clearAxiosError({commit}) {
    commit('clearAxiosError')
  }
}

export const mutations = {
  setAxiosError(state, error, ) {
    if (error && error.response) {
      state.registrationError = error.response.data.INFO ? error.response.data.INFO : error.response.data.MESSAGE;
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
  }
}

export const getters = {
  isAuthenticated(state) {
    return state.auth?.user?.length;
  },

  loggedInUser(state) {
    return state.auth.user;
  },

  getRegistrationError(state) {
    return state.registrationError;
  }
}
