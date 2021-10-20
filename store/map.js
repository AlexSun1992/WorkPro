/* eslint-disable */
export const state = () => ({
  regionsList: null,
  regionOffices: null,
});

export const actions = {
  async fetchAgencies({ commit }) {
    try {
      const { data } = await this.$axios.get(`/free/v2/agencies`);
      data.sort((a, b) => a.NDISTANSE - b.NDISTANSE);
      commit("setAgencies", data);
    } catch (e) {
      console.log(e);
    }
  },
  async fetchRegion({ commit }, params) {
    try {
      const { data } = await this.$axios.get(
        `/free/v2/agencies/${params.id}?lat=${params.coords[0]}&long=${params.coords[1]}`
      );
      data.sort((a, b) => a.NDISTANSE - b.NDISTANSE);
      commit("setRegionOffices", data);
    } catch (e) {
      console.log(e);
    }
  },
};

export const mutations = {
  setAgencies(state, params) {
    state.agencies = params;
  },
  setRegionsList(state, params) {
    state.regionsList = params;
  },
  setRegionOffices(state, params) {
    state.regionOffices = params;
  },
};

export const getters = {
  getAgencies(state) {
    return state.agencies;
  },
  getRegionsList(state) {
    return state.regionsList;
  },
  getRegionOffices(state) {
    return state.regionOffices;
  },
};
