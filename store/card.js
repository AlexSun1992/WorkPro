export const state = () => ({
  page: {},
  form : [],
  list: {},
  filters: [],
  actions: [],
  showList: false,
  showForm: false,
  showFilter: false,
  showAction: false
})

export const getters = {
  page: state => state.page,
  list: state => state.list,
  form: state => state.form,
  filters: state => state.filters,
  actions: state => state.actions,
  isForm: state => state.showForm,
  isList: state => state.showList,
  isFilter: state => state.showFilter,
  isActions: state => state.showActions,
}

export const actions = {
  async setCard ({commit, dispatch}, params) {
    if(params.page.idModule){
      commit('setPage',params.page)
      commit('setShowList', params.settings.recordLoad && !params.settings.newRecord);
      commit('setShowFilter', params.settings.filters.length > 0);
      commit('setFilters', params.settings.filters);
      commit('setShowForm', false);
      commit('setList',{});
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
  async applyFilter ({commit, dispatch, getters}, filters) {
    commit('setFilters', filters);
    await dispatch('fetchList');
  },
  async saveForm ({commit, dispatch, getters}, form) {
    await this.$axios.post(`/api/card/${getters['page'].idModule}/${getters['page'].idItem}/0`, form)
      .then(resp => {
        console.log(resp.data)
      })
  },
  async fetchList ({commit, getters}) {
    const page = getters['page'];
    const jsonFilters = JSON.stringify(getters['filters']);
    await this.$axios.get(`/api/list/${page.idModule}/${page.idItem}/${jsonFilters}`)
      .then((res) => {
        commit('setShowList', true);
        commit('setList', res.data);
      })
  },
}

export const mutations = {
  setPage(state, data) {
    state.page = data
  },
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
  setShowList(state, data) {
    state.showList = data
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
