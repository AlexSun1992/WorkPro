/* eslint-disable */

export const state = () => ({
  id: 738,
  data: {},
  form: null,
  captions: null,
  cardCaption: null,
});
export const getters = {
  getData: (state) => state.data,
  getForm: (state) =>
    state.data.data ? state.data.data.map((a) => Object.assign({}, a)) : [],
  getCaptions: (state) => state.data.captions,
  getCardCaption: (state) => state.data.cardCaption,
  getDataFieldByFieldId: (state) => (id) => {
    return state.data.data.find((item) => item.fieldId == id);
  },
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
  async executeAction({ commit, getters, state }, params) {
    commit("setValueByFieldId", params);
    if (params.fieldId === 29914) {
      console.log(getters.getDataFieldByFieldId(29912).value);
      try {
        const REG_NUMBER = getters.getDataFieldByFieldId(29912).value;
        await this.$axios
          .get(encodeURI(`/free/v2/osago/findAuto?REG_NUMBER=${REG_NUMBER}`))
          .then((res) => {
            console.log(res.data);
            commit("setValueByFieldId", { fieldId: 29973, value: res.data });
          });
      } catch (e) {
        console.log(e);
      }
    }
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
  setValueByFieldId(state, data) {
    let field = state.data.data.find((item) => item.fieldId == data.fieldId);
    field.value = data.value;
  },
};
