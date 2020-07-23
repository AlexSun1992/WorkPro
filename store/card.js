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
  wizardData: null,
  cardForm: null
})

export const getters = {
  page: state => state.page,
  list: state => state.list,
  form: state => state.form,
  cardForm: state => state.cardForm,
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
        commit('setForm', res.data.data);
      })
  },
  async fetchCardForm ({commit, getters}, id) {
    await this.$axios.get(`/api/card/${getters['page'].idModule}/${id}/0`)
      .then((res) => {
        // Вынести в общую функцию
        let cols = [];
        res.data.metaData.data.forEach(field => {
          cols.push(field.cols);
        });
        let maxCol = Math.max(...cols);
        res.data.metaData.data.forEach(field => {
          // field.cols = field.cols*12/obj.maxCol;
          if (field.width == 0) {
            field.width = 100;
          }
          field.cols = Math.ceil((field.cols/maxCol) * (field.width/100) * 12);
        });
        commit('setCardForm', res.data.metaData.data);
      })
  },
  clearCardForm({commit, getters}) {
    commit('clearCardForm');
  },
  async fetchWizard ({commit, getters}, params) {
    let card = await this.$axios.get(`/api/card/${getters['page'].idModule}/${getters['page'].idItem}/${params.id}`);
    let captions = card.data.metaData.captions.split(';');
    captions.pop();
    let fields = card.data.metaData.data;
    let tabs = captions.map(caption => {
      return {
        'title': caption,
        'data': []
      };
    });
    // Вынести в общую функцию (см. выше)
    fields.forEach(item => {
      tabs[item.page]['data'].push(item);
    });
    tabs.forEach(tab => {
      let obj = {};
      let cols = [];
      obj.title = tab.title;
      tab.data.forEach(field => {
        cols.push(field.cols);
      });
      obj.maxCol = Math.max(...cols);
      tab.data.forEach(field => {
        // field.cols = field.cols*12/obj.maxCol;
        if (field.width == 0) {
          field.width = 100;
        }
        field.cols = Math.ceil((field.cols/obj.maxCol) * (field.width/100) * 12);
      });
    });
    commit('setWizardData', tabs);
    commit('setShowWizard', true);
    commit('setShowFilter', false);
    commit('setShowList', false);
  },
  updateWizard({commit, getters}, params) {
    commit('setWizardData', params);
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
  async saveProfile ({commit, dispatch, getters}, form) {
    await this.$axios.post(`/api/card/${getters['page'].idModule}/${getters['page'].idItem}/125`, form)
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
  async fetchSuggestions({commit, getters}, params) {
    let type = params.suggestionType;
    let key = params.key;
    delete params.suggestionType;
    delete params.key;
    let response = await fetch(`https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Token ${key}`
        },
        body: JSON.stringify(params)
      }); 
    let result = await response.json();
    return result.suggestions;
    // return result.suggestions.map(item => item.value);
  }
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
  },
  setCardForm(state, data) {
    state.cardForm = data
  },
  clearCardForm(state, data) {
    state.cardForm = null;
  }
}
