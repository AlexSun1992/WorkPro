/* eslint-disable */
export const state = () => ({
  data: {},
  pages: null,
  caption: null,
});

export const getters = {
  getWizard: (state) => state.data,
  getWizardPages: (state) => state.pages,
  getWizardCaption: (state) => state.caption,
};

export const actions = {
  async fetchWizard({ commit, getters }, params) {
    await this.$axios
      .get(`/api/wizard/${params.idModule}/${params.idWizard}/${params.idCard}`)
      .then((res) => {
        console.log(res);
        commit("setWizard", res.data.data);
        commit("setWizardPages", res.data.meta?.SPAGES);
        commit("setWizardCaption", res.data.meta?.SCARDCAPTION);
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
  setWizardCaption(state, data) {
    state.caption = data;
  },
};
