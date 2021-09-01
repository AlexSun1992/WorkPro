export const state = () => ({
  isLogged: false,
  user: null,
});
export const getters = {
  getLogged: (state) => state.isLogged,
  getUser: (state) => state.user,
};
export const mutations = {
  setLogged(state, data) {
    state.isLogged = data;
  },
  setUser(state, data) {
    state.user = data;
  },
};
