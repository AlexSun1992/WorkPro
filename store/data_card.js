/* eslint-disable no-param-reassign */
import Axios from "axios";
import api from "../api/urls";
import { getErrorMessage } from "../utils/transform";
import converter from "../converters/dataform";
import {
  convertUploaderFilesToFormData,
  getVisibleStatus,
  validateWithMask,
  fetchOptions,
  getFetchValue,
  getOneToManyItem,
  setErrorMask,
  setLoading,
  getDataFieldsByNamesFromArray,
  getFormItemByName,
} from "./data_card.helpers";

let controller;
const fetchOptionsByJSONController = {};
const fetchOptionsByJSONTimeout = {};
const FIELD_TYPES_RELATION_EXCEPTION = ["CustomComboboxJSON"];

export const state = () => ({
  toggleTooltip: [],
  isShowLoader: false,
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
  // === multi-form support ===
  forms: {}, // { [formId]: { errorMessage?, ... } }
  currentFormId: null, // optional: can be set by modal to scope ops

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
  isRouterChanged: false,
  moduleId: false,
  menuId: false,
  source: "",
  updateEvent: null,
  filters: {},
  oneToManyFilters: [],
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
  // В начале массива храниться актуальное значение, далее более старые
  formValuesHistory: {},
  filterActive: {},
  formCollapse: [],
  historyToggleComponents: [],
  activePointInMap: null,
  isShowMap: false,
  isSync: false,
  actionId: null,
  isAuthModalVisible: false,
});

const neededFieldsIds = [66047, 68480, 71624, 71598];

export const getters = {
  getAuthModalVisible: (state) => state.isAuthModalVisible,
  isShowMap: (state) => state.isShowMap,
  getActivePointInMap: (state) => state.activePointInMap,
  getOneToManyFilters: (state) => state.oneToManyFilters,
  getIsShowLoader(state) {
    return state.isShowLoader;
  },
  getFormValueHistoryByField: (state) => (fieldName) =>
    Object.entries(state.formValuesHistory).find((item) => item[0] === fieldName)?.[1],
  getFormCollapseElements: (state) => state.formCollapse,
  getHidedComponents: (state) => (components) => state.form.filter((el) => components.includes(el.name) && !el.visible),
  getVisibleComponents: (state) => (components) =>
    state.form.filter((el) => components.includes(el.name) && el.visible),
  getIsActionFormDisabled: (state) => state.isActionFormDisabled,
  getSaveSuccess: (state) => state.isSaveSuccess,
  getActionParamsTitle: (state) => state.actionParamsTitle,
  getisActionApplyError: (state) => state.isActionApplyError,
  getactionApplyErrorMessage: (state) => state.actionApplyErrorMessage,
  getFiltersVisibleStatus: (state) => state.isFilterVisible,
  getSuggestions: (state) => state.options,
  getUpdateEvent: (state) => state.updateEvent,
  getForm: (state) => state.form,
  getFormWithoutOneToManyFields: (state, getters) =>
    getters.getForm.filter((item) => item.type?.toLowerCase() !== "onetomany"),
  getFormParams: (state) => ({
    idModule: state.moduleId,
    idItem: state.menuId,
    idCard: state.cardId,
    idRel: state.cardRelId,
  }),
  getModuleId(sate) {
    return state().moduleId;
  },
  isFetchingAction: (state) => (actionId) => state.fetchingActions.includes(actionId),
  cardChanged: (state) => state.cardChanged,
  saveButtonClicked: (state) => state.saveButtonClicked,
  saveButtonClickedAmount: (state) => state.saveButtonClickedAmount,
  getError: (state) => state.isError,
  getSavedError: (state) => state.isSavedError,
  getErrorMessage: (state) => {
    const commonMessage = "В личном кабинете что-то пошло не так. Попробуйте повторить попытку позже.";
    if (state.errorMessage === null) return null;

    if (typeof getErrorMessage(state.errorMessage) === "object") {
      return getErrorMessage(state.errorMessage)?.description ?? commonMessage;
    }

    return getErrorMessage(state.errorMessage) ?? commonMessage;
  },
  // Per-form errorMessage (without breaking existing API)
  getErrorMessageByForm: (state) => (formId) => {
    const commonMessage = "В личном кабинете что-то пошло не так. Попробуйте повторить попытку позже.";
    if (!formId) {
      // fallback to legacy global error
      if (state.errorMessage === null) return null;
      if (typeof getErrorMessage(state.errorMessage) === "object") {
        return getErrorMessage(state.errorMessage)?.description ?? commonMessage;
      }
      return getErrorMessage(state.errorMessage) ?? commonMessage;
    }
    const msg = state.forms?.[formId]?.errorMessage;
    if (msg === null) return null;
    if (msg === undefined) return null;
    if (typeof getErrorMessage(msg) === "object") {
      return getErrorMessage(msg)?.description ?? commonMessage;
    }
    return getErrorMessage(msg) ?? commonMessage;
  },

  isShowWizardButton: (state, getters, rootState, rootGetters) => (isUploader) => {
    const allControlsData = getters.getForm;
    const isControlsDataLoaded = allControlsData.length > 0 && allControlsData.some((el) => !el.visible);
    const notUploader = isUploader === false;
    const isScriptsLoaded = rootGetters["blocks/getScriptStatus"];

    return Boolean(notUploader && isScriptsLoaded && isControlsDataLoaded);
  },
  getToggleTooltip: (state) => state.toggleTooltip,
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
            const dataCardField = state.form?.find((b) => b.name === obj.name);
            if (dataCardField) {
              obj.value =
                typeof dataCardField.value === "object" ? JSON.stringify(dataCardField.value) : dataCardField.value;
            }
          }
          return { ...obj };
        })
      : [],
  getDataFieldByName: (state) => (name) => state.form?.find((b) => b.name === name.trim()),
  getDataFieldsByNames: (state, getters) => (names, oneToManyFieldId, oneToManyIndex) =>
    names.map((name) => {
      const form =
        typeof oneToManyIndex === "number" && oneToManyFieldId
          ? [...getters.getOneToManyBlock(oneToManyFieldId, oneToManyIndex), ...getters.getFormWithoutOneToManyFields]
          : state.form;
      const field = form?.find((form) => form.name === name.trim() || form.name === `FK${name.trim()}`);

      if (!field) {
        throw new Error(`Связанное поле не найдено "${name}"`);
      }

      return field;
    }),
  getDataVisibleFieldsByNames: (state) => (names, formData) => {
    const form = formData ?? state.form;

    return form.filter(
      (field) => names.includes(field.name) && (field.visible === true || neededFieldsIds.includes(field.fieldId))
    );
  },
  getDataFieldsRelationsByFieldId:
    (state) =>
    /**
     * @param {string | number} fieldId
     * @param {Array | Null} form - Массив полей формы
     * @return {*[]}
     */
    (fieldId, form) => {
      const formData = form ?? state.form;
      const field = formData?.find((d) => d.fieldId === fieldId);
      const fieldRelations = formData.filter(
        (f) =>
          (f.fieldRelation ? f.fieldRelation.includes(field.name) : false) &&
          (f.visible === true || neededFieldsIds.includes(f.fieldId))
      );

      return fieldRelations.filter((f) =>
        getDataFieldsByNamesFromArray(f.fieldRelation.split(";"), formData).every(
          ({ value }) => value !== undefined && value !== null && value !== ""
        )
      );
    },
  getIdlist: (state) => {
    const url = window.location.href;
    return { idlist: url.split("/idlist/")[1] };
  },
  getURLsByFieldsRelations:
    (state, getters) =>
    ({ fields, form }) => {
      const urls = [];

      fields.forEach((field) => {
        if (field.fieldRelation) {
          const objectValue = getters
            .getDataVisibleFieldsByNames(field.fieldRelation.split(";"), form)
            .map((item) => ({
              key: item.name.substring(0, 2) === `FK` ? item.name.substring(2) : item.name,
              value: item.value?.value ?? item.value,
            }))
            .reduce(
              (obj, item) => {
                if (typeof item.value === "boolean" || item.value) {
                  return Object.assign(obj, { [item.key]: item.value });
                }
                return obj;
              },
              { ID: state.cardId ?? 0 }
            );
          let url;
          if (field.type === "searchSelect") {
            url = {
              url: `/api/dic/55/${field.id}/${field.name}/${state.cardId}?${new URLSearchParams(
                objectValue
              ).toString()}`,
              fieldId: field.fieldId,
            };
          }
          if (field.isRelation && !FIELD_TYPES_RELATION_EXCEPTION.includes(field.type)) {
            url = {
              url: `/api/dicwf/${field.fieldId}/${state.cardId ?? 0}?${new URLSearchParams(
                converter.queryParams(objectValue)
              ).toString()}`,
              fieldId: field.fieldId,
            };
          }
          if (url) {
            urls.push(url);
          }
        }
      });
      return urls;
    },
  getDataByFieldRelation: (state) => (name) => state.form?.find((b) => b.fieldRelation === name),
  getDataFieldByType: (state) => (name) => state.form?.find((b) => b.type === name),
  getDataFieldByFieldId: (state) => (id, oneToManyFieldId, oneToManyIndex) => {
    const form = oneToManyFieldId ? getOneToManyItem(state.form, oneToManyFieldId, oneToManyIndex) : state.form;

    return form?.find((b) => b.fieldId == id);
  },
  getOneToManyBlock: (state) => (fieldId, index) => getOneToManyItem(state.form, fieldId, index),
  getOneToManyDataFieldByFieldId: (state, getters) => (fieldId, oneToManyFieldId, index) =>
    getters.getOneToManyBlock(oneToManyFieldId, index)?.find((b) => b.fieldId === fieldId),

  getFiltersOrRelatedDataByParams:
    (state, getters) =>
    /**
     * @description Возвращает либо все фильтры либо только RelatedFields значения
     * @param {object} params
     * @param {object} params.field
     * @param {object} params.oneToManyData
     * @return {object}
     */
    (params = {}) => {
      const { field } = params;
      const { oneToManyData } = params;
      let relatedFields;

      if (!oneToManyData?.fieldId) {
        relatedFields = field?.fieldRelation?.split && getters.getDataFieldsByNames(field.fieldRelation?.split(";"));

        return relatedFields?.reduce((acc, item) => getFetchValue(acc, item), {}) ?? getters.getFilters;
      }

      const filters = getters.getDataFilters(oneToManyData.index);
      relatedFields =
        field?.fieldRelation?.split &&
        getters.getDataFieldsByNames(field.fieldRelation?.split(";"), oneToManyData.fieldId, oneToManyData.index);

      return relatedFields?.reduce((acc, item) => getFetchValue(acc, item), {}) ?? filters;
    },
  getFormData:
    (state, getters) =>
    /**
     * @description Возвращает либо данные всей формы либо (если указать index и fieldId) блок OneToMany + Родительские поля формы без OneToMany полей
     * @param fieldId {number | string} - Id oneToMany поля
     * @param index {number} - index OneToMany блока
     * @return {any}
     */
    (fieldId, index = -1) => {
      if (fieldId) {
        return { ...getters.getFormWithoutOneToManyFields, ...getters.getOneToManyBlock(fieldId, index) };
      }

      return getters.getForm;
    },
  getLoading: (state) => state.loading,
  getRouterChanged: (state) => state.isRouterChanged,
  getFilters: (state) => state.filters,
  getDataFilters:
    (state, getters) =>
    /**
     * @description Возвращает либо корневой объект filters либо (если передать индекс) корневой фильтр вместе с фильтром блока OneToMany
     * @param index {number} - индекс блока OneToMany
     * @return {*}
     */
    (index = -1) => {
      const filters = getters.getFilters;

      if (index >= 0) {
        return { ...(getters.getOneToManyFilters[index] ?? {}), ...filters };
      }

      return filters;
    },
  getSelectedValues: (state) => {
    const findMapComponent = state.form.find(
      (component) => (component.type === "Map" || component.type === "YMap") && component.fieldRelation
    );

    const getMapFieldRelation = findMapComponent?.fieldRelation?.split(";");

    if (!getMapFieldRelation) {
      return {};
    }

    return state.form.reduce((acc, val) => {
      if (getMapFieldRelation.find((name) => name === val.name)) {
        return { ...acc, [val.name]: val.value };
      }
      return { ...acc };
    }, {});
  },
  getVisible: (state) => state.visible,
  getAddFields: (state) => state.addFields,
  getFiltersAllFields: (state) =>
    state.form.reduce((accumulator, currentValue) => {
      if (currentValue.type === "enum" && currentValue.name.substring(0, 2) === `FK`) {
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
            ? $nuxt.$moment(currentValue.value, ["DD-MM-YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD HH:mm:ss")
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

    const uploadComponent = getters.getForm.find((item) => item.type === "uploadFiles");

    if (uploadComponent === false) {
      return false;
    }

    if (uploadComponent) {
      if (uploadComponent.visible === false) {
        return false;
      }
    }

    const settings = uploadComponent?.fileSettings;

    if (settings === undefined || Array.isArray(settings) === false) {
      return false;
    }

    const objectWithDocsDescription = uploadComponent.fileSettings.find((el) =>
      el?.value.find((item) => Object.hasOwn(item, "NAME"))
    );

    const onlyRequiredDocs = objectWithDocsDescription.value.filter((el) => el?.MIN_FILE_COUNT > 0);

    if (!onlyRequiredDocs) {
      return false;
    }
    if (Array.isArray(uploadComponent.value) === true) {
      if (uploadComponent.value.length < onlyRequiredDocs.length) {
        return true;
      }
    }
    if (Array.isArray(uploadComponent.value) === false) {
      const downloadedDocs = JSON.parse(uploadComponent.value.getAll("JSON")[0])[`${uploadComponent.name}`];

      const isRequiredDocsLoaded = onlyRequiredDocs.every((el) => downloadedDocs.find((item) => el.NAME === item.NAME));

      if (isRequiredDocsLoaded === false) {
        return true;
      }
      if (isRequiredDocsLoaded === true) {
        return false;
      }
    }
    return false;
  },
  getLoaderVisible(state) {
    const fields = state.form;

    const loadedFields = fields.find((item) => item.isLoading && item.type !== "searchSelect");

    return Boolean(loadedFields);
  },
};

export const actions = {
  async fetchOptionsByJSON({ commit, getters }, params) {
    return new Promise((resolve, reject) => {
      const zone = params?.zone === "free" ? "free" : "main";
      const { field } = params;
      const { fieldId } = field;
      const filters = getters.getFiltersOrRelatedDataByParams(params);
      const getUrl = () => `/lk/${zone}/v2/dicwf/${fieldId}?json=${JSON.stringify(filters)}`;

      if (!field) {
        console.warn(
          `fetchOptionsByJSON. Поле с id ${fieldId} не наедено. Список для выпадающего меню не будет сформирован`
        );

        return;
      }

      fetchOptionsByJSONController[fieldId]?.abort();
      fetchOptionsByJSONController[fieldId] = new AbortController();
      clearTimeout(fetchOptionsByJSONTimeout[fieldId]);
      fetchOptions({
        url: getUrl(),
        commit,
        resolve,
        reject,
        fieldId,
        oneToManyData: params.oneToManyData,
        fetchOptionsByJSONController,
        fetchOptionsByJSONTimeout,
        axios: this.$axios,
      });
    });
  },
  /**
   *
   * @param params {object}
   * @param params.filters {object}
   * @param params.index {number}
   * @return {*}
   */
  updateFiltersData({ commit }, params) {
    if (typeof params.index === "number") {
      return commit("updateOneToMayFilters", params);
    }

    commit("setFilters", params.filters);
  },
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
      setLoading(commit, true);
      commit("setDisabled", true);
    }

    commit("clearFormData", params);

    try {
      let url;
      if ((params.idWizard || params.idList) && params.idCard === "0" && params.zone !== "free") {
        url = encodeURI(
          `/api/card/${params.idModule}/${params.idItem}/${params.idWizard}/${params.idCard}/${params.idList ?? 0}`
        );
      } else if (params.idRel || params.idCard === "0") {
        url = encodeURI(
          `/api/card/${params.idModule}/${params.idItem}/${params.idCard}/${params.idRel}${
            params.zone === "free" ? "?zone=free" : ""
          }`
        );
      } else if (params.idCard !== "0") {
        const queryParams = { ID: params.idCard, ...params.query };
        const queryString = Object.keys(queryParams)
          .map((key) => `${key}=${queryParams[key]}`)
          .join("&");
        url = encodeURI(`/api/card/${params.idModule}/${params.idItem}?${queryString}`);
        if (params.zone === "free") {
          url = encodeURI(`/api/card/${params.idModule}/${params.idItem}/0/0?zone=free`);
        }
      }
      await this.$axios
        .get(url)
        .then((res) => {
          setLoading(commit, false);
          commit("setDisabled", false);
          commit("setSavedError", false);
          if (!params.cache) {
            commit("setForm", res.data.metaData.data.length ? res.data.metaData.data : res.data);
            commit("setCacheKey", state.menuId);
            commit("setSync", res.data.metaData.sync);
            commit("setActionId", res.data.metaData.actionId);
          } else {
            const dataForm = res.data.metaData.data.length ? res.data.metaData.data : res.data;
            const googleCaptcha = dataForm.find((item) => item.type === "GoogleCaptcha");
            commit("setVisibleByName", {
              name: googleCaptcha.name,
              visible: googleCaptcha?.visible,
            });
            commit("setValueByName", {
              name: googleCaptcha.name,
              value: googleCaptcha?.value,
            });
          }
          // Подстановка значений в поля из URL
          if (Number(params.idCard) === 0) {
            const copyForm = JSON.parse(JSON.stringify(getters.getForm));
            copyForm.forEach((item) => {
              if (params.query[item.name]) {
                if (item.name.substring(0, 2) === `FK`) {
                  const text = params.query[item.name];
                  const sValue = params.query[item.name.substring(2)];
                  const value = Number.isNaN(sValue) === false ? parseInt(sValue, 10) : sValue;
                  item.value = { text, value };
                } else {
                  item.value = params.query[item.name];
                }
              }
            });
            commit("setForm", copyForm);
          }
          if (res.data.metaData.data.length) {
            if (getters.getDataFieldByType("captcha")) {
              dispatch("fetchCaptcha", {
                params: getters.getFormParams,
                data: getters.getDataFieldByType("captcha"),
              });
            }
          }
          commit("setCopyForm", JSON.parse(JSON.stringify(res.data.metaData.data)));
          if (res.data.metaData.captions) {
            commit("setCaptions", res.data.metaData.captions);
          }

          if (res.data.metaData.btnCancel === true || res.data.metaData.btnCancel === false) {
            commit("setBtnCancel", res.data.metaData.btnCancel);
          }

          if (res.data.metaData.btnSave === true || res.data.metaData.btnSave === false) {
            commit("setBtnSave", res.data.metaData.btnSave);
          }
          if (res.data.metaData.readonly === true || res.data.metaData.readonly === false) {
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
        setLoading(commit, false);
        commit("setError", true);
        commit("setErrorMessage", error.response.data);
      }
    }
  },

  async fetchOneToManyDataTable({ commit }, params) {
    try {
      await this.$axios
        .get(encodeURI(`/api/onetomanylist/${params.routeParams.idCard}/${params.id}/${params.routeParams.idRel}`))
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
  async fetchOneToManyDataForm({ commit }, params) {
    try {
      await this.$axios
        .get(encodeURI(`/api/card/${params.idModule}/${params.idItem}/${params.idCard}/${params.idRel}`))
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
  async validate({ state, commit }) {
    const data = Array.isArray(state.form) ? state.form : []; // массив полей как в CardEditor

    let valid = true;
    const errors = {};

    for (let i = 0; i < data.length; i++) {
      const f = data[i];
      const value = f.type === "enum" ? f.value && f.value.value : f.value;
      const isStringWithMask = f.mask && f.type === "string";

      if (
        f.required &&
        !isStringWithMask &&
        !f.hidden &&
        f.visible &&
        (value === null || value === undefined || value === "" || value === false || f.error) &&
        value !== 0
      ) {
        valid = false;
        errors[f.fieldId || f.name || i] = "Поле обязательно";
        commit("setFormField", f);
      }

      if (isStringWithMask && f.visible) {
        if (f.required && !value) {
          valid = false;
          errors[f.fieldId || f.name || i] = "Поле обязательно";
        }
        // если у вас есть реальный validateWithMask — используйте его тут
        if (f.mask && value && !(/* validateWithMask */ ((v) => Boolean(v))(value, f.mask))) {
          valid = false;
          errors[f.fieldId || f.name || i] = "Неверный формат";
        }
        commit("setFormField", f);
      }

      if (f.type === "OneToMany" && f.visible === true) {
        const valueOneToMany = f.value;
        if (Array.isArray(valueOneToMany)) {
          valueOneToMany.forEach((webFields, indexWebFields) => {
            const isValidValue = (v) => !((v === null || v === undefined || v === "") && v !== 0);
            const webFieldsErrors = webFields.filter(
              (item) => item.visible === true && item.required === true && !isValidValue(item.value)
            );
            if (webFieldsErrors && webFieldsErrors.length) {
              valid = false;
              webFieldsErrors.forEach((errorField) => {
                const key = `${f.fieldId || f.name || i}:${indexWebFields}:${errorField.fieldId || errorField.name}`;
                errors[key] = "Поле обязательно";
                commit("setFormOneToManyField", {
                  fieldId: f.fieldId,
                  value: {
                    name: errorField.name,
                    index: indexWebFields,
                    value: {
                      fieldId: errorField.fieldId,
                      name: errorField.name,
                      value: errorField.value,
                    },
                  },
                  action: "update",
                });
              });
            }
          });
        }
      }
    }
    return { valid, errors };
  },

  async saveDataCard({ commit, state, getters }, params) {
    const copyChangedForm = JSON.parse(JSON.stringify(state.form));
    setLoading(commit, true);
    commit("setDisabled", true);

    const body = getters.getBodyForm;

    try {
      const httpMethod = params.cardId === "0" ? "put" : "put";
      await Promise.all(state.beforeSavePromises.map((func) => func()));
      const resp = await this.$axios[httpMethod](
        `${params.zone === "free" ? api.FREEDATACARD : api.DATACARD}/${params.moduleId}/${params.itemId}/${
          params.cardId
        }${params?.relId ? `?REL=${params.relId}` : ""}`,
        body
      );
      const data = resp.data[0];

      commit("setSavedError", false);
      commit("setCardId", data?.ID);
      commit("setCardRelId", data?.REL);
      commit("wizard/setForceUpdate", data.BWIZARDSTEPS ?? false, { root: true });
      commit("setDisabled", false);

      return resp;
    } catch (err) {
      commit("setSavedError", true);
      commit("setErrorMessage", err.response.data || err.message);
      commit("setFieldJsonError", getErrorMessage(err.response?.data));
      commit("returnDisable", copyChangedForm);

      if (err.response) {
        return err.response;
      }

      throw err;
    } finally {
      setLoading(commit, false);
      commit("setDisabled", false);
    }
  },

  async saveDataCardUploaders({ commit, state }, params) {
    const copyChangedForm = JSON.parse(JSON.stringify(state.form));
    setLoading(commit, true);
    commit("setDisabled", true);
    const copyFieldData = state.form.map((item) => ({ ...item }));
    const getFieldData = converter.save(copyFieldData);
    const dataIsReadyToTransfer = convertUploaderFilesToFormData(getFieldData);
    const httpMethod = params.idCard === "0" ? "post" : "put";
    try {
      const resp = await this.$axios[httpMethod](
        `/lk/main/v2/datacard2/${params.moduleId}/${params.itemId}/${params.cardId}${
          params.relId !== "undefined" ? `?rel=${params.relId}` : ""
        }`,
        dataIsReadyToTransfer
      );
      commit("setSavedError", false);
      commit("setCardId", resp.data[0].ID);
      commit("setCardRelId", resp.data[0].REL);
      commit("setDisabled", false);
      return resp;
    } catch (err) {
      commit("setSavedError", true);
      commit("setErrorMessage", err.response.data || err.message);
      commit("setFieldJsonError", getErrorMessage(err.response?.data));
      commit("returnDisable", copyChangedForm);
      if (err.response) {
        return err.response;
      }
      throw err;
    } finally {
      setLoading(commit, false);
      commit("setDisabled", false);
    }
  },

  async executeAction({ dispatch, commit, getters }, { relId, relActionId, rowId, actionId, body, zone }) {
    const params = zone === "free" ? "?zone=free" : "";
    const data = converter.save(body);
    try {
      setLoading(commit, true);
      return await this.$axios
        .post(`/api/card/actionexec/${rowId}/${actionId}/${relId}/${relActionId}${params}`, data || {})
        .then((resp) => {
          commit("setSavedError", false);
          setLoading(commit, false);
          return resp;
        });
    } catch (err) {
      setLoading(commit, false);
      commit("setDisabled", false);
      commit("setSavedError", true);
      commit("setErrorMessage", err.response?.data);
      commit("setFieldJsonError", getErrorMessage(err.response?.data));
      dispatch("menu/fetchMenuById", null, { root: true });
      return err.response;
    }
  },
  async fetchActionParams({ commit }, { moduleId, actionId, cardId, zone }) {
    try {
      const params = zone === "free" ? "?zone=free" : "";
      return await this.$axios.get(`/api/action/${moduleId}/${actionId}/${cardId}${params}`).then((resp) => {
        commit("setActionParams", resp.data);
        return resp.data;
      });
    } catch (e) {
      setLoading(commit, false);
      commit("setDisabled", false);
      return e;
    }
  },
  async fetchCaptcha({ commit }, { params, data }) {
    try {
      return await this.$axios
        .get(encodeURI(`${api?.CAPTCHA}?project=${params.idModule}/${params.idItem}&id=${params.idCard}`))
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
  async fetchList({ commit }, params) {
    try {
      return await this.$axios
        .get(encodeURI(`/api/list/${params.idModule}/${params.idItem}/[]${params.zone === "free" ? "?zone=free" : ""}`))
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
  /**
   * @description ОПИСАНИЕ ДАННЫХ ДЛЯ data.value НЕ ПОЛНОЕ!!!
   * @param commit
   * @param getters
   * @param state
   * @param dispatch
   * @param {Object} data
   * @param {Number} data.fieldId - Id поля
   * @param {String} data.name - наименование поля
   * @param {Object} data.params
   * @param {*} data.value
   * @param {Number} data.value.index - индекс OneToMany (если есть)
   * @param {Number} data.value.value.fieldId - id поля внутри OneToMany (если есть)
   * @param {String} data.value.value.name - наименование поля внутри OneToMany (если есть)
   * @return {Promise<void>}
   */
  async setActionFormField({ commit, getters, state, dispatch }, data) {
    const field = state.form?.find((d) => d.fieldId === data.fieldId);
    const isOneToManySearchSelect = data.value?.value?.type === "searchSelect";
    const form = isOneToManySearchSelect ? getOneToManyItem(state.form, data.fieldId, data.value?.index) : state.form;
    const deepFieldId = isOneToManySearchSelect ? data.value.value.fieldId : null;
    const deepField = isOneToManySearchSelect
      ? getters.getDataFieldByFieldId(deepFieldId, data.fieldId, data.value.index)
      : null;
    let fields;

    if (field?.type === "Collapse") {
      commit("toggleComponents", {
        ...data,
      });
    }
    if (field?.type === "OneToMany") {
      commit("setFormOneToManyField", data);
    }
    if ((field?.type === "searchSelect" && field?.options?.length) || isOneToManySearchSelect) {
      commit("setValueSearchSelect", data);
    }
    if (field?.type !== "OneToMany" && field?.type !== "searchSelect") {
      commit("setFormField", data);
    }

    if (
      (isOneToManySearchSelect || field?.type === "searchSelect") &&
      getters.getDataFieldsRelationsByFieldId(deepFieldId ?? field?.fieldId, form).length === 0
    ) {
      fields = { fields: [deepField ?? field] };
    } else {
      fields = {
        fields: getters.getDataFieldsRelationsByFieldId(deepFieldId ?? field?.fieldId, form),
      };
    }

    await dispatch("setOptionsField", { data, fields, form });
  },
  async maybeExecuteAction({ state, getters, rootGetters, dispatch }, data) {
    const { actionId } = state;

    if (!actionId) {
      return;
    }

    const { idCard, idRel } = getters.getFormParams;

    const action = rootGetters["menu/flatmenu"].flatMap((menu) => menu.ACTIONSCUR || []).find((a) => a.ID === actionId);

    if (!action) {
      return;
    }

    const body = getters.getForm;

    await dispatch("executeAction", {
      actionId,
      relActionId: action.REL,
      relId: idRel,
      rowId: idCard,
      body,
      zone: data?.zone,
    });
  },
  async setOptionsField({ commit, getters, state, dispatch }, { data, fields, form }) {
    const addZoneToURL = (url) => {
      const objectURL = new URL(url, "https://reso.ru");
      if (data.zone) {
        objectURL.searchParams.append("zone", data.zone);
      }
      return `${objectURL.pathname}${objectURL.search}`;
    };
    const fieldsArray = fields.fields;
    const urls = getters
      .getURLsByFieldsRelations({ fields: fieldsArray, form: form ? [...form] : null })
      .map((i) => ({ ...i, url: addZoneToURL(i.url, data.zone) }));
    const requests = [...urls]
      .filter((url) => !state.dictionaries.find((dictionary) => dictionary.url === url.url))
      .map((r) => r.url);

    controller = new AbortController();
    Promise.sequenceAllSettled = async (promiseFactories) => {
      const results = [];
      for (const factory of promiseFactories) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const value = await factory();
          results.push({ status: "fulfilled", value });
        } catch (reason) {
          results.push({ status: "rejected", reason });
        }
      }
      return results;
    };
    if (requests.length) {
      const { isSync } = state;
      const methodPromise = isSync ? "sequenceAllSettled" : "allSettled";
      const fns = requests.map(
        (endpoint) => () =>
          this.$axios.get(endpoint, {
            signal: controller.signal,
          })
      );
      await dispatch("maybeExecuteAction", data);
      const dataPromises = isSync ? fns : fns.map((f) => f());
      fieldsArray.forEach((f) => commit("setFieldLoading", { name: f.name, isLoading: true }));
      await Promise[methodPromise](dataPromises)
        .then((result) => {
          result.forEach((item) => {
            if (item.value) {
              commit("setDictionary", {
                url: item.value.config.url,
                options: item.value.data,
              });
            }
          });
        })
        .catch((e) => console.error(e))
        .finally(() =>
          fieldsArray.forEach((f) => {
            commit("setFieldLoading", { name: f.name, isLoading: false });
          })
        );
    }
    const oneToManyData = {
      index: data.value?.index ?? -1,
      oneToManyFieldId: data.fieldId ?? -1,
      fieldId: data.value?.value?.fieldId ?? -1,
    };
    const options = [...urls].filter((url) => state.dictionaries.find((dictionary) => dictionary.url === url.url));

    commit(
      "setFieldDictionaryOptions",
      { options, oneToManyData },
      oneToManyData.index === -1 || oneToManyData.fieldId === -1 ? null : oneToManyData
    );
  },
  async fetchDic({ commit, getters, state }, { isRelation, fieldRelation, fieldId, id, dic }) {
    try {
      let relationValue;
      let url;

      if (isRelation && fieldRelation) {
        if (fieldRelation.split(";")) {
          const fieldsRelations = getters.getDataFieldsByNames(fieldRelation.split(";")).map((item) => ({
            key: item.name.substring(0, 2) === `FK` ? item.name.substring(2) : item.name,
            value: item.value?.value,
          }));
          const objectValue = fieldsRelations.reduce((obj, item) => {
            if (item.value) {
              return Object.assign(obj, { [item.key]: item.value });
            }
            return obj;
          }, {});
          url = `/api/dic/55/${id}/${dic}/${state.cardId}?${new URLSearchParams(objectValue).toString()}`;
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
      return error;
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
  setAuthModalVisible(state, data) {
    state.isAuthModalVisible = data;
  },
  setToggleTooltip(state, data) {
    if (!data || typeof data !== "object") return;

    const { tooltipKey, isShow } = data;
    if (tooltipKey === null || tooltipKey === undefined) {
      state.toggleTooltip = state.toggleTooltip.map((tooltip) => ({
        ...tooltip,
        isShow: false,
      }));
      return;
    }

    const tooltip = state.toggleTooltip.find((t) => t.tooltipKey === tooltipKey);

    state.toggleTooltip.forEach((tooltip) => {
      tooltip.isShow = false;
    });

    if (tooltip) {
      tooltip.isShow = isShow;
    } else {
      state.toggleTooltip.push(data);
    }
  },
  setOneToMayFilters(state, data) {
    state.oneToManyFilters = Array.isArray(data) ? data : [];
  },
  /**
   *
   * @param {object} state
   * @param {object} data
   * @param {number} data.index
   * @param {object} data.filters
   * @return {void}
   */
  updateOneToMayFilters(state, data) {
    const oneToManyFilters = { ...state.oneToManyFilters[data.index], ...data.filters };

    state.oneToManyFilters[data.index] = { ...oneToManyFilters, ...data.filters };
  },

  setFieldOptionsByFieldId(state, data) {
    if (!data.options || !data.fieldId) {
      return;
    }

    if (data.oneToManyData.fieldId) {
      const { index } = data.oneToManyData;
      const oneToManyFieldId = data.oneToManyData.fieldId;
      const field = state.form
        ?.find((item) => item.fieldId === oneToManyFieldId)
        ?.value[index]?.find((b) => b.fieldId === data.fieldId);

      field.options = data.options;

      return;
    }
    if (data.options && data.fieldId) {
      state.form.find((item) => item.fieldId === data.fieldId).options = data.options;
    }
  },
  setActivePointInMap(state, data) {
    state.activePointInMap = data;
  },
  setShowMap(state, data) {
    state.isShowMap = data;
  },
  saveCopyVisibleInvisibleElements(state, data) {
    state.formCollapse.push(data);
  },
  setIsActionFormDisabled(state, data) {
    state.isActionFormDisabled = data;
  },
  setSaveSuccess(state, data) {
    state.isSaveSuccess = data;
  },
  setIsShowLoader(state, data) {
    state.isShowLoader = data;
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
    state.beforeSavePromises = state.beforeSavePromises.filter((item) => item !== func);
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
  filterFields(state) {
    state.form = state.form.filter((item) => {
      item.error = null;
      return !item.name.match(/^ID/);
    });
  },
  toggleComponents(state, data) {
    const [isShown] = data.value;

    if (isShown === "Y") {
      const saveDataBeforeChange = this.getters["data_card/getFormCollapseElements"];

      const dataForCollapse = saveDataBeforeChange.find(
        (el) =>
          el.visible.every((item) => data.value.includes(item.name)) &&
          el.inVisible.every((item) => data.value.includes(item.name))
      );

      if (!dataForCollapse) {
        this.commit("data_card/saveCopyVisibleInvisibleElements", {
          visible: this.getters["data_card/getVisibleComponents"](data.value),
          inVisible: this.getters["data_card/getHidedComponents"](data.value),
        });
      }
    }

    let currentCollapseElement;

    if (state.formCollapse) {
      currentCollapseElement = state.formCollapse.find(
        (el) =>
          el.visible.every((item) => data.value.includes(item.name)) &&
          el.inVisible.every((item) => data.value.includes(item.name))
      );
    }

    state.form = state.form.map((el) => {
      if (data.value.includes(el.name)) {
        if (isShown === "Y") {
          return {
            ...el,
            visible: getVisibleStatus(currentCollapseElement.visible, currentCollapseElement.inVisible, el.name),
          };
        }

        return { ...el, visible: !el.visible };
      }

      return el;
    });
  },
  setForm(state, data) {
    const formData = Array.isArray(data)
      ? data?.map((item) => ({ ...item, value: item.value, options: item.options }))
      : data;

    state.form = formData;
    state.bodyForm = converter.save(formData);
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

  // === multi-form support (optional helpers) ===
  setCurrentFormId(state, formId) {
    state.currentFormId = formId || null;
  },
  clearErrorMessageByForm(state, formId) {
    if (state.forms && state.forms[formId]) {
      state.forms[formId].errorMessage = null;
    }
  },
  setErrorMessage(state, data) {
    // Backward-compatible: data can be a string/any OR { formId, message }
    if (data && typeof data === "object" && Object.prototype.hasOwnProperty.call(data, "formId")) {
      const { formId, message } = data;
      if (!state.forms) state.forms = {};
      if (!state.forms[formId]) state.forms[formId] = {};
      state.forms[formId].errorMessage = message ?? null;
      // keep global in sync optionally (comment out if you don't want this)
      state.errorMessage = message ?? null;
    } else {
      state.errorMessage = data;
    }
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
    const item = getFormItemByName(state.form, data.name);

    const isOneToMany = state.form
      ?.find((d) => d.type === "OneToMany")
      ?.value.flat(Infinity)
      .filter((item) => item.required && item.visible);

    if (data.visible && data.required && isOneToMany) {
      for (let i = 0; isOneToMany.length > i; i++) {
        if (!isOneToMany[i].value) {
          isOneToMany[i].state = false;
        }
      }
    }

    if (item !== undefined) {
      this.commit("data_card/setPreviousFormFieldValue", data);
      this.commit("data_card/setFilterActive", data);
      item.value = data.value;
      const isStringWithMask = item.mask && item.type === "string";

      if (item.required && !isStringWithMask) {
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
            item.state = Boolean(item.value.value || item.value.value == 0);
          }
        }
        if (item.type === "CustomComboboxJSON") {
          if (item.value?.value[item.name] === null) {
            item.state = null;
            item.checked = false;

            if (item.options.length === 1) {
              // eslint-disable-next-line prefer-destructuring
              item.value.value = item.options[0];
            }
          } else {
            item.state = Boolean(item.value?.value[item.name] || item.value?.value == 0);
          }
        }
      }
      if (isStringWithMask) {
        const isValid = validateWithMask(item.value, item.mask);

        if (isValid) {
          item.state = true;
          item.checked = true;
          item.error = null;
        }

        if (data.action === "blur") {
          item.checked = true;
        }
        if (item.checked) {
          item.state = isValid;

          if (isValid === false) {
            const errorMask = setErrorMask(item.mask);
            if (errorMask) {
              item.error = errorMask;
            }
          }

          if (!item.value && !item.required) {
            item.state = null;
          }
        }
        if (item.required && data.state === null) {
          item.state = isValid;
        }
      }
      if (item.type === "GoogleCaptcha") {
        state.bodyForm[item.name] = converter.save([item])[item.name];
      } else {
        state.bodyForm = { ...state.bodyForm, ...converter.save([item]) };
      }
    }
  },
  setPreviousFormFieldValue(state, data) {
    if (data === null) {
      state.formValuesHistory = {};
      return;
    }
    const item = getFormItemByName(state.form, data.name);

    if (!item) {
      return;
    }

    state.formValuesHistory[data.name] = state.formValuesHistory[data.name] ?? [];
    state.formValuesHistory[data.name] = [data.value, ...state.formValuesHistory[data.name]];
  },
  setFilterActive(state, data) {
    if (data === null) {
      state.filterActive = {};
      return;
    }
    const item = getFormItemByName(state.form, data.name);

    if (!item) {
      return;
    }

    state.filterActive[data.name] = state.filterActive[data.name] ?? null;
    state.filterActive[data.name] = data.value;
  },
  setFormOneToManyField(state, data) {
    const item = state.form?.find((d) => d.fieldId === data.fieldId);
    const { schema, value } = item;

    if (data.action === "add") {
      value.push(schema.map((a) => ({ ...a, value: a.value ?? null })));
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
              update.state = Boolean(update.value.value || update.value.value == 0);
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
    if (state.formCacheKey !== state.menuId && state.menuId !== false && state.formCacheKey !== null) {
      state.captions = null;
      state.form = [];
      state.formCacheKey = null;
    }
  },
  clearFormField(state, data) {
    const item = state.form?.find((d) => d.fieldId === data.fieldId);
    item.value = null;
  },
  clearFilters(state) {
    state.filters = {};
  },
  clearFormRelationField(state, { name }) {
    let currentFieldName = name.substring(0, 2) === `FK` ? name.substring(2) : name;
    while (true) {
      const item = state.form.find((d) => {
        const splitted = d.fieldRelation?.split(";");
        if (splitted) {
          return splitted.includes(currentFieldName);
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
      const field = state.form?.find((item) => item.name === fieldName);
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
        const field = state.form?.find((item) => item.name === data.path);
        field.error = data.description;
        field.state = false;
      }
    } catch (error) {
      console.error(error);
    }
  },

  /**
   *
   * @param {Object} state
   * @param {Object} data
   * @param {String | Number} data.fieldId - всё поле
   * @param {Boolean} data.state - статус поля
   * @param {String | Null} data.error - сообщение об ошибке либо ничего елси ошибки нет
   * @param {Object} data.oneToManyData - даннфе о OneToMany. Если пусто значит поле без OneToMany
   */
  setFieldState(state, data) {
    const { oneToManyData } = data;
    const form = oneToManyData ? getOneToManyItem(state.form, oneToManyData.fieldId, oneToManyData.index) : state.form;
    const field = form?.find((item) => item.fieldId == data?.fieldId);

    if (!field) {
      console.warn(`data_card setFieldState. Не удалось найти поле с ID ${data.fieldId || "не определено"}`);

      return;
    }

    field.state = data.state;
    field.error = data.error;
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
  setRouterChanged(state, params) {
    state.isRouterChanged = params;
  },
  setFieldLoading(state, params) {
    const field = state.form?.find((item) => item.name === params.name);
    if (field) {
      field.isLoading = params.isLoading;
    }
  },
  setVisible(state, params) {
    state.visible = params;
  },
  setVisibleByName(state, data) {
    const field = state.form?.find((item) => item.name === data.name);
    if (field) {
      field.visible = data.visible;
    }
  },
  setValueByName(state, data) {
    const field = state.form?.find((item) => item.name === data.name);
    if (field) {
      field.value = data.value;
      state.bodyForm[data.name] = data.value;
    }
  },
  setAddFields(state, params) {
    state.addFields = params;
  },
  returnDisable(state, oldForm) {
    if (Array.isArray(state.form)) {
      state.form = state.form.map((item) => {
        const copyField = oldForm.find((field) => field.fieldId === item.fieldId);
        item.readonly = copyField.readonly;
        return item;
      });
    }
  },
  setDisabled(state, params) {
    if (Array.isArray(state.form)) {
      state.form = state.form.map((item) => {
        const copyField = state.copyForm.find((field) => field.fieldId === item.fieldId);
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
    const field = state.form?.find((item) => item.name === data.name);
    if (field) {
      field.readonly = data.disable;
    }
  },
  setCaptcha(state, data) {
    const item = state.form?.find((d) => d.fieldId === data.data.fieldId);
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
    const oneToManyData = data.value?.value?.type === "searchSelect" && {
      oneToManyFieldId: data.fieldId,
      index: data.value.index,
    };
    const fileId = oneToManyData ? data.value.value.fieldId : data.fieldId;
    const fieldVal = oneToManyData ? data.value.value.value : data.value;
    const form = oneToManyData
      ? getOneToManyItem(state.form, oneToManyData.oneToManyFieldId, oneToManyData.index)
      : state.form;
    const field = form?.find((d) => d.fieldId === fileId);
    const value = fieldVal ? field.options.find((item) => item.ID === fieldVal)?.ID : fieldVal;
    const fieldRelations = form.filter((f) => (f.fieldRelation ? f.fieldRelation.includes(field.name) : false));

    fieldRelations.forEach((fieldRelation) => {
      if (fieldRelation.type === "searchSelect") {
        fieldRelation.value = null;
        fieldRelation.state = null;
        fieldRelation.options = [];

        if (fieldRelation.required === false) {
          fieldRelation.visible = false;
        }
      }
    });
    if (value) {
      field.value = value;
      field.state = true;
    } else if (value === "" && field.required) {
      field.value = "";
      field.state = false;
    } else {
      field.value = null;
      field.state = null;
    }
  },
  setEnumOptions(state, params) {
    const item = state.form?.find((d) => d.fieldId === params.fieldId);
    if (state.isClearOptions) {
      item.options = [];
      return;
    }
    item.options = params.options;
    if (!item.value?.value) {
      if (item.options.length === 1) {
        const [paramsOptionsFirstEl] = params.options;
        item.value = paramsOptionsFirstEl;
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
      state.fetchingActions = state.fetchingActions.filter((id) => id !== actionId);
    }
  },
  setDictionary(state, data) {
    state.dictionaries.push(data);
  },
  setDictionaryOptions(state, data) {
    data.forEach((item) => {
      const dictionary = state.dictionaries.find((dic) => dic.url === item.url);
      const field = state.form?.find((f) => f.fieldId === item.fieldId);

      field.options = dictionary.options;
      field.visible = field.fieldId !== 66047;
    });
  },
  setFieldDictionaryOptions(state, data) {
    const { options, oneToManyData } = data;
    const isOneToMany = oneToManyData?.index !== -1 && oneToManyData.fieldId !== -1;

    options.forEach((item) => {
      const dictionary = state.dictionaries.find((dic) => dic.url === item.url);
      const form = isOneToMany
        ? getOneToManyItem(state.form, oneToManyData.oneToManyFieldId, oneToManyData.index)
        : state.form;
      const field = form?.find((f) => f.fieldId === item.fieldId);
      field.options = [...dictionary.options];
      field.visible = field.fieldId !== 66047;
    });
  },
  clearDictionariesUrls(state) {
    state.dictionaries = [];
  },
  setSync(state, data) {
    state.isSync = data;
  },
  setActionId(state, data) {
    state.actionId = data;
  },
};

export const createFormModule = () => ({
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
});

export const DATA_CARD_NAMESPACE = "data_card";
