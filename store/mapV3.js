export const state = () => ({
  regionOffices: null,
  agentsData: null,
  defaultRegion: 77,
  defaultCoords: [55.75396, 37.620393],
  city: null,
  loading: false,
});

export const actions = {
  async fetchRegion({ commit }, params) {
    try {
      commit("setLoading", true);

      const promiseOffices = new Promise((resolve, reject) => {
        resolve(
          this.$axios
            .get(
              `/system/modules/ru.reso.v2/actions/api/siteapi?query=Agencies&lat=${params.coords[0]}&long=${
                params.coords[1]
              }${params.id ? "&idregion=".concat(params.id) : ""}`
            )
            .then((res) => res.data)
        );
      });
      const promiseAgents = new Promise((resolve, reject) => {
        resolve(
          this.$axios
            .get(`/system/modules/ru.reso.v2/actions/api/siteapi?query=AgentsDataForOfficesMap`)
            .then((res) => res.data)
        );
      });
      await Promise.all([promiseOffices, promiseAgents]).then((values) => {
        const [promiseDataOffices, promiseDataAgents] = values;

        commit("setLoading", false);
        commit("setRegionOffices", promiseDataOffices);
        commit("setAgentsData", promiseDataAgents);
      });
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
  setAgentsData(state, params) {
    state.agentsData = params;
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
  getAgentsData(state) {
    return state.agentsData;
  },
  getCity(state) {
    return state.city;
  },
  getLoading(state) {
    return state.loading;
  },
};
