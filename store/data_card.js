/* eslint-disable */

export const state = () => ({
  form: [],
  copyForm: [],
  cardId: null,
  captions: null,
  isError: false,
  errorMessage: null,
  cardCaption: null,
  cardChanged: false,
  saveButtonClicked: false,
});
export const getters = {
  getForm: (state) => state.form,
  cardChanged: (state) => state.cardChanged,
  saveButtonClicked: (state) => state.saveButtonClicked,
  getError: (state) => state.isError,
  getErrorMessage: (state) => state.errorMessage,
  cardCaption: (state) => state.cardCaption,
  getCopyForm: (state) => state.copyForm,
  getCardId: (state) => state.cardId,
  getCaptions: (state) => state.captions,
  getDataFieldByName: (state) => (name) => {
    return state.form.find((b) => b.name === name);
  },
  getDataFieldByFieldId: (state) => (id) => {
    return state.form.find((b) => b.fieldId == id);
  },
};
export const actions = {
  async fetchForm({ commit, getters }, params) {
    commit("setCardId", params.idCard);
    commit("clearFormData");
    try {
      await this.$axios
        .get(
          `/api/card/${params.idModule}/${params.idItem}/${params.idCard}/${params.idRel}`
        )
        .then((res) => {
          commit(
            "setForm",
            res.data.metaData.data.length ? res.data.metaData.data : res.data
          );
          commit(
            "setCopyForm",
            JSON.parse(JSON.stringify(res.data.metaData.data))
          );
          if (res.data.metaData.captions) {
            commit("setCaptions", res.data.metaData.captions);
          }
          commit("setCardCaption", res.data.metaData.cardCaption);
        });
    } catch (error) {
      commit("setError", true);
      commit("setErrorMessage", error.response.data);
    }
  },
  async saveDataCard({ commit }, params) {
    await this.$axios
      .post(
        `/api/card/${params.moduleId}/${params.itemId}/${params.cardId}`,
        params.form
      )
      .then(async (resp) => {
        commit("setCardId", resp.data.ID);
      });
  },
  async executeAction({ dispatch }, { rowId, itemId, actionId, body }) {
    try {
      await this.$axios
        .post(`/api/card/actionexec/${rowId}/${actionId}`, body || {})
        .then((resp) => {
          return resp;
        });
    } catch (e) {
      console.log(e);
      return e;
    }
  },
};
export const mutations = {
  cardChanged(state, data) {
    state.cardChanged = data;
  },
  saveButtonClicked(state, data) {
    state.saveButtonClicked = data;
  },
  filterFields(state, data) {
    state.form = state.form.filter((item) => {
      item.error = null;
      return !item.name.match(/^ID/);
    });
  },
  setForm(state, data) {
    state.form = data;
  },
  setError(state, data) {
    state.isError = data;
  },
  setErrorMessage(state, data) {
    state.errorMessage = data;
  },
  setCopyForm(state, data) {
    state.copyForm = data;
  },
  setCaptions(state, data) {
    const captions = data.split(";");
    captions.pop();
    state.captions = captions;
  },
  setFormField(state, data) {
    const item = state.form.find((d) => d.fieldId === data.fieldId);
    if (item) {
      item.value = data.value;
      if (item.required) {
        if (item.value == null || item.value == "") {
          item.state = false;
        }
        if (item.value) {
          item.state = null;
        }
        if (item.value && item.value.__ob__) {
          item.state = item.value.value ? null : false;
        }
      }
    }
  },
  setCardId(state, data) {
    state.cardId = data;
  },
  setCardCaption(state, data) {
    state.cardCaption = data;
  },
  clearFormData(state) {
    state.captions = null;
    state.form = [];
  },
  clearFormRelationField(state, data) {
    const item = state.form.find((d) => d.fieldRelation === data.fieldName);
    if (item) {
      item.value = {};
      item.state = false;
    }
  },
  setFieldError(state, data) {
    let [fieldName, fieldValue] = data.split("=");
    let field = state.form.find((item) => item.name === fieldName);
    field.error = fieldValue;
  },
};
