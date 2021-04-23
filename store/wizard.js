/* eslint-disable */
import { getErrorMessage } from "../utils/transform";
export const state = () => ({
  data: {},
  pages: null,
  caption: null,
  error: null,
  isError: false,
});

export const getters = {
  getWizard: (state) => state.data,
  getWizardPages: (state) => state.pages,
  getWizardCaption: (state) => state.caption,
  getWizardErrorMessage: (state) => getErrorMessage(state.error),
  getWizardIsError: (state) => state.isError,
};

export const actions = {
  async fetchWizard({ commit, getters }, params) {
    try {
      commit("setWizardIsError", false);
      return await this.$axios
        .get(
          `/api/wizard/${params.idModule}/${params.idWizard}/${params.idCard}`
        )
        .then((res) => {
          commit("setWizard", res.data.data);
          commit("setWizardPages", res.data.meta?.SPAGES);
          commit("setWizardCaption", res.data.meta?.SCARDCAPTION);
        });
    } catch (e) {
      commit("setWizardIsError", true);
      commit("setWizardErrorMessage", e.response?.data);
      return e.response;
    }
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
  setWizardIsError(state, data) {
    state.isError = data;
  },
  setWizardErrorMessage(state, data) {
    state.error = data;
  },
};
