export const state = () => ({
  isAuthorizationModal: false,
  isLogged: false,
  user: null,
});
export const getters = {
  isAuthorizationModal: (state) => state.isAuthorizationModal,
  getLogged: (state) => state.isLogged,
  getUser: (state) => state.user,
};
export const mutations = {
  setAuthorizationModal(state, data) {
    state.isAuthorizationModal = data;
  },
  setLogged(state, data) {
    state.isLogged = data;
  },
  setUser(state, data) {
    state.user = data;
  },
};
