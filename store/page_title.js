/* eslint-disable */
export const state = () => ({
  data: {},
});

export const getters = {
  getPageTitle: (state) => state.data,
};

export const actions = {
  async fetchPageTitle({ commit }, params) {},
};

export const mutations = {
  setPageTitle(state, data) {
    state.data = data;
  },
};
