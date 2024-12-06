import { getErrorMessage } from "../utils/transform";

const FILETYPES = "FILE_TYPES";
const FILES_PROPERTY = "FILES";
const FORM_SETTINGS = "FORM_SETTINGS";
let controller;
export const state = () => ({
  data: null,
  fileObjects: [],
  fileErrors: [],
  isLoading: false,
  isLoadSuccessFull: null,
  dataSuccess: null,
  dataError: null,
  progressValue: null,
  poutValueRoute: null,
  metaData: [],
});

export const getters = {
  getData: (state) => {
    const item = state.data.find((type) => type.name === FILETYPES);
    const el = "value" in item ? item : { ...item, value: [] };
    return el.value.map((item) => ({
      ...item,
      FILES: state.data
        .find((file) => file.name === FILES_PROPERTY)
        .value.filter((fileType) => fileType.NAME === item.NAME),
    }));
  },

  getAllFilesOnPage(state, getters) {
    return getters.getData.map((el) => el.FILES).flat();
  },

  getFormData: (state, getters) => {
    const formData = new FormData();
    const fileObjects = getters.getFileObjects;
    const data = getters.getData;
    data.forEach((item) => {
      item.FILES.forEach((file) => {
        const fileObject = fileObjects.find(
          (obj) =>
            obj.name === file.FILENAME &&
            obj.size === file.SIZE &&
            !file.IDDOCPHOTO
        );
        if (fileObject) {
          const uploadFile = new File([fileObject], fileObject.name, {
            type: "field/blob",
          });
          formData.append(item.NAME, uploadFile);
        }
      });
    });

    formData.append(
      "JSON",
      JSON.stringify({ FILES: getters.getAllFilesOnPage })
    );
    return formData;
  },

  getPoutValueRoute: (state) => state.poutValueRoute,

  metaData: (state) => state.metaData,

  getFileObjects: (state) => state.fileObjects,
  getFileErrors: (state) => [
    ...new Map(state.fileErrors.map((item) => [item.type, item])).values(),
  ],
  getFiles: (state) =>
    state.data.find((type) => type.name === FILES_PROPERTY).value,
  formSettings: (state) =>
    state.data.find((type) => type.name === FORM_SETTINGS).value,
  getAllSize: (state, getters) =>
    getters.getFiles.reduce((acc, curr) => acc + curr.SIZE, 0),
  isErrorSize: (state, getters) =>
    getters.getAllSize > getters.formSettings.TOTAL_LIMIT,
  isLoadSuccessFull: (state) => state.isLoadSuccessFull,
  isLoading: (state) => state.isLoading,
  getDataSuccess: (state) => state.dataSuccess,
  getDataError: (state) => state.dataError,
  getProgressValue: (state) => state.progressValue,
  getErrorMessage: (state, getters) => {
    if (getters.getDataError) {
      if (typeof getErrorMessage(getters.getDataError) === "object") {
        return getErrorMessage(getters.getDataError)?.description;
      }
      return getErrorMessage(getters.getDataError);
    }
    return null;
  },
  isInValidFiles: (state, getters) =>
    getters.getData.some((item) => {
      if (getters.isErrorSize) {
        return true;
      }
      if (item.FILES.length > item.MAX_FILE_COUNT) {
        return true;
      }
      if (item.FILES.length < item.MIN_FILE_COUNT) {
        return true;
      }
      if (
        Math.max(...item.FILES.map((file) => file.SIZE)) > item.MAX_FILE_SIZE
      ) {
        return true;
      }
      return false;
    }),
};

export const actions = {
  async fetchData({ commit }, params) {
    await this.$axios
      .get(
        `/api/card/${params.idModule}/${params.idItem}/${params.idCard}/${params.idRel}`
      )
      .then((res) => {
        commit("setMetaData", res.data.metaData);
        commit("menu/setBreadCrumbs", res.data.metaData?.breadCrumbs, {
          root: true,
        });
        commit("setData", res.data.data);
      });
  },
  addData({ commit, getters }, { data, name }) {
    const settingsByName = getters.getData.find((item) => item.NAME === name);
    const { MAX_FILE_SIZE, MIN_FILE_COUNT, MAX_FILE_COUNT, FILES } =
      settingsByName;
    const IS_ERROR_MAX_FILE_COUNT = FILES.length + data.length > MAX_FILE_COUNT;
    const IS_ERROR_MIN_FILE_COUNT = FILES.length + data.length < MIN_FILE_COUNT;
    commit("setFileErrors", []);
    if (IS_ERROR_MAX_FILE_COUNT) {
      commit("setFileError", {
        name,
        type: "MAX_FILE_COUNT",
      });
    }
    if (IS_ERROR_MIN_FILE_COUNT) {
      commit("setFileError", {
        name,
        type: "MIN_FILE_COUNT",
      });
    }
    if (!IS_ERROR_MAX_FILE_COUNT && !IS_ERROR_MIN_FILE_COUNT) {
      data.forEach((item) => {
        const IS_ERROR_TOTAL_LIMIT =
          getters.getAllSize + item.size > getters.formSettings.TOTAL_LIMIT;
        const IS_ERROR_MAX_FILE_SIZE = item.size > MAX_FILE_SIZE;
        if (IS_ERROR_TOTAL_LIMIT) {
          commit("setFileError", {
            name,
            type: "TOTAL_LIMIT",
          });
        }
        if (IS_ERROR_MAX_FILE_SIZE) {
          commit("setFileError", {
            name,
            type: "MAX_FILE_SIZE",
          });
        }
        if (!IS_ERROR_TOTAL_LIMIT && !IS_ERROR_MAX_FILE_SIZE) {
          commit("setFile", {
            FILENAME: item.name,
            SIZE: item.size,
            NAME: name,
          });
          commit("setFileObject", item);
        }
      });
    }
  },
  async saveDataUploader({ commit, state, getters }, params) {
    try {
      const formData = getters.getFormData;
      commit("setLoading", true);
      commit("setDataError", null);
      controller = new AbortController();
      const config = {
        signal: controller.signal,
        onUploadProgress: (progressEvent) => {
          commit(
            "setProgressValue",
            (progressEvent.loaded / progressEvent.total) * 100
          );
        },
      };
      const httpMethod = params.idCard === "0" ? "post" : "put";
      const result = await this.$axios[httpMethod](
        `/am/main/v2/datacard2/${params.idModule}/${params.idItem}/${
          params.idCard
        }${params.idRel !== "undefined" ? `?rel=${params.idRel}` : ""}`,
        formData,
        config
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
  cancelUploading({ commit }) {
    controller.abort();
    commit("setLoading", false);
  },
  delFile({ commit }, data) {
    commit("setFileErrors", []);
    commit("removeFile", data);
  },
};

export const mutations = {
  setData(state, data) {
    state.data = data;
  },
  setMetaData(state, data) {
    state.metaData = data;
  },
  setFiles(state, data) {
    const files = state.data.find(
      (file) => file.name === FILES_PROPERTY
    )?.value;
    if (files && Array.isArray(data)) {
      data.forEach((item) => files.push(item));
    }
  },

  setFile(state, data) {
    const files = state.data.find(
      (file) => file.name === FILES_PROPERTY
    )?.value;
    files.push(data);
  },
  setFileObjects(state, data) {
    if (Array.isArray(data)) {
      data.forEach((item) => state.fileObjects.push(item));
    }
  },
  setFileObject(state, data) {
    state.fileObjects.push(data);
  },
  removeFile(state, data) {
    const files = state.data.find(
      (file) => file.name === FILES_PROPERTY
    )?.value;
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
  setProgressValue(state, data) {
    state.progressValue = data;
  },
  setFileError(state, data) {
    state.fileErrors.push(data);
  },
  setFileErrors(state, data) {
    state.fileErrors = data;
  },
};
