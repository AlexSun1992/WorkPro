/* eslint-disable */
export const state = () => ({
  regionOffices: null,
  defaultRegion: 77,
  defaultCoords: [55, 37],
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
};

export const mutations = {
  setRegionOffices(state, params) {
    state.regionOffices = params;
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
};
