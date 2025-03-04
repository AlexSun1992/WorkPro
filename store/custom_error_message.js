export const state = () => ({
  errors: []
});

export const getters = {
  errors(state) {
    return state.errors;
  }
};

export const mutations = {
  addError(state, error) {
    state.errors.push(error);
  }
};
