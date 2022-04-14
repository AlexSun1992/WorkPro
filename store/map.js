/* eslint-disable */
export const state = () => ({
  regionOffices: null,
  defaultRegion: 77,
  defaultCoords: [55.75396, 37.620393],
  city: null,
});

export const actions = {
  async fetchRegion({ commit }, params) {
    try {
      const { data } = await this.$axios.get(
        `/free/v2/agencies/${params.id}?lat=${params.coords[0]}&long=${params.coords[1]}`
      );
      commit("setRegionOffices", data);
    } catch (e) {
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
    console.log(params);
    state.city = params;
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
};
