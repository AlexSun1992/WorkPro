export const state = () => ({
  page: {},
  form : [],
  list: {},
  filters: [],
  actions: [],
  showList: false,
  showForm: false,
  showFilter: false,
  showAction: false,
  showWizard: false,
  isAdd: false,
  isEdit: false,
  isDelete: false,
  isFormLoading: false,
  isListLoading: false,
  componentType: null,
  cardId: 0,
  wizardData: null
})

export const getters = {
  page: state => state.page,
  list: state => state.list,
  form: state => state.form,
  filters: state => state.filters,
  actions: state => state.actions,
  isForm: state => state.showForm,
  isList: state => state.showList,
  isWizard: state => state.showWizard,
  isFilter: state => state.showFilter,
  isActions: state => state.showActions,
  isEdit: state => state.isEdit,
  isAdd: state => state.isAdd,
  isDelete: state => state.isDelete,
  isFormLoading: state => state.isFormLoading,
  isListLoading: state => state.isListLoading,
  componentType: state => state.componentType,
  cardId: state => state.cardId,
  wizardData: state => state.wizardData
}

export const actions = {
  async setCard ({commit, dispatch, getters}, params) {
    if(params.page.idModule){
      commit('setPage',params.page)
      commit('setShowList', params.settings.recordLoad && !params.settings.newRecord);
      commit('setShowFilter', params.settings.filters.length > 0);
      commit('setFilters', params.settings.filters);
      commit('setActions', params.settings.actions);
      commit('setEdit', params.settings.edit);
      commit('setAdd', params.settings.add);
      commit('setDelete', params.settings.delete);
      commit('setComponentType', params.settings.compType);
      commit('setShowForm', false);
      commit('setShowWizard', false);
      commit('setList',{});
      if(params.settings.newRecord){
        await dispatch('fetchForm', 0);
        commit('setShowForm', true);
        commit('setShowFilter', false);
      }else{
        await dispatch('fetchList');
      }
    }
  },
  async fetchForm ({commit, getters}, id) {
    await this.$axios.get(`/api/card/${getters['page'].idModule}/${getters['page'].idItem}/${id}`)
      .then((res) => {
        commit('setCardId', id)
        commit('setShowForm', true);
        commit('setShowFilter', false);
        commit('setShowList', false);
        commit('setForm', res.data);
      })
  },
  async fetchWizard ({commit, getters}, params) {
    let promise;
    let promises = [];
    params.wizard.forEach(item => {
      let entity = item.list ? 'wizardlist' : 'card';
      promise = this.$axios.get(`/api/${entity}/${getters['page'].idModule}/${item.idItem}/${params.id}`);
      promises.push(promise);
    });
    Promise.all(promises).then(results => {
      let wizardData = params.wizard;
      wizardData.forEach((item, i) => {
        item['data'] = results[i].data;
      });
      commit('setWizardData', wizardData);
    }).catch((error) => {
      console.log(error);
    });
    commit('setShowWizard', true);
    commit('setShowFilter', false);
    commit('setShowList', false);
  },
  
  async applyFilter ({commit, dispatch, getters}, filters) {
    commit('setFilters', filters);
    await dispatch('fetchList');
  },
  async applyAction ({commit, dispatch, getters}, {form, actionId}) {
    await dispatch('saveForm', form);
    return new Promise((resolve, reject) => {
      this.$axios.post(`am/main/v2/actionexec/${getters['cardId']}/${actionId}`, {})
        .then(res => {
          dispatch('fetchForm', getters['cardId']);
          resolve(res.data)
        })
        .catch(err => {
        reject(err.response.data)
      })
    })
  },
  async saveForm ({commit, dispatch, getters}, form) {
    await this.$axios.post(`/api/card/${getters['page'].idModule}/${getters['page'].idItem}/${getters['cardId']}`, form)
      .then(async resp => {
        commit('setCardId', resp.data.ID)
      })
  },
  async fetchList ({commit, getters}) {
    const page = getters['page'];
    const jsonFilters = JSON.stringify(getters['filters']);
    commit('setShowList', true);
    commit('setListLoading', true);
    await this.$axios.get(`/api/list/${page.idModule}/${page.idItem}/${jsonFilters}`)
      .then((res) => {
        commit('setListLoading', false);
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
  setShowWizard(state, data) {
    state.showWizard = data
  },
  setShowFilter(state, data) {
    state.showFilter = data
  },
  setShowActions(state, data) {
    state.showActions = data
  },
  setEdit(state, data) {
    state.isEdit = data
  },
  setAdd(state, data) {
    state.isAdd = data
  },
  setDelete(state, data) {
    state.isDelete = data
  },
  setFormLoading(state, data) {
    state.isFormLoading = data
  },
  setListLoading(state, data) {
    state.isListLoading = data
  },
  setComponentType(state, data) {
    state.componentType = data
  },
  setCardId(state, data) {
    state.cardId = data
  },
  setWizardData(state, data) {
    state.wizardData = data
  }
}
