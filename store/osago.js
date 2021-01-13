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
    return state.data.data.find((item) => item.fieldId === parseInt(id));
  },
};
export const actions = {
  async fetchData({ commit, getters, state }) {
    try {
      await this.$axios.get(encodeURI(`/api/osago`)).then((res) => {
        res.data.captions[0].visible = true;
        res.data.captions[0].displayed = true;
        res.data.captions[1].visible = false;
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
    let renderOptions = Array.from(
      { length: state.data.captions.length },
      () => {
        let obj = new Object();
        obj.visible = false;
        obj.displayed = false;
        obj.previewText = "";
        obj.loading = false;
        return obj;
      }
    );
    let page;
    let toggleDisplay = (page) => {
      renderOptions = renderOptions.map((item, index) => {
        if (index <= page) {
          item.displayed = true;
          return item;
        }
      });
    };
    let getPage = (id) => {
      let item = state.data.data.find((item) => {
        return item.fieldId === id;
      });
      return item.page + 1;
    };
    if (params.fieldId === 29914) {
      page = 1;
      console.log(getters.getDataFieldByFieldId(29912).value);
      try {
        const REG_NUMBER = getters.getDataFieldByFieldId(29912).value;
        if (!getters.getDataFieldByFieldId(29912).value) {
          return;
        }
        renderOptions[0].previewText = REG_NUMBER;
        renderOptions[0].loading = true;
        renderOptions[1].visible = true;
        commit("setLoading", renderOptions);
        await this.$axios
          .get(encodeURI(`/free/v2/osago/findAuto?REG_NUMBER=${REG_NUMBER}`))
          .then((res) => {
            renderOptions[0].loading = false;
            commit("setLoading", renderOptions);
            commit("setValueByFieldId", {
              fieldId: 29973,
              value: res.data.length
                ? `<ul>
                      <li>Марка-модель: <b>${res.data[0].SMODEL}</b></li>
                      <li>Тип ТС: <b>${res.data[0].IDCAR_BODY_TYPE}</b></li>
                      <li>Год выпуска: <b>${res.data[0].NBUILD_YEAR}</b></li>
                      <li>Мощность: <b>${res.data[0].NOUTPUT} л.с.</b></li>
                      <li>VIN: <b>${res.data[0].SVIN}</b></li>
                      <li>СТС: <b>${res.data[0].SSTS_NUMBER} от ${res.data[0].DTEH_OSMOTR_DATE}</b></li>
                      </ul>`
                : "<p>данные не обнаружены, ничего страшного, просим продолжить оформление</p>",
            });
          });
      } catch (e) {
        console.log(e);
      }
    } else if (params.fieldId === 29974) {
      page = getPage(29974);
    } else if (params.fieldId === 29975) {
      alert("Не реализовано");
    } else if (params.fieldId === 31112) {
      page = getPage(31112);
    } else if (params.fieldId === 31113) {
      page = getPage(31113);
    } else if (params.fieldId === 31114) {
      page = getPage(31114);
    } else if (params.fieldId === 31115) {
      page = getPage(31115);
    }
    renderOptions[page].visible = true;
    toggleDisplay(page);
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
    let field = state.data.data.find((item) => item.fieldId == data.fieldId);
    field.value = data.value;
  },
  togglePanel(state, data) {
    state.data.captions = state.data.captions.map((item, i) => {
      item.visible = data[i].visible;
      item.displayed = data[i].displayed;
      item.previewText = data[i].previewText;
      return item;
    });
  },
  setLoading(state, data) {
    state.data.captions = state.data.captions.map((item, i) => {
      item.loading = data[i].loading ? data[i].loading : !!data[i].loading;
      return item;
    });
  },
};
