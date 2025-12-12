export const state = () => ({
  page: {},
  form: [],
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
  cardForm: null,
  isFormChanged: false,
});

export const getters = {
  page: (state) => state.page,
  list: (state) => state.list,
  form: (state) => state.form,
  cardForm: (state) => state.cardForm,
  filters: (state) => state.filters,
  actions: (state) => state.actions,
  isForm: (state) => state.showForm,
  isList: (state) => state.showList,
  isWizard: (state) => state.showWizard,
  isFilter: (state) => state.showFilter,
  isActions: (state) => state.showActions,
  isEdit: (state) => state.isEdit,
  isAdd: (state) => state.isAdd,
  isDelete: (state) => state.isDelete,
  isFormLoading: (state) => state.isFormLoading,
  isListLoading: (state) => state.isListLoading,
  componentType: (state) => state.componentType,
  cardId: (state) => state.cardId,
  isFormChanged: (state) => state.isFormChanged,
  getWizardDataFieldByName: (state) => (name) => state.wizardData.find((b) => b.name === name),
  getWizardDataFieldByFieldId: (state) => (id) => state.wizardData.find((b) => b.fieldId === id),
};

export const actions = {
  async setCard({ commit, dispatch }, params) {
    if (params.page.idModule) {
      commit("setPage", params.page);
      commit("setShowList", params.settings.recordLoad && !params.settings.newRecord);
      commit("setShowFilter", params.settings.filters.length > 0);
      commit("setFilters", params.settings.filters);
      commit("setActions", params.settings.actions);
      commit("setEdit", params.settings.edit);
      commit("setAdd", params.settings.add);
      commit("setDelete", params.settings.delete);
      commit("setComponentType", params.settings.compType);
      commit("setShowForm", false);
      commit("setShowWizard", false);
      commit("setFormChanged", false);
      commit("setList", {});
      if (params.settings.newRecord) {
        await dispatch("fetchForm", 0);
        commit("setShowForm", true);
        commit("setShowFilter", false);
      } else {
        // await dispatch("fetchList");
      }
    }
  },
  async fetchForm({ commit, getters }, id) {
    await this.$axios.get(`/api/card/${getters.page.idModule}/${getters.page.idItem}/${id}`).then((res) => {
      commit("setCardId", id);
      commit("setShowForm", true);
      commit("setShowFilter", false);
      commit("setShowList", false);
      commit("setForm", res.data.data);
    });
  },
  async fetchCardForm({ commit, getters }, id) {
    await this.$axios.get(`/api/card/${getters.page.idModule}/${id}/0`).then((res) => {
      // Вынести в общую функцию
      const cols = [];
      res.data.metaData.data.forEach((field) => {
        cols.push(field.cols);
      });
      const maxCol = Math.max(...cols);
      res.data.metaData.data.forEach((field) => {
        // field.cols = field.cols*12/obj.maxCol;
        if (field.width == 0) {
          field.width = 100;
        }
        field.cols = Math.ceil((field.cols / maxCol) * (field.width / 100) * 12);
      });
      commit("setCardForm", res.data.metaData.data);
    });
  },
  clearCardForm({ commit }) {
    commit("clearCardForm");
  },
  async fetchWizard({ commit }) {
    commit("setShowWizard", true);
    commit("setShowFilter", false);
    commit("setShowList", false);
  },
  updateWizard({ commit }, params) {
    commit("setWizardData", params);
  },

  updateWizardField({ commit }, data) {
    commit("setWizardField", data);
  },

  clearCaptions({ commit }) {
    commit("clearCaptions");
  },

  async applyFilter({ commit, dispatch }, filters) {
    commit("setFilters", filters);
    await dispatch("fetchList");
  },
  async applyAction({ dispatch, getters }, { form, actionId }) {
    await dispatch("saveForm", form);
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`am/main/v2/actionexec/${getters.cardId}/${actionId}`, {})
        .then((res) => {
          dispatch("fetchForm", getters.cardId);
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  async saveForm({ commit, getters }, form) {
    await this.$axios
      .post(`/api/card/${getters.page.idModule}/${getters.page.idItem}/${getters.cardId}`, form)
      .then(async (resp) => {
        commit("setCardId", resp.data.ID);
      });
  },
  async saveProfile({ commit, getters }, params) {
    if (params.context == "profile") {
      // Объединить в один метод после открытия карточки на новой странице!
      await this.$axios
        .post(`/api/card/${getters.page.idModule}/${getters.page.idItem}/125`, params.fields)
        .then(async (resp) => {
          commit("setCardId", resp.data.ID);
        });
    } else {
      // Объединить в один метод после открытия карточки на новой странице!
      await this.$axios
        .post(`/api/card/${getters.page.idModule}/${params.blockId}/${params.cardId}`, params.fields)
        .then(async (resp) => {
          commit("setCardId", resp.data.ID);
          commit("setFormChanged", false);
        });
    }
  },
  async fetchList({ commit }, params) {
    const urlJsonFilters = JSON.stringify(params.query);
    commit("setShowList", true);
    commit("setListLoading", true);
    if (params.idWizard) {
      await this.$axios.get(`/api/wizardlist/${params.idModule}/${params.idItem}/${params.idCard}`).then((res) => {
        commit("setListLoading", false);
        commit("setList", res.data);
      });
    } else {
      await this.$axios
        .get(`/api/list/${params.idModule}/${params.idItem}/${encodeURIComponent(urlJsonFilters)}`)
        .then((res) => {
          commit("setListLoading", false);
          commit("setList", res.data);
        });
    }
  },
  async deleteRecord(_, { moduleId, menuId, itemId, relId }) {
    return await this.$axios
      .delete(`/am/main/v2/datacard/${moduleId}/${menuId}/${itemId}${relId ? `?rel=${relId}` : ""}`)
      .then((res) => res.data);
  },
  async fetchSuggestions(_, params) {
    const type = params.suggestionType;
    const { key } = params;
    delete params.suggestionType;
    delete params.key;
    const response = await fetch(`/suggestions/api/4_1/rs/suggest/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${key}`,
      },
      body: JSON.stringify(params),
    });
    const result = await response.json();
    return result.suggestions;
    // return result.suggestions.map(item => item.value);
  },
  async editCard({ commit, getters }, params) {
    try {
      const { idItem } = params;
      delete params.idItem;
      const response = await this.$axios.put(`/am/main/v2/datacard/${getters.page.idModule}/${idItem}/0`, params);
      return response;
    } catch (e) {
      console.log(e);
    }
  },
};

export const mutations = {
  setPage(state, data) {
    state.page = data;
  },
  setList(state, data) {
    state.list = data;
  },
  setForm(state, data) {
    state.form = data;
  },
  setFilters(state, data) {
    state.filters = data;
  },
  setActions(state, data) {
    state.actions = data;
  },
  setShowList(state, data) {
    state.showList = data;
  },
  setShowForm(state, data) {
    state.showForm = data;
  },
  setShowWizard(state, data) {
    state.showWizard = data;
  },
  setShowFilter(state, data) {
    state.showFilter = data;
  },
  setShowActions(state, data) {
    state.showActions = data;
  },
  setEdit(state, data) {
    state.isEdit = data;
  },
  setAdd(state, data) {
    state.isAdd = data;
  },
  setDelete(state, data) {
    state.isDelete = data;
  },
  setFormLoading(state, data) {
    state.isFormLoading = data;
  },
  setListLoading(state, data) {
    state.isListLoading = data;
  },
  setComponentType(state, data) {
    state.componentType = data;
  },
  setCardId(state, data) {
    state.cardId = data;
  },
  setWizardData(state, data) {
    state.wizardData = data;
  },
  setWizardCaptions(state, data) {
    state.captions = data;
  },
  clearCaptions(state) {
    state.captions = null;
  },
  setCardForm(state, data) {
    state.cardForm = data;
  },
  setIsTab(state, data) {
    state.isTab = data;
  },
  setFormChanged(state, data) {
    state.isFormChanged = data;
  },
  clearCardForm(state) {
    state.cardForm = null;
  },
  setWizardField(state, data) {
    const item = state.wizardData.find((d) => d.fieldId === data.fieldId);
    if (item) {
      item.value = data.value;
    }
    state.isFormChanged = true;
  },
  clearWizardRelationField(state, data) {
    const item = state.wizardData.find((d) => d.fieldRelation === data.fieldName);
    if (item) {
      item.value = {};
    }
  },
  setMenuId(state, data) {
    state.menuId = data;
  },
  setItemId(state, data) {
    state.itemId = data;
  },
};
