import Axios from "axios";
import api from "../api/urls";
import { getErrorMessage } from "../utils/transform";

export const state = () => ({
  options: [],
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
  moduleId: false,
  menuId: false,
  source: "",
  recaptchaToken: null,
  updateValueFunction: null,
  updateEvent: null,
  filters: {},
});

export const getters = {
  getSuggestions: (state) => state.options,
  getUpdateEvent: (state) => state.updateEvent,
  getUpdateValueFunction: (state) => state.updateValueFunction,
  getRecaptchaToken: (state) => state.recaptchaToken,
  getForm: (state) => state.form,
  getFormParams: (state) => {
    return {
      idModule: state.moduleId,
      idItem: state.menuId,
      idCard: state.cardId,
      idRel: state.cardRelId,
    };
  },
  cardChanged: (state) => state.cardChanged,
  saveButtonClicked: (state) => state.saveButtonClicked,
  getError: (state) => state.isError,
  getSavedError: (state) => state.isSavedError,
  getErrorMessage: (state) => getErrorMessage(state.errorMessage),
  cardCaption: (state) => state.cardCaption,
  getCopyForm: (state) => state.copyForm,
  getCardId: (state) => state.cardId,
  getSource: (state) => state.source,
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
  getDataByFieldRelation: (state) => (name) => {
    return state.form.find((b) => b.fieldRelation === name);
  },
  getDataFieldByType: (state) => (name) => {
    return state.form.find((b) => b.type === name);
  },
  getDataFieldByFieldId: (state) => (id) => {
    return state.form.find((b) => b.fieldId == id);
  },
  getLoading: (state) => state.loading,
  getFilters: (state) => state.filters,
  getFiltersAllFields: (state) => {
    return state.form.reduce((accumulator, currentValue) => {
      if (
        currentValue.type === "enum" &&
        currentValue.name.substring(0, 2) === `FK`
      ) {
        return {
          ...accumulator,
          [currentValue.name.substring(2)]: currentValue.value?.value,
        };
      } else if (currentValue.type === "listSelect") {
        return {
          ...accumulator,
          ...currentValue.value?.value,
        };
      } else if (currentValue.type === "timestamp") {
        return {
          ...accumulator,

          [currentValue.name]: currentValue.value
            ? $nuxt
                .$moment(currentValue.value, ["DD-MM-YYYY", "YYYY-MM-DD"])
                .format("YYYY-MM-DD HH:mm:ss")
            : "",
        };
      } else {
        return {
          ...accumulator,
          [currentValue.name]: currentValue.value,
        };
      }
    }, {});
  },
};

export const actions = {
  async askSuggestions({ dispatch, commit, getters, state }, payload) {
    let url = "";
    if (payload.data.fieldId !== undefined) {
      url = `/api/dicwf/${payload.data.fieldId}/${payload.relationValue.value}`;
    }

    let response = await Axios({ url: url, method: "GET" });
    commit("setData", response.data);
  },

  async fetchForm({ dispatch, commit, getters, state }, params) {
    commit("setCardId", params.idCard);
    commit("setCardRelId", params.idRel);
    commit("setModuleId", params.idModule);
    commit("setMenuId", params.idItem);
    commit("setLoading", true);
    commit("setDisabled", true);
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
          `/api/card/${params.idModule}/${params.idItem}/${params.idCard}/${
            params.idRel
          }${params.zone === "free" ? "?zone=free" : ""}`
        );
      }
      await this.$axios
        .get(url)
        .then((res) => {
          commit("setLoading", false);
          commit("setDisabled", false);
          commit("setSavedError", false);
          commit(
            "setForm",
            res.data.metaData.data.length ? res.data.metaData.data : res.data
          );
          if (params.idCard === "0") {
            getters["getForm"].forEach((item) => {
              if (params.query[item.name]) {
                if (item.name.substring(0, 2) === `FK`) {
                  const text = params.query[item.name];
                  const s_value = params.query[item.name.substring(2)];
                  const value =
                    isNaN(s_value) === false ? parseInt(s_value) : s_value;
                  item.value = { text, value };
                } else {
                  item.value = params.query[item.name];
                }
              }
            });
          }
          if (res.data.metaData.data.length) {
            if (getters["getDataFieldByType"]("captcha")) {
              dispatch("fetchCaptcha", {
                params: getters["getFormParams"],
                data: getters["getDataFieldByType"]("captcha"),
              });
            }
          }
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
          console.log(error.response.data);
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
    console.log("params:", params);
    console.log("commit:", { commit });
    console.log("saveDataCard data_card.js");
    commit("setLoading", true);
    commit("setDisabled", true);
    try {
      console.log("Начало выполнения запроса");

      // let resp = await this.$axios
      //   .post(
      //     `
      // /am/main/v2/datacard2/48/809/42?REL=CAO18B7427923E407F4AB325204C1751
      // `
      //   )
      //   .then((resp) => {
      //     console.log("resp:", resp);
      //   });

      let resp = await this.$axios.post(
        `/api/card/${params.moduleId}/${params.itemId}/${params.cardId}/${
          params.relId
        }${params.zone === "free" ? "?zone=free" : ""}`,
        params.form
      );
      // Возвращает undefined params.relId

      commit("setLoading", false);
      commit("setDisabled", false);
      commit("setSavedError", false);
      commit("setCardId", resp.data.ID);
      commit("setCardRelId", resp.data.REL);
      return resp;
    } catch (e) {
      commit("setLoading", false);
      commit("setDisabled", false);
      commit("setSavedError", true);
      commit("setErrorMessage", e.response.data);
      return e.response;
    }
  },
  async executeAction(
    { dispatch, commit },
    { relId, relActionId, rowId, actionId, body }
  ) {
    try {
      return await this.$axios
        .post(
          `/api/card/actionexec/${rowId}/${actionId}/${relId}/${relActionId}`,
          body || {}
        )
        .then((resp) => {
          commit("setSavedError", false);
          return resp;
        });
    } catch (e) {
      commit("setLoading", false);
      commit("setDisabled", false);
      commit("setSavedError", true);
      commit("setErrorMessage", e.response.data);
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
  async fetchList({ commit, getters, state }, params) {
    try {
      return await this.$axios
        .get(
          encodeURI(
            `/api/list/${params.idModule}/${params.idItem}/[]${
              params.zone === "free" ? "?zone=free" : ""
            }`
          )
        )
        .then((res) => {
          commit("setCardId", res.data.items[0].ID);
          commit("setCardRelId", res.data.items[0].REL);
          commit("setModuleId", params.idModule);
          commit("setMenuId", params.idItem);
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
  async fetchDic(
    { commit, getters, state },
    { isRelation, fieldRelation, fieldId, id, dic }
  ) {
    try {
      let relationValue;
      let url;
      if (isRelation && fieldRelation) {
        relationValue = getters["getDataFieldByName"](fieldRelation);
        url = `/api/dicwf/${fieldId}/${relationValue.value.value}`;
      } else {
        url = `/api/dic/55/${id}/${dic}`;
      }
      const data = await this.$axios.get(encodeURI(url));
      commit("setEnumOptions", { options: data.data, fieldId: fieldId });
    } catch (error) {
      if (error.response) {
        commit("setError", true);
        commit("setErrorMessage", error.response.data);
        return error.response;
      }
    }
  },
  async fetchCard({ commit, dispatch, getters, state }, params) {
    try {
      dispatch("cancelRequest");
      commit("setSource", this.$axios.CancelToken.source());
      let result = await this.$axios[params.method](params.url, {
        cancelToken: getters.getSource.token,
      });

      if (result) {
        commit("setSource", "");
        return result.data[0];
      }
    } catch (e) {
      console.log(e);
    }
  },
  cancelRequest({ commit, getters, state }) {
    if (getters.getSource) {
      getters.getSource.cancel("Cancelled");
    }
  },
};
export const mutations = {
  setData(state, suggestions) {
    state.options = suggestions;
  },

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
    if (item !== undefined) {
      item.value = data.value;
      if (item.required) {
        item.state = false;
        if (
          item.value !== null &&
          item.value !== "" &&
          item.value !== undefined &&
          (item.error === null || item.error === undefined)
        ) {
          item.state = true;
          item.checked = true;
        }
        if (item.value && item.type === "enum") {
          if (item.value.value === undefined && item.options) {
            item.state = null;
            item.checked = false;
            if (item.options.length === 1) {
              item.value = item.options[0];
            }
          } else {
            item.state =
              item.value.value || item.value.value == 0 ? true : false;
          }
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
    console.log("setCardRelId");
    state.cardRelId = data;
  },
  setModuleId(state, data) {
    state.moduleId = data;
  },
  setMenuId(state, data) {
    state.menuId = data;
  },
  setCardCaption(state, data) {
    state.cardCaption = data;
  },
  clearFormData(state) {
    state.captions = null;
    state.form = [];
  },
  clearFormRelationField(state, { name }) {
    let currentFieldName = name;
    while (true) {
      let item = state.form.find((d) => d.fieldRelation === currentFieldName);
      if (item) {
        item.value = {};
        item.options = [];
        currentFieldName = item.name;
      } else {
        break;
      }
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

  reverseBtnIsSave(state) {
    state.isSave = false;
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
    item.state = null;
    item.value = null;
  },
  setSource(state, params) {
    state.source = params;
  },
  setRecaptchaToken(state, params) {
    state.recaptchaToken = params;
  },
  setUpdateValueFunction(state, params) {
    state.updateValueFunction = params;
  },
  setUpdateEvent(state, params) {
    state.updateEvent = params;
  },
  setEnumOptions(state, params) {
    const item = state.form.find((d) => d.fieldId === params.fieldId);
    item.options = params.options;
    if (item.options.length === 1) {
      item.value = item.options[0];
    }
    if (item.options.length === 2) {
      item.value = item.options[1];
    }
  },
  setFilters(state, data) {
    state.filters = { ...state.filters, ...data };
  },
};
