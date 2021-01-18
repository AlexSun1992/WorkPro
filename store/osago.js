/* eslint-disable */

import {
  toggleDisplay,
  getPage,
  getOptions,
  carTemplate,
  getTemplate,
} from "../utils/osago";

export const state = () => ({
  id: 738,
  data: {},
  form: null,
  captions: null,
  cardCaption: null,
  carInfo: null,
});
export const getters = {
  getData: (state) => state.data,
  getForm: (state) =>
    state.data.data ? state.data.data.map((a) => Object.assign({}, a)) : [],
  getCaptions: (state) => state.data.captions,
  getCardCaption: (state) => state.data.cardCaption,
  getDataFieldByFieldId: (state) => (id) => {
    return state.data.data.find((item) => item.fieldId === parseInt(id));
  },
};
export const actions = {
  async fetchData({ commit, getters, state }) {
    try {
      await this.$axios.get(encodeURI(`/api/osago`)).then((res) => {
        res.data.captions[0].visible = true;
        res.data.captions[0].displayed = true;
        // res.data.captions[1].visible = false;
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
    let page;
    let renderOptions = getOptions(state);
    if (params.fieldId === 29914) {
      page = getPage(29914, state);
      try {
        const REG_NUMBER = getters.getDataFieldByFieldId(29912).value;
        if (!getters.getDataFieldByFieldId(29912).value) {
          return;
        }
        renderOptions[0].previewText = REG_NUMBER;
        renderOptions[0].loading = true;
        commit("setLoading", renderOptions);
        await this.$axios
          .get(
            encodeURI(
              `/free/v2/osago/findAuto?REG_NUMBER=${REG_NUMBER}&${Math.random()}`
            )
          )
          .then((res) => {
            commit("setCarInfo", res.data[0]);
            renderOptions[0].loading = false;
            commit("setLoading", renderOptions);
            commit("setValueByFieldId", {
              fieldId: 29973,
              value: res.data.length
                ? getTemplate(res)
                : "<p>данные не обнаружены, ничего страшного, просим продолжить оформление</p>",
            });
          });
      } catch (e) {
        console.log(e);
      }
    } else if (params.fieldId === 29974) {
      page = getPage(29974, state);
      state.data.data.forEach((item) => {
        if (state.carInfo[item.name]) {
          if (item.name === "OUTPUT") {
            commit("setValueByFieldId", {
              fieldId: 31045,
              value:
                Math.round((Number(state.carInfo[item.name]) * 100) / 1.3596) /
                100,
            });
          }
          commit("setValueByFieldId", {
            fieldId: item.fieldId,
            value: state.carInfo[item.name],
          });
        }
      });
    } else if (params.fieldId === 29975) {
      alert("Не реализовано");
    } else if (params.fieldId === 31112) {
      page = getPage(31112, state);
    } else if (params.fieldId === 31113) {
      page = getPage(31113, state);
    } else if (params.fieldId === 31114) {
      page = getPage(31114, state);
    } else if (params.fieldId === 31115) {
      page = getPage(31115, state);
    } else return;
    if (renderOptions[page]) {
      renderOptions[page].visible = true;
    }
    toggleDisplay(page, renderOptions);
    commit("togglePanel", renderOptions);
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
    if (!data.fieldId) return;
    let field = state.data.data.find((item) => item.fieldId == data.fieldId);
    field.value = data.value;
  },
  togglePanel(state, data) {
    state.data.captions = state.data.captions.map((item, i) => {
      if (data[i]) {
        item.visible = data[i].visible;
        item.displayed = data[i].displayed;
        item.previewText = data[i].previewText;
      }
      return item;
    });
  },
  setLoading(state, data) {
    state.data.captions = state.data.captions.map((item, i) => {
      item.loading = data[i].loading ? data[i].loading : !!data[i].loading;
      return item;
    });
  },
  setCarInfo(state, data) {
    state.carInfo = data;
  },
};
