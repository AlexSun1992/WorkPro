/* eslint-disable */
export const state = () => ({
  list: [],
});

export const getters = {
  getList: (state) => state.list,
  getItemOfListById: (state) => (id) => {
    return state.list.items.find((b) => b.ID === parseInt(id));
  },
};

export const actions = {
  async fetchList({ commit, getters }, params) {
    await this.$axios
      .get(`/api/list/${params.idModule}/${params.idWizard}/[]`)
      .then((res) => {
        commit("setList", res.data);
      });
  },
};

export const mutations = {
  setList(state, data) {
    state.list = data;
  },
};
