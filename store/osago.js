/* eslint-disable */

export const state = () => ({
  id: 738,
  form: null,
  captions: null,
  cardCaption: null,
  settings: null,
});
export const getters = {
  getForm: (state) => state.form,
  getCaptions: (state) => state.captions,
  getSettings: (state) => state.settings,
};
export const actions = {
  async fetchData({ commit, getters, state }) {
    try {
      await this.$axios.get(encodeURI(`/api/osago`)).then((res) => {
        commit("setForm", res.data.data);
        commit("setCaptions", res.data.captions);
        commit("setCardCaption", res.data.cardCaption);
        commit("setSettings", res.data.settings);
      });
    } catch (e) {
      console.log(e);
    }
  },
  updateCaptions({ commit, getters, state }, index) {
    commit("updateCaptions", index);
  },
};
export const mutations = {
  setForm(state, data) {
    state.form = data;
  },
  setCaptions(state, data) {
    state.captions = data;
  },
  updateCaptions(state, data) {
    state.captions = [...state.captions];
    state.captions[data].visible = !state.captions[data].visible;
  },
  setCardCaption(state, data) {
    state.cardCaption = data;
  },
  setSettings(state, data) {
    state.settings = data;
  },
};
