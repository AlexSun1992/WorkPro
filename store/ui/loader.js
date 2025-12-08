export const state = () => ({
  // Число запущенных запросов
  requestsCount: 0,
  // Признак необходимости лоудера
  showLoader: false,
});

export const getters = {
  isRequestsInProgress: (state) => Boolean(state.requestsCount),
  requestsCount: (state) => state.requestsCount,
  getShowLoader: (state) => state.showLoader,
};

export const mutations = {
  incrementRequestCount(state) {
    state.requestsCount += 1;
  },

  decrementRequestCount(state) {
    if (state.requestsCount > 0) {
      state.requestsCount -= 1;
    }
  },

  setShowLoader(state, data) {
    state.showLoader = data;
  },

  clearCounter(state) {
    state.requestsCount = 0;
  },
};

export const actions = {};
