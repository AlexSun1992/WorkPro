/* eslint-disable */
export const state = () => ({
  regionOffices: null,
  defaultRegion: 77,
  defaultCoords: [55.75396, 37.620393],
  city: null,
  loading: false,
});

export const actions = {
  async fetchRegion({ commit }, params) {
    try {
      commit("setLoading", true);
      const { data } = await this.$axios.get(
        `/am/free/v2/siteapi/std/agencies/list?lat=${params.coords[0]}&long=${params.coords[1]}${params.id ? ('&idregion=').concat(params.id) : ''}`
      );
      commit("setLoading", false);
      commit("setRegionOffices", data);
    } catch (e) {
      commit("setLoading", false);
      console.log(e);
    }
  },
  setCity({ commit }, params) {
    commit("setCity", params);
  },
};

export const mutations = {
  setRegionOffices(state, params) {
    state.regionOffices = params;
  },
  setCity(state, params) {
    state.city = params;
  },
  setLoading(state, params) {
    state.loading = params;
  },
};

export const getters = {
  getDefaultRegion(state) {
    return state.defaultRegion;
  },
  getDefaultCoords(state) {
    return state.defaultCoords;
  },
  getRegionOffices(state) {
    return state.regionOffices;
  },
  getCity(state) {
    return state.city;
  },
  getLoading(state) {
    return state.loading;
  },
};
