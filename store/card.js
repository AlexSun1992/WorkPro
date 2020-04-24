export const state = () => ({
  form : [],
  list: [],
  filters: [],
  actions: [],
  showGrid: false,
  showForm: false,
  showFilter: false,
  showAction: false
})

export const getters = {
  list: state => state.list,
  form: state => state.form,
  filters: state => state.filters,
  actions: state => state.actions,
  isForm: state => state.showForm,
  isGrid: state => state.showGrid,
  isFilter: state => state.showFilter,
  isActions: state => state.showActions,
}

export const actions = {
  async setCard ({commit, dispatch}, params) {
    if(params.page.idModule){
      commit('setShowGrid', params.settings.recordLoad && !params.settings.newRecord);
      commit('setShowFilter', params.settings.filters.length > 0);
      commit('setFilters', params.settings.filters);
      commit('setShowForm', false);
      if(params.settings.newRecord){
        await dispatch('fetchForm', {idModule: params.page.idModule, idItem: params.page.idItem, id: 0});
        commit('setShowForm', true);
        commit('setShowFilter', false);
      }
    }
  },
  async fetchForm ({commit}, {idModule, idItem, id}) {
    await this.$axios.get(`/api/card/${idModule}/${idItem}/${id}`)
      .then((res) => {
        commit('setForm', res.data);
      })
  },
}

export const mutations = {
  setList(state, data) {
    state.list = data
  },
  setForm(state, data) {
    state.form = data
  },
  setFilters(state, data) {
    state.filters = data
  },
  setActions(state, data) {
    state.actions = data
  },
  setShowGrid(state, data) {
    state.showGrid = data
  },
  setShowForm(state, data) {
    state.showForm = data
  },
  setShowFilter(state, data) {
    state.showFilter = data
  },
  setShowActions(state, data) {
    state.showActions = data
  }
}
