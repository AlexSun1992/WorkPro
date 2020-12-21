/* eslint-disable */

export const state = () => ({
  id: 738,
  form: [],
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
        commit(
          "setForm",
          res.data.metaData.data.length ? res.data.metaData.data : res.data
        );

        if (res.data.metaData.captions) {
          commit("setCaptions", res.data.metaData.captions);
        }
        commit("setCardCaption", res.data.metaData.cardCaption);
      });
    } catch (e) {
      console.log(e);
    }
  },
};
export const mutations = {
  setCaptions(state, data) {
    const captions = data.split(";");
    captions.pop();
    state.captions = captions;
  },
  setCardCaption(state, data) {
    state.cardCaption = data;
  },
  setForm(state, data) {
    state.form = data;
  },
};
