export const state = () => ({
  car: {},
});

export const actions = {
  async get({ commit }, params) {
    await this.$axios.get(`/wp-json/acf/v3/main/${params}`).then((res) => {
      if (res.status === 200) {
        commit("set", res.data);
      }
    });
  },
};

export const mutations = {
  set(state, cars) {
    state.car = cars;
  },
};
