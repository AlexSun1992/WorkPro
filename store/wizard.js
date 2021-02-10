/* eslint-disable */
export const state = () => ({
  data: {},
});

export const getters = {
  getWizard: (state) => state.data,
};

export const actions = {
  async fetchWizard({ commit, getters }, params) {
    await this.$axios
      .get(`/api/wizard/${params.idModule}/${params.idWizard}/${params.idCard}`)
      .then((res) => {
        commit("setWizard", res.data.data);
      });
  },
};

export const mutations = {
  setWizard(state, data) {
    state.data = data;
  },
};
