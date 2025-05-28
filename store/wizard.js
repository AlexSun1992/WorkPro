/* eslint-disable */
import { getErrorMessage } from "../utils/transform";
export const state = () => ({
  data: {},
  pages: null,
  caption: null,
  error: null,
  isErrorActionExecute: false,
  errorActionExecuteMessage: null,
  isError: false,
  isWizardButtonsLoading: false,
  isWizard: false,
});

export const getters = {
  getIsWizard: (state) => state.isWizard,
  getIsWizardButtonsLoading: (state) => state.isWizardButtonsLoading,
  getWizard: (state) => state.data,
  getWizardPages: (state) => state.pages,
  getWizardCaption: (state) => state.caption,
  getWizardErrorMessage: (state) => getErrorMessage(state.error),
  getWizardErrorActionExecuteMessage: (state) =>
    getErrorMessage(state.errorActionExecuteMessage),
  getWizardIsErrorActionExecute: (state) => state.isErrorActionExecute,
  getWizardData: (state) => state.data,
  getWizardIsError: (state) => state.isError,
  iconTabsCount: (state) => state.data?.ICONTABSCOUNT ?? 8,
};

export const actions = {
  isWizardButtonsLoading({ commit, getters }, params) {
    commit("setIsWizardButtonsLoading", params);
  },
  async fetchWizard({ commit, getters }, params) {
    try {
      commit("setWizardIsError", false);
      return await this.$axios
        .get(
          `/api/wizard/${params.idModule}/${params.idWizard}/${params.idCard}${
            params?.zone === "free" ? "?zone=free" : ""
          }`
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
  setIsWizard(state, data) {
    state.isWizard = data;
  },
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
  setIsWizardButtonsLoading(state, data) {
    state.isWizardButtonsLoading = data;
    this.commit("data_card/setLoading", data);
  },
  setWizardIsErrorActionExecute(state, data) {
    state.isErrorActionExecute = data;
  },
  setWizardErrorMessage(state, data) {
    state.error = data;
  },
  setWizardErrorActionExecuteMessage(state, data) {
    state.errorActionExecuteMessage = data;
  },
};
