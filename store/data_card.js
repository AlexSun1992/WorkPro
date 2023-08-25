/* eslint-disable no-param-reassign */
import Axios from "axios";
import api from "../api/urls";
import { getErrorMessage } from "../utils/transform";
import converter from "../converters/dataform";
import { convertUploaderFilesToFormData } from "./data_card.helpers";
import formConverter from "@/converters/dataform";

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
  saveButtonClickedAmount: null,
  beforeSavePromises: [],
  listPath: "",
  actionParams: [],
  isSave: true,
  isCancel: true,
  isReadOnly: false,
  loading: false,
  moduleId: false,
  menuId: false,
  source: "",
  updateEvent: null,
  filters: {},
  visible: {},
  addFields: {},
  isFilterVisible: false,
});
export const getters = {
  getFiltersVisibleStatus: (state) => state.isFilterVisible,
  getSuggestions: (state) => state.options,
  getUpdateEvent: (state) => state.updateEvent,
  getForm: (state) => state.form,
  getFormParams: (state) => ({
    idModule: state.moduleId,
    idItem: state.menuId,
    idCard: state.cardId,
    idRel: state.cardRelId,
  }),
  cardChanged: (state) => state.cardChanged,
  saveButtonClicked: (state) => state.saveButtonClicked,
  saveButtonClickedAmount: (state) => state.saveButtonClickedAmount,
  getError: (state) => state.isError,
  getSavedError: (state) => state.isSavedError,
  getErrorMessage: (state) => {
    if (typeof getErrorMessage(state.errorMessage) === "object") {
      return getErrorMessage(state.errorMessage)?.description;
    }
    return getErrorMessage(state.errorMessage);
  },
  cardCaption: (state) => state.cardCaption,
  getCopyForm: (state) => state.copyForm,
  getCardId: (state) => state.cardId,
  getSource: (state) => state.source,
  getCardRelId: (state) => state.cardRelId,
  getCaptions: (state) => state.captions,
  getBtnSave: (state) => state.isSave,
  getBtnCancel: (state) => state.isCancel,
  getReadOnly: (state) => state.isReadOnly,
  getActionParams: (state) =>
    typeof state.actionParams.map === "function"
      ? state.actionParams.map((a) => {
          const obj = { ...a };
          if (obj.fromDataCard === true) {
            obj.value = state.form.find((b) => b.name === obj.name)?.value;
          }
          return { ...obj };
        })
      : [],
  getOneToManyDataTable: (state) => state.oneToManyData.table,
  getOneToManyDataForm: (state) => state.oneToManyData.form,
  getDataFieldByName: (state) => (name) =>
    state.form.find((b) => b.name === name),
  getDataFieldsByNames: (state) => (names) =>
    state.form.filter((b) => {
      let name;
      if (b.name.substring(0, 2) === `FK`) {
        name = b.name.substring(2);
        return names.includes(name);
      }
      return names.includes(b.name) && b.name !== "ID";
    }),
  getDataByFieldRelation: (state) => (name) =>
    state.form.find((b) => b.fieldRelation === name),
  getDataFieldByType: (state) => (name) =>
    state.form.find((b) => b.type === name),
  getDataFieldByFieldId: (state) => (id) =>
    state.form.find((b) => b.fieldId == id),
  getLoading: (state) => state.loading,
  getFilters: (state) => state.filters,
  getVisible: (state) => state.visible,
  getAddFields: (state) => state.addFields,
  getFiltersAllFields: (state) =>
    state.form.reduce((accumulator, currentValue) => {
      if (
        currentValue.type === "enum" &&
        currentValue.name.substring(0, 2) === `FK`
      ) {
        return {
          ...accumulator,
          [currentValue.name.substring(2)]: currentValue.value?.value,
        };
      }
      if (currentValue.type === "listSelect") {
        return {
          ...accumulator,
          ...state.filters,
        };
      }
      if (currentValue.type === "DoctorSchedule") {
        return {
          ...accumulator,
        };
      }
      if (currentValue.type === "Map") {
        return {
          ...accumulator,
          ...state.filters,
        };
      }
      if (currentValue.type === "timestamp") {
        return {
          ...accumulator,

          [currentValue.name]: currentValue.value
            ? $nuxt
                .$moment(currentValue.value, ["DD-MM-YYYY", "YYYY-MM-DD"])
                .format("YYYY-MM-DD HH:mm:ss")
            : "",
        };
      }
      if (currentValue.type === "label") {
        return {
          ...accumulator,
        };
      }
      return {
        ...accumulator,
        [currentValue.name]: currentValue.value,
      };
    }, {}),
};

export const actions = {
  addBeforeSavePromise({ commit }, payload) {
    commit("addBeforeSavePromise", payload);
  },
  deleteBeforeSavePromise({ commit }, payload) {
    commit("deleteBeforeSavePromise", payload);
  },
  async askSuggestions({ commit }, payload) {
    let url = "";
    if (payload.data.fieldId !== undefined) {
      url = `/api/dicwf/${payload.data.fieldId}/${payload.relationValue.value}`;
    }

    const response = await Axios({ url, method: "GET" });
    commit("setData", response.data);
  },

  async fetchForm({ dispatch, commit, getters, state }, params) {
    commit("setCardId", params.idCard);
    commit("setCardRelId", params.idRel);
    commit("setModuleId", params.idModule);
    commit("setMenuId", params.idItem);
    if (!params.cache) {
      commit("setLoading", true);
      commit("setDisabled", true);
    }
    if (state.cardId !== params.idCard || !params.idRel) {
      commit("clearFormData");
    }
    try {
      let url;
      if (params.idWizard && params.idCard === "0") {
        url = encodeURI(
          `/api/card/${params.idModule}/${params.idItem}/${params.idWizard}/${
            params.idCard
          }/${params.idList ?? 0}`
        );
      } else if (params.idRel || params.idCard === "0") {
        url = encodeURI(
          `/api/card/${params.idModule}/${params.idItem}/${params.idCard}/${
            params.idRel
          }${params.zone === "free" ? "?zone=free" : ""}`
        );
      } else if (params.idCard !== "0") {
        const queryParams = { ID: params.idCard, ...params.query };
        const queryString = Object.keys(queryParams)
          .map((key) => `${key}=${queryParams[key]}`)
          .join("&");
        url = encodeURI(
          `/api/card/${params.idModule}/${params.idItem}?${queryString}`
        );
      }

      await this.$axios
        .get(url)
        .then((res) => {
          commit("setLoading", false);
          commit("setDisabled", false);
          commit("setSavedError", false);
          if (!params.cache) {
            commit(
              "setForm",
              res.data.metaData.data.length ? res.data.metaData.data : res.data
            );
          } else {
            const dataForm = res.data.metaData.data.length
              ? res.data.metaData.data
              : res.data;
            const googleCaptcha = dataForm.find(
              (item) => item.type === "GoogleCaptcha"
            );
            commit("setVisibleByName", {
              name: googleCaptcha.name,
              visible: googleCaptcha?.visible,
            });
            commit("setValueByName", {
              name: googleCaptcha.name,
              value: googleCaptcha?.value,
            });
          }
          if (params.idCard === "0") {
            getters.getForm.forEach((item) => {
              if (params.query[item.name]) {
                if (item.name.substring(0, 2) === `FK`) {
                  const text = params.query[item.name];
                  const sValue = params.query[item.name.substring(2)];
                  const value =
                    Number.isNaN(sValue) === false
                      ? parseInt(sValue, 10)
                      : sValue;
                  item.value = { text, value };
                } else {
                  item.value = params.query[item.name];
                }
              }
            });
          }
          if (res.data.metaData.data.length) {
            if (getters.getDataFieldByType("captcha")) {
              dispatch("fetchCaptcha", {
                params: getters.getFormParams,
                data: getters.getDataFieldByType("captcha"),
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
            res.data.metaData.btnCancel === true ||
            res.data.metaData.btnCancel === false
          ) {
            commit("setBtnCancel", res.data.metaData.btnCancel);
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
          commit("setVisible", res.data.metaData.visible);
          commit("setAddFields", res.data.metaData.addFields);
          commit("menu/setBreadCrumbs", res.data.metaData?.breadCrumbs, {
            root: true,
          });
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
  async saveDataCard({ commit, state, dispatch, getters }, params) {
    commit("setLoading", true);
    commit("setDisabled", true);

    const body = formConverter.save(params.form);

    try {
      await Promise.all(state.beforeSavePromises.map((func) => func()));
      const resp = await this.$axios.post(
        `/api/card/${params.moduleId}/${params.itemId}/${params.cardId}/${
          params.relId
        }${params.zone === "free" ? "?zone=free" : ""}`,
        body
      );

      commit("setSavedError", false);
      commit("setCardId", resp.data.ID);
      commit("setCardRelId", resp.data.REL);
      return resp;
    } catch (err) {
      commit("setSavedError", true);
      commit("setErrorMessage", err.response.data || err.message);
      commit("setFieldJsonError", getErrorMessage(err.response?.data));
      if (err.response) {
        return err.response;
      }
      throw err;
    } finally {
      commit("setLoading", false);
      commit("setDisabled", false);
    }
  },

  async saveDataCardUploaders({ commit, state }, params) {
    const copyFieldData = state.form.map((item) => ({ ...item }));

    const getFieldData = converter.save(copyFieldData);

    const dataIsReadyToTransfer = convertUploaderFilesToFormData(getFieldData);

    this.$axios.post(
      `/am/main/v2/datacard2/${params.moduleId}/${params.itemId}/${
        params.cardId
      }${params.relId !== "undefined" ? `?rel=${params.relId}` : ""}`,
      dataIsReadyToTransfer
    );
  },

  async executeAction(
    { dispatch, commit, getters },
    { relId, relActionId, rowId, actionId, body, zone }
  ) {
    const params = zone === "free" ? "?zone=free" : "";
    const data = formConverter.save(body);
    try {
      return await this.$axios
        .post(
          `/api/card/actionexec/${rowId}/${actionId}/${relId}/${relActionId}${params}`,
          data || {}
        )
        .then((resp) => {
          commit("setSavedError", false);
          return resp;
        });
    } catch (e) {
      commit("setLoading", false);
      commit("setDisabled", false);
      commit("setSavedError", true);
      commit("setErrorMessage", e.response?.data);
      commit("setFieldJsonError", getErrorMessage(e.response?.data));
      dispatch("menu/fetchMenuById", null, { root: true });
      return e.response;
    }
  },
  async fetchActionParams(
    { dispatch, commit },
    { moduleId, actionId, cardId, zone }
  ) {
    try {
      const params = zone === "free" ? "?zone=free" : "";
      return await this.$axios
        .get(`/api/action/${moduleId}/${actionId}/${cardId}${params}`)
        .then((resp) => {
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
          commit("setCaptcha", { captcha: res.data, data });
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
        if (fieldRelation.split(";")) {
          const fieldsRelations = getters
            .getDataFieldsByNames(fieldRelation.split(";"))
            .map((item) => ({
              key:
                item.name.substring(0, 2) === `FK`
                  ? item.name.substring(2)
                  : item.name,
              value: item.value?.value,
            }));
          const objectValue = fieldsRelations.reduce((obj, item) => {
            if (item.value) {
              return Object.assign(obj, { [item.key]: item.value });
            }
            return obj;
          }, {});
          url = `/api/dic/55/${id}/${dic}/${state.cardId}?${new URLSearchParams(
            objectValue
          ).toString()}`;
        } else {
          relationValue = getters.getDataFieldByName(fieldRelation);
          url = `/api/dicwf/${fieldId}/${relationValue.value.value}`;
        }
      } else {
        url = `/api/dic/55/${id}/${dic}/${state.cardId}`;
      }
      const data = await this.$axios.get(encodeURI(url));
      commit("setEnumOptions", { options: data.data, fieldId });
    } catch (error) {
      if (error.response) {
        commit("setError", true);
        commit("setErrorMessage", error.response.data);
        return error.response;
      }
    }
  },
  validateActionParams({ commit, getters }) {
    const actionParams = getters.getActionParams;
    if (actionParams && actionParams.length) {
      actionParams.forEach((item) => {
        commit("setFormField", item);
      });
    }
    if (getters.getForm.find((item) => item.state === false)) {
      commit("setSavedError", true);
      commit("setErrorMessage", {
        MESSAGE: "Проверьте правильность заполнения формы!",
      });
      return false;
    }
    return true;
  },
};

export const mutations = {
  toggleFilterVisible(state, payload) {
    state.isFilterVisible = payload;
  },

  addBeforeSavePromise(state, func) {
    state.beforeSavePromises.push(func);
  },
  deleteBeforeSavePromise(state, func) {
    state.beforeSavePromises = state.beforeSavePromises.filter(
      (item) => item !== func
    );
  },
  setData(state, suggestions) {
    state.options = suggestions;
  },

  cardChanged(state, data) {
    state.cardChanged = data;
  },
  saveButtonClicked(state, data) {
    state.saveButtonClickedAmount += 1;
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
    const item = state.form.find((d) => d.name === data.name);

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
              // eslint-disable-next-line prefer-destructuring
              item.value = item.options[0];
            }
          } else {
            item.state = !!(item.value.value || item.value.value == 0);
          }
        }
      }
    }
  },
  setFormOneToManyField(state, data) {
    const item = state.form.find((d) => d.fieldId === data.fieldId);
    const { schema, value } = item;
    if (data.action === "add") {
      value.push(schema.map((a) => ({ ...a })));
    }
    if (data.action === "delete") {
      value.splice(data.value.index, 1);
    }
    if (data.action === "update") {
      const dataValue = data.value;
      const valueChanged = dataValue.value;
      const update = value
        .find((_, index) => index === dataValue.index)
        .find((i) => i.fieldId === valueChanged.fieldId);
      if (update !== undefined) {
        update.value = valueChanged.value;
        if (update.required) {
          update.state = false;
          if (
            update.value !== null &&
            update.value !== "" &&
            update.value !== undefined &&
            (update.error === null || update.error === undefined)
          ) {
            update.state = true;
            update.checked = true;
          }
          if (update.value && update.type === "enum") {
            if (update.value.value === undefined && update.options) {
              update.state = null;
              update.checked = false;
              if (update.options.length === 1) {
                // eslint-disable-next-line prefer-destructuring
                update.value = update.options[0];
              }
            } else {
              update.state = !!(update.value.value || update.value.value == 0);
            }
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
  clearFormField(state, data) {
    const item = state.form.find((d) => d.fieldId === data.fieldId);
    item.value = null;
  },
  clearFilters(state) {
    state.filters = {};
  },
  clearFormRelationField(state, { name }) {
    let currentFieldName =
      name.substring(0, 2) === `FK` ? name.substring(2) : name;
    while (true) {
      const item = state.form.find((d) => {
        if (d.fieldRelation) {
          if (d.fieldRelation.split(";")) {
            return d.fieldRelation.split(";").includes(currentFieldName);
          }
        }
        return d.fieldRelation === currentFieldName;
      });
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
      const [fieldName, fieldValue] = data.split("=");
      const field = state.form.find((item) => item.name === fieldName);
      if (field) {
        field.error = fieldValue || data;
      }
    } catch (error) {
      console.error(error);
    }
  },
  setFieldJsonError(state, data) {
    try {
      if (typeof data === "object") {
        const field = state.form.find((item) => item.name === data.path);
        field.error = data.description;
        field.state = false;
      }
    } catch (error) {
      console.error(error);
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
  setBtnCancel(state, data) {
    state.isCancel = data;
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
  setVisible(state, params) {
    state.visible = params;
  },
  setVisibleByName(state, data) {
    const field = state.form.find((item) => item.name === data.name);
    if (field) {
      field.visible = data.visible;
    }
  },
  setValueByName(state, data) {
    const field = state.form.find((item) => item.name === data.name);
    if (field) {
      field.value = data.value;
    }
  },
  setAddFields(state, params) {
    state.addFields = params;
  },
  setDisabled(state, params) {
    if (Array.isArray(state.form)) {
      state.form = state.form.map((item) => {
        const copyField = state.copyForm.find(
          (field) => field.fieldId === item.fieldId
        );
        if (copyField?.readonly) {
          item.readonly = true;
        } else {
          item.readonly = params;
        }
        return item;
      });
    }
  },
  setDisabledByName(state, data) {
    const field = state.form.find((item) => item.name === data.name);
    if (field) {
      field.readonly = data.disable;
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
  setUpdateEvent(state, params) {
    state.updateEvent = params;
  },
  setEnumOptions(state, params) {
    const item = state.form.find((d) => d.fieldId === params.fieldId);
    item.options = params.options;
    if (!item.value?.value) {
      if (item.options.length === 1) {
        item.value = params.options[0];
      }
    }
  },
  setFilters(state, data) {
    state.filters = { ...state.filters, ...data };
  },
};
