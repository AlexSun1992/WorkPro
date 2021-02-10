/* eslint-disable */
export const state = () => ({
  data: {},
  pages: null,
});

export const getters = {
  getWizard: (state) => state.data,
  getWizardPages: (state) => state.pages,
};

export const actions = {
  async fetchWizard({ commit, getters }, params) {
    await this.$axios
      .get(`/api/wizard/${params.idModule}/${params.idWizard}/${params.idCard}`)
      .then((res) => {
        commit("setWizard", res.data.data);
        commit("setWizardPages", res.data.meta?.SPAGES);
      });
  },
};

export const mutations = {
  setWizard(state, data) {
    state.data = data;
  },
  setWizardPages(state, data) {
    state.pages = data;
  },
};
