/* eslint-disable */
import api from "@/api/urls";
import { getErrorMessage } from "../utils/transform";

export const state = () => ({
  form: [],
  copyForm: [],
  oneToManyData: { table: {}, form: null },
  cardId: null,
  cardRelId: null,
  captions: null,
  isError: false,
  isSavedError: false,
  errorMessage: null,
  cardCaption: null,
  cardChanged: false,
  saveButtonClicked: false,
  listPath: "",
  actionParams: [],
  isSave: true,
  isReadOnly: false,
  loading: false,
});

export const getters = {
  getForm: (state) => state.form,
  cardChanged: (state) => state.cardChanged,
  saveButtonClicked: (state) => state.saveButtonClicked,
  getError: (state) => state.isError,
  getSavedError: (state) => state.isSavedError,
  getErrorMessage: (state) => getErrorMessage(state.errorMessage),
  cardCaption: (state) => state.cardCaption,
  getCopyForm: (state) => state.copyForm,
  getCardId: (state) => state.cardId,
  getCardRelId: (state) => state.cardRelId,
  getCaptions: (state) => state.captions,
  getBtnSave: (state) => state.isSave,
  getReadOnly: (state) => state.isReadOnly,
  getActionParams: (state) =>
    typeof state.actionParams.map === "function"
      ? state.actionParams.map((a) => Object.assign({}, a))
      : [],
  getOneToManyDataTable: (state) => state.oneToManyData.table,
  getOneToManyDataForm: (state) => state.oneToManyData.form,
  getDataFieldByName: (state) => (name) => {
    return state.form.find((b) => b.name === name);
  },
  getDataFieldByFieldId: (state) => (id) => {
    return state.form.find((b) => b.fieldId == id);
  },
  getLoading: (state) => state.loading,
};
export const actions = {
  async fetchForm({ dispatch, commit, getters, state }, params) {
    commit("setCardId", params.idCard);
    commit("setCardRelId", params.idRel);
    if (state.cardId !== params.idCard || !params.idRel) {
      commit("clearFormData");
    }
    try {
      let url;
      if (params.idWizard && params.idCard === "0") {
        url = encodeURI(
          `/api/card/${params.idModule}/${params.idItem}/${params.idWizard}/${params.idCard}/0`
        );
      } else {
        url = encodeURI(
          `/api/card/${params.idModule}/${params.idItem}/${params.idCard}/${params.idRel}`
        );
      }
      await this.$axios
        .get(url)
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
          if (
            res.data.metaData.btnSave === true ||
            res.data.metaData.btnSave === false
          ) {
            commit("setBtnSave", res.data.metaData.btnSave);
          }
          if (
            res.data.metaData.readonly === true ||
            res.data.metaData.readonly === false
          ) {
            commit("setReadOnly", res.data.metaData.readonly);
          }
          commit("setCardCaption", res.data.metaData.cardCaption);
        })
        .catch((error) => {
          commit("setError", true);
          commit("setErrorMessage", error.response.data);
        });
    } catch (error) {
      if (error.response) {
        commit("setLoading", false);
        commit("setError", true);
        commit("setErrorMessage", error.response.data);
      }
    }
  },

  async fetchOneToManyDataTable({ commit, getters, state }, params) {
    try {
      await this.$axios
        .get(
          encodeURI(
            `/api/onetomanylist/${params.routeParams.idCard}/${params.id}/${params.routeParams.idRel}`
          )
        )
        .then((res) => {
          commit("setOneToManyDataTable", res.data);
        });
    } catch (error) {
      if (error.response) {
        commit("setError", true);
        commit("setErrorMessage", error.response.data);
      }
    }
  },
  async fetchOneToManyDataForm({ commit, getters, state }, params) {
    try {
      await this.$axios
        .get(
          encodeURI(
            `/api/card/${params.idModule}/${params.idItem}/${params.idCard}/${params.idRel}`
          )
        )
        .then((res) => {
          commit("setOneToManyDataForm", res.data);
        });
    } catch (error) {
      if (error.response) {
        commit("setError", true);
        commit("setErrorMessage", error.response.data);
      }
    }
  },
  async saveDataCard({ commit, state, dispath }, params) {
    commit("setLoading", true);
    commit("setDisabled", true);
    try {
      let resp = await this.$axios.post(
        `/api/card/${params.moduleId}/${params.itemId}/${params.cardId}/${params.relId}`,
        params.form
      );
      commit("setLoading", false);
      commit("setDisabled", false);
      commit("setCardId", resp.data.ID);
      commit("setCardRelId", resp.data.REL);
      return resp;
    } catch (e) {
      commit("setDisabled", false);
      return e.response;
    }
  },
  async executeAction(
    { dispatch },
    { relId, relActionId, rowId, actionId, body }
  ) {
    try {
      return await this.$axios
        .post(
          `/api/card/actionexec/${rowId}/${actionId}/${relId}/${relActionId}`,
          body || {}
        )
        .then((resp) => {
          return resp;
        });
    } catch (e) {
      return e.response;
    }
  },
  async fetchActionParams(
    { dispatch, commit },
    { moduleId, actionId, cardId }
  ) {
    try {
      //commit("setLoading", true);
      //commit("setDisabled", true);
      return await this.$axios
        .get(`/api/action/${moduleId}/${actionId}/${cardId}`)
        .then((resp) => {
          //commit("setLoading", false);
          //commit("setDisabled", false);
          commit("setActionParams", resp.data);
          return resp.data;
        });
    } catch (e) {
      commit("setLoading", false);
      commit("setDisabled", false);
      return e;
    }
  },
  setLoading({ commit }, params) {
    commit("setLoading", params);
  },
  async fetchCaptcha({ commit, getters, state }, { params, data }) {
    try {
      return await this.$axios
        .get(
          encodeURI(
            `${api?.CAPTCHA}?project=${params.idModule}/${params.idItem}&id=${params.idCard}`
          )
        )
        .then((res) => {
          commit("setCaptcha", { captcha: res.data, data: data });
          return res.data;
        });
    } catch (error) {
      if (error.response) {
        commit("setError", true);
        commit("setErrorMessage", error.response.data);
        return error.response;
      }
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
  setOneToManyDataTable(state, data) {
    state.oneToManyData.table = data;
  },
  setOneToManyDataForm(state, data) {
    state.oneToManyData.form = data;
  },
  setError(state, data) {
    state.isError = data;
  },
  setSavedError(state, data) {
    state.isSavedError = data;
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
          item.state = item.value.value || item.value.value == 0 ? null : false;
        }
      }
    }
  },

  setActionParamsField(state, data) {
    const item = state.actionParams.find((d) => d.name === data.name);
    item.value = data.value;
  },
  setCardId(state, data) {
    state.cardId = data;
  },
  setCardRelId(state, data) {
    state.cardRelId = data;
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
    }
  },
  setFieldError(state, data) {
    try {
      let [fieldName, fieldValue] = data.split("=");
      let field = state.form.find((item) => item.name === fieldName);
      field.error = fieldValue || data;
    } catch (error) {
      // console.log(error);
    }
  },
  setListPath(state, data) {
    state.listPath = data;
  },
  setActionParams(state, data) {
    state.actionParams = data;
  },
  setBtnSave(state, data) {
    state.isSave = data;
  },
  setReadOnly(state, data) {
    state.isReadOnly = data;
  },
  setLoading(state, params) {
    state.loading = params;
  },
  setDisabled(state, params) {
    if (Array.isArray(state.form)) {
      state.form = state.form.map((item) => {
        let copyField = state.copyForm.find(
          (field) => field.fieldId === item.fieldId
        );
        if (copyField.readonly) {
          item.readonly = true;
        } else {
          item.readonly = params;
        }
        return item;
      });
    }
  },
  setCaptcha(state, data) {
    const item = state.form.find((d) => d.fieldId === data.data.fieldId);
    item.captcha = data.captcha;
  },
};
