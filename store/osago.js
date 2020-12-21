/* eslint-disable */

export const state = () => ({
  id: 738,
  form: null,
  captions: null,
  cardCaption: null,
});
export const getters = {
  getForm: (state) => state.form,
  getCaptions: (state) => state.captions,
};
export const actions = {
  async fetchData({ commit, getters, state }) {
    try {
      await this.$axios.get(encodeURI(`/api/osago`)).then((res) => {
        commit("setForm", res.data.data);
        commit("setCaptions", res.data.captions);
        commit("setCardCaption", res.data.cardCaption);
      });
    } catch (e) {
      console.log(e);
    }
  },
};
export const mutations = {
  setForm(state, data) {
    state.form = data;
  },
  setCaptions(state, data) {
    state.captions = data;
  },
  setCardCaption(state, data) {
    state.cardCaption = data;
  },
};
