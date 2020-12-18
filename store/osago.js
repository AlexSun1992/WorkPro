/* eslint-disable */

export const state = () => ({
  id: 718,
  data: "",
});
export const getters = {
  getData: (state) => state.data,
};
export const actions = {
  async fetchData({ commit, getters, state }) {
    commit("setData", "This is OSAGO!");
  },
};
export const mutations = {
  setData(state, data) {
    console.log(data);
    state.data = data;
  },
};
