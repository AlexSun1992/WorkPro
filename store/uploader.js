const FILETYPES = "FILE_TYPES";
const FILES = "FILES";
export const state = () => ({
  data: null,
});

export const getters = {
  getData: (state) =>
    state.data
      .find((type) => type.name === FILETYPES)
      .value.map((item) => ({
        ...item,
        FILES: state.data
          .find((file) => file.name === FILES)
          .value.filter((fileType) => fileType.TYPE === item.TYPE),
      })),
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
    const files = (state.data = data);
  },
};
