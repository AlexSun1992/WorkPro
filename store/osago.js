/* eslint-disable */

export const state = () => ({
  id: 738,
  data: {},
  form: null,
  captions: null,
  cardCaption: null,
  settings: null,
});
export const getters = {
  getData: (state) => state.data,
  getForm: (state) => state.data.data,
  getCaptions: (state) => state.data.captions,
  getCardCaption: (state) => state.data.cardCaption,
};
export const actions = {
  async fetchData({ commit, getters, state }) {
    try {
      await this.$axios.get(encodeURI(`/api/osago`)).then((res) => {
        commit("setData", res.data);
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
  setData(state, data) {
    state.data = data;
  },
  setForm(state, data) {
    state.data.form = data;
  },
  setCaptions(state, data) {
    state.data.captions = data;
  },
  updateCaptions(state, data) {
    state.data.captions = [...state.data.captions];
    state.data.captions[data].visible = !state.data.captions[data].visible;
  },
  setCardCaption(state, data) {
    state.data.cardCaption = data;
  },
  setSettings(state, data) {
    state.settings = data;
  },
};
