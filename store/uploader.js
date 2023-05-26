export const state = () => ({
  data: null,
});

export const getters = {
  getData: (state) => state.data,
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
};
