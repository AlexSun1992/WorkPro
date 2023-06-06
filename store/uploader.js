const FILETYPES = "FILE_TYPES";
const FILES = "FILES";
const FORM_SETTINGS = "FORM_SETTINGS";
export const state = () => ({
  data: null,
  fileObjects: [],
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
  getFileSettings: (state) =>
    state.data.find((type) => type.name === FORM_SETTINGS).value,
  getAllSize: (state, getters) =>
    getters.getFiles.reduce((acc, curr) => acc + curr.SIZE, 0),
  isErrorSize: (state, getters) =>
    getters.getAllSize > getters.getFileSettings.TOTAL_LIMIT,
};

export const actions = {
  async fetchData({ commit, getters }, params) {
    await this.$axios
      .get(
        `/api/card/${params.idModule}/${params.idItem}/${params.idCard}/${params.idRel}`
      )
      .then((res) => {
        commit("setData", res.data.data);
      });
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
};
