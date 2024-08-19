/* eslint-disable no-param-reassign */
import Axios from "axios";
import api from "../api/urls.mjs";
import { getErrorMessage } from "../utils/transform";
import converter from "../converters/dataform.mjs";
import consts from "../api/urls.mjs";
import {
  convertUploaderFilesToFormData,
  mergeFormData,
} from "./data_card.helpers";

let controller;

export const state = () => ({
  options: [],
  form: [],
  formCacheKey: null,
  copyForm: [],
  bodyForm: null,
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
  fetchingActions: [],
  actionApplyErrorMessage: null,
  isActionApplyError: false,
  actionParamsTitle: null,
  isSaveSuccess: false,
  isActionFormDisabled: false,
  isClearOptions: false,
  dictionaries: [],
});
export const getters = {
  getIsActionFormDisabled: (state) => state.isActionFormDisabled,
  getSaveSuccess: (state) => state.isSaveSuccess,
  getActionParamsTitle: (state) => state.actionParamsTitle,
  getisActionApplyError: (state) => state.isActionApplyError,
  getactionApplyErrorMessage: (state) => state.actionApplyErrorMessage,
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
  isFetchingAction: (state) => (actionId) =>
    state.fetchingActions.includes(actionId),
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
  getBodyForm: (state) => state.bodyForm,
  getCardId: (state) => state.cardId,
  getSource: (state) => state.source,
  getCardRelId: (state) => state.cardRelId,
  getCaptions: (state) => state.captions,
  getBtnSave: (state) => state.isSave,
  getBtnCancel: (state) => state.isCancel,
  getReadOnly: (state) => state.isReadOnly,
  getActionParams: (state) =>
    Array.isArray(state.actionParams)
      ? state.actionParams.map((a) => {
          const obj = { ...a };
          if (obj.fromDataCard === true) {
            const dataCardField = state.form.find((b) => b.name === obj.name);
            if (dataCardField) {
              obj.value =
                typeof dataCardField.value === "object"
                  ? JSON.stringify(dataCardField.value)
                  : dataCardField.value;
            }
          }
          return { ...obj };
        })
      : [],
  getOneToManyDataTable: (state) => state.oneToManyData.table,
  getOneToManyDataForm: (state) => state.oneToManyData.form,
  getDataFieldByName: (state) => (name) =>
    state.form.find((b) => b.name === name),
  getDataFieldsByNames: (state) => (names) =>
    names.map((name) => {
      const field = state.form.find(
        (form) => form.name === name || form.name === `FK${name}`
      );
      if (!field) throw new Error(`Связанное поле не найдено "${name}"`);
      return field;
    }),
  getDataVisibleFieldsByNames: (state) => (names) =>
    state.form.filter(
      (field) => names.includes(field.name) && field.visible === true
    ),
  getDataFieldsRelationsByFieldId: (state, getters) => (fieldId) => {
    const field = state.form.find((d) => d.fieldId === fieldId);
    const fieldRelations = state.form.filter((f) =>
      f.fieldRelation ? f.fieldRelation.includes(field.name) : false
    );
    return fieldRelations.filter((f) =>
      getters
        .getDataFieldsByNames(f.fieldRelation.split(";"))
        .every(
          ({ value }) => value !== undefined && value !== null && value !== ""
        )
    );
  },
  getURLsByFieldsRelations:
    (state, getters) =>
    ({ fields }) => {
      const urls = [];
      fields.forEach((field) => {
        if (field.fieldRelation) {
          const objectValue = getters
            .getDataVisibleFieldsByNames(field.fieldRelation.split(";"))
            .map((item) => ({
              key:
                item.name.substring(0, 2) === `FK`
                  ? item.name.substring(2)
                  : item.name,
              value: item.value?.value || item.value,
            }))
            .reduce((obj, item) => {
              if (item.value) {
                return Object.assign(obj, { [item.key]: item.value });
              }
              return obj;
            }, {});
          const url = {
            url: `/api/dic/55/${field.id}/${field.name}/${
              state.cardId
            }?${new URLSearchParams(objectValue).toString()}`,
            fieldId: field.fieldId,
          };
          urls.push(url);
        }
      });
      return urls;
    },
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
  isDisabled: (state, getters) => {
    if (getters.getLoading) {
      return true;
    }

    const uploadComponent = getters.getForm.find(
      (item) => item.type === "uploadFiles"
    );

    if (uploadComponent === false) {
      return false;
    }

    if (uploadComponent) {
      if (uploadComponent.visible === false) {
        //  console.log("uploadComponent.visible:", uploadComponent.visible);
        return false;
      }
    }

    const settings = uploadComponent?.fileSettings;

    // console.log("settings:", settings);
    if (settings === undefined || Array.isArray(settings) === false) {
      return false;
    }

    const objectWithDocsDescription = uploadComponent.fileSettings.find((el) =>
      el?.value.find((item) => Object.hasOwn(item, "NAME"))
    );

    // console.log("objectWithDocsDescription:", objectWithDocsDescription);

    const onlyRequiredDocs = objectWithDocsDescription.value.filter(
      (el) => el?.MIN_FILE_COUNT > 0
    );

    // console.log("onlyRequiredDocs:", onlyRequiredDocs);
    if (!onlyRequiredDocs) {
      return false;
    }
    if (Array.isArray(uploadComponent.value) === true) {
      if (uploadComponent.value.length < onlyRequiredDocs.length) {
        return true;
      }
    }
    if (Array.isArray(uploadComponent.value) === false) {
      const downlodedDocs = JSON.parse(uploadComponent.value.getAll("JSON")[0])[
        `${uploadComponent.name}`
      ];

      const isRequiredDocsLoaded = onlyRequiredDocs.every((el) =>
        downlodedDocs.find((item) => el.NAME === item.NAME)
      );

      if (isRequiredDocsLoaded === false) {
        return true;
      }
      if (isRequiredDocsLoaded === true) {
        // console.log("downlodedDocs:", downlodedDocs);
        //  console.log("isRequiredDocsLoaded:", isRequiredDocsLoaded);
        return false;
      }
    }
    return false;
  },
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

    commit("clearFormData", params);

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
            commit("setCacheKey", state.menuId);
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

    const body = getters.getBodyForm;

    try {
      const httpMethod = params.cardId === "0" ? "post" : "put";
      await Promise.all(state.beforeSavePromises.map((func) => func()));
      const resp = await this.$axios[httpMethod](
        `${params.zone === "free" ? consts.FREEDATACARD : consts.DATACARD}/${
          params.moduleId
        }/${params.itemId}/${params.cardId}${
          params?.relId ? `?REL=${params.relId}` : ""
        }`,
        body
      );
      commit("setSavedError", false);
      commit("setCardId", resp.data[0].ID);
      commit("setCardRelId", resp.data[0].REL);
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
    commit("setLoading", true);
    commit("setDisabled", true);
    const copyFieldData = state.form.map((item) => ({ ...item }));

    const getFieldData = converter.save(copyFieldData);

    const dataIsReadyToTransfer = convertUploaderFilesToFormData(getFieldData);

    const httpMethod = params.idCard === "0" ? "post" : "put";
    try {
      const resp = await this.$axios[httpMethod](
        `/am/main/v2/datacard2/${params.moduleId}/${params.itemId}/${
          params.cardId
        }${params.relId !== "undefined" ? `?rel=${params.relId}` : ""}`,
        dataIsReadyToTransfer
      );
      commit("setSavedError", false);
      commit("setCardId", resp.data[0].ID);
      commit("setCardRelId", resp.data[0].REL);
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

  async executeAction(
    { dispatch, commit, getters },
    { relId, relActionId, rowId, actionId, body, zone }
  ) {
    const params = zone === "free" ? "?zone=free" : "";
    const data = converter.save(body);
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
    } catch (err) {
      commit("setLoading", false);
      commit("setDisabled", false);
      commit("setSavedError", true);
      commit("setErrorMessage", err.response?.data);
      commit("setFieldJsonError", getErrorMessage(err.response?.data));
      dispatch("menu/fetchMenuById", null, { root: true });
      return err.response;
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
  async setSearchSelectField({ commit, getters, state, dispatch }, data) {
    const field = state.form.find((d) => d.fieldId === data.fieldId);
    if (field.options.length) {
      commit("setValueSearchSelect", data);
    }
    const urls = getters.getURLsByFieldsRelations({ fields: [field] });
    const requests = [...urls]
      .filter(
        (url) =>
          !state.dictionaries.find((dictionary) => dictionary.url === url.url)
      )
      .map((r) => r.url);
    if (controller) {
      controller.abort();
    }
    controller = new AbortController();
    if (requests.length) {
      commit("setFieldLoading", data);
      await Promise.all(
        requests.map((endpoint) =>
          this.$axios.get(endpoint, {
            signal: controller.signal,
          })
        )
      )
        .then((result) => {
          result.forEach((item) =>
            commit("setDictionary", {
              url: item.config.url,
              options: item.data,
            })
          );
        })
        .catch((e) => console.error(e))
        .finally(() => commit("setFieldLoading", data));
    }
    const options = [...urls].filter((url) =>
      state.dictionaries.find((dictionary) => dictionary.url === url.url)
    );
    commit("setDictionaryOptions", options);
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
  setIsActionFormDisabled(state, data) {
    state.isActionFormDisabled = data;
  },
  setSaveSuccess(state, data) {
    state.isSaveSuccess = data;
  },
  setActionParamsTitle(state, data) {
    state.actionParamsTitle = data;
  },
  setCacheKey(state, key) {
    state.formCacheKey = key;
  },
  setIsActionApplyError(state, data) {
    state.isActionApplyError = data;
  },
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
    state.bodyForm = converter.save(data);
  },
  setBodyForm(state, data) {
    state.bodyForm = data;
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
  setactionApplyErrorMessage(state, data) {
    state.actionApplyErrorMessage = data;
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
      if (item.type === "GoogleCaptcha") {
        state.bodyForm[item.name] = converter.save([item])[item.name];
      } else {
        state.bodyForm = { ...state.bodyForm, ...converter.save([item]) };
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
    state.bodyForm = { ...state.bodyForm, ...converter.save(state.form) };
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
    if (
      state.formCacheKey !== state.menuId &&
      state.menuId !== false &&
      state.formCacheKey !== null
    ) {
      state.captions = null;
      state.form = [];
      state.formCacheKey = null;
    }
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
        item.options = null;
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
  setFieldLoading(state, data) {
    const field = state.form.find((item) => item.name === data.name);
    if (field) {
      field.isLoading = !field.isLoading;
    }
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
      state.bodyForm[data.name] = data.value;
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
  setValueSearchSelect(state, data) {
    const field = state.form.find((d) => d.fieldId === data.fieldId);
    const value = field.options.find((item) => item.ID === data.value)?.ID;
    const fieldRelations = state.form.filter((f) =>
      f.fieldRelation ? f.fieldRelation.includes(field.name) : false
    );
    fieldRelations.forEach((fieldRelation) => {
      fieldRelation.value = null;
      fieldRelation.state = null;
      fieldRelation.options = [];
      fieldRelation.visible = false;
    });
    if (value) {
      field.value = value;
      field.state = true;
    } else {
      field.value = null;
      field.state = false;
    }
  },
  setEnumOptions(state, params) {
    const item = state.form.find((d) => d.fieldId === params.fieldId);
    if (state.isClearOptions) {
      item.options = [];
      return;
    }
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
  setFetchingAction(state, { actionId, isFetching }) {
    if (isFetching) {
      state.fetchingActions.push(actionId);
    }
    if (!isFetching) {
      state.fetchingActions = state.fetchingActions.filter(
        (id) => id !== actionId
      );
    }
  },
  setDictionary(state, data) {
    state.dictionaries.push(data);
  },
  setDictionaryOptions(state, data) {
    data.forEach((item) => {
      const dictionary = state.dictionaries.find((dic) => dic.url === item.url);
      const field = state.form.find((f) => f.fieldId === item.fieldId);
      field.options = dictionary.options;
      field.visible = true;
    });
  },
};
