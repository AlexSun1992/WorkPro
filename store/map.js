/* eslint-disable */
export const state = () => ({
  regionsList: null,
  regionOffices: null,
  selectedRegion: null,
});

export const actions = {
  async fetchAgencies({ commit }) {
    try {
      const { data } = await this.$axios.get(`/free/v2/agencies`);
      commit("setAgencies", data);
    } catch (e) {
      console.log(e);
    }
  },
  async fetchRegionsList({ commit }) {
    try {
      const { data } = await this.$axios.get(`/free/v2/subject`);
      data.sort((a, b) => a.NORDER - b.NORDER);
      let result = data.reduce((acc, current) => {
        let firstLetter = current.SNAME[0].toLocaleUpperCase();
        if (!acc[firstLetter]) {
          acc[firstLetter] = { title: firstLetter, data: [current] };
        } else {
          acc[firstLetter].data.push(current);
        }
        return acc;
      }, {});
      commit("setRegionsList", result);
    } catch (e) {
      console.log(e);
    }
  },
  async fetchRegion({ commit }, params) {
    try {
      const { data } = await this.$axios.get(`/free/v2/agencies/${params.ID}`);
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
  setSelectedRegion(state, params) {
    state.selectedRegion = params;
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
  getSelectedRegion(state) {
    return state.selectedRegion;
  },
};
