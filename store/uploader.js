import { getErrorMessage } from "../utils/transform";

const FILETYPES = "FILE_TYPES";
const FILES = "FILES";
const FORM_SETTINGS = "FORM_SETTINGS";
export const state = () => ({
  data: null,
  fileObjects: [],
  isLoading: false,
  isLoadSuccessFull: null,
  dataSuccess: null,
  dataError: null,
});

export const getters = {
  getData: (state) =>
    state.data
      .find((type) => type.name === FILETYPES)
      .value.map((item) => ({
        ...item,
        FILES: state.data
          .find((file) => file.name === FILES)
          .value.filter((fileType) => fileType.NAME === item.NAME),
      })),
  getFileObjects: (state) => state.fileObjects,
  getFiles: (state) => state.data.find((type) => type.name === FILES).value,
  getFormSettings: (state) =>
    state.data.find((type) => type.name === FORM_SETTINGS).value,
  getAllSize: (state, getters) =>
    getters.getFiles.reduce((acc, curr) => acc + curr.SIZE, 0),
  isErrorSize: (state, getters) =>
    getters.getAllSize > getters.getFormSettings.TOTAL_LIMIT,
  isLoadSuccessFull: (state) => state.isLoadSuccessFull,
  isLoading: (state) => state.isLoading,
  getDataSuccess: (state) => state.dataSuccess,
  getDataError: (state) => state.dataError,
  getErrorMessage: (state, getters) => {
    if (!getters.getDataError) {
      return "Приносим извинения, в Личном Кабинете что-то пошло не так.";
    }
    if (typeof getErrorMessage(getters.getDataError) === "object") {
      return getErrorMessage(getters.getDataError)?.description;
    }
    return getErrorMessage(getters.getDataError);
  },
};

export const actions = {
  async fetchData({ commit }, params) {
    await this.$axios
      .get(
        `/api/card/${params.idModule}/${params.idItem}/${params.idCard}/${params.idRel}`
      )
      .then((res) => {
        commit("setData", res.data.data);
      });
  },
  async saveDataUploader({ commit, state, getters }, params) {
    try {
      const formData = new FormData();
      const fileObjects = getters.getFileObjects;
      const data = getters.getData;
      data.forEach((item) => {
        item.FILES.forEach((file) => {
          const fileObject = fileObjects.find(
            (obj) => obj.name === file.FILENAME
          );
          if (fileObject) {
            const uploadFile = new File([fileObject], fileObject.name, {
              type: "field/blob",
            });
            formData.append(item.NAME, uploadFile);
          }
        });
      });
      formData.append("JSON", JSON.stringify(getters.getFiles));
      commit("setLoading", true);
      const result = await this.$axios.post(
        `/am/main/v2/datacard2/${params.idModule}/${params.idItem}/${
          params.idCard
        }${params.idRel !== "undefined" ? `?rel=${params.idRel}` : ""}`,
        formData
      );
      commit("setLoadSuccessFull", true);
      commit("setDataSuccess", result);
    } catch (e) {
      commit("setLoadSuccessFull", false);
      commit("setDataError", e?.response?.data);
    } finally {
      commit("setLoading", false);
    }
  },
};

export const mutations = {
  setData(state, data) {
    state.data = data;
  },
  setFiles(state, data) {
    const files = state.data.find((file) => file.name === FILES)?.value;
    if (files && Array.isArray(data)) {
      data.forEach((item) => files.push(item));
    }
  },
  setFileObjects(state, data) {
    if (Array.isArray(data)) {
      data.forEach((item) => state.fileObjects.push(item));
    }
  },
  removeFile(state, data) {
    const files = state.data.find((file) => file.name === FILES)?.value;
    const { fileObjects } = state;
    const fileObject = fileObjects.find((item) => item.name === data.FILENAME);
    files.splice(files.indexOf(data), 1);
    if (fileObject) {
      fileObjects.splice(fileObjects.indexOf(fileObject), 1);
    }
  },
  setLoadSuccessFull(state, data) {
    state.isLoadSuccessFull = data;
  },
  setDataSuccess(state, data) {
    state.dataSuccess = data;
  },
  setDataError(state, data) {
    state.dataError = data || null;
  },
  setLoading(state, data) {
    state.isLoading = data;
  },
};
