export const state = () => ({
  blocks: [],
  form: [],
  isBlock: true,
  isForm: false,
  cardId: 0,
  blockId: null,
  filters: [],
  serverFilters: [],
  searchParams: null,
  PoutValue: "",
});

export const getters = {
  getServerFilters: (state) => state.serverFilters,

  getUnfilteredBlockById: (state) => (id) => {
    return state.blocks.find((b) => b.blockId === parseInt(id));
  },
  getBlockById: (state) => (id) => {
    const currentBlock = state.blocks.find((b) => b.blockId == parseInt(id));
    if (currentBlock) {
      const currentBlock = state.blocks.find((b) => b.blockId == parseInt(id));

      const items = currentBlock.data.items
        .filter((item) => {
          let isItemShow = true;
          state.filters.forEach((filter) => {
            if (!isItemShow) {
              return;
            }
            const value = item[filter.propertyName];

            if (filter.filter.length === 0) {
              return;
            }
            isItemShow = filter.filter.includes(value);
          });
          return isItemShow;
        })
        .filter((item) => {
          if (
            state.searchParams &&
            state.searchParams.id == currentBlock.blockId
          ) {
            return state.searchParams.searchProperty.some((param) => {
              return String(item[param])
                .toLowerCase()
                .includes(state.searchParams.searchString.toLowerCase());
            });
          }
          return true;
        });

      return {
        ...currentBlock,
        data: {
          ...currentBlock.data,
          items,
        },
      };
    }
  },
  getFilters: (state) => state.filters,
  getForm: (state) => state.form,
  cardId: (state) => state.cardId,
  moduleId: (state) => state.moduleId,
  menuId: (state) => state.menuId,
  blockId: (state) => state.blockId,
  getUrl: (state) => state.PoutValue,
};

export const actions = {
  async fetchForm({ commit, dispatch }, { moduleId, menuId, itemId }) {
    await this.$axios
      .get(`/api/card/${moduleId}/${menuId}/${itemId}`)
      .then((res) => {
        commit("setCardId", itemId);
        commit("setBlockId", menuId);
        commit("setForm", res.data.metaData.data);
      });
  },
  async deleteForm({ commit, dispatch }, { moduleId, menuId, itemId, relId }) {
    await this.$axios
      .delete(
        `/am/main/v2/datacard/${moduleId}/${menuId}/${itemId}${
          relId ? `?rel=${relId}` : ""
        }`
      )
      .then((res) => {
        dispatch("updateBlock", menuId);
      });
  },
  async deleteWizardForm(
    { commit, dispatch },
    { moduleId, menuId, itemId, cardId, relId }
  ) {
    await this.$axios
      .delete(
        `/am/main/v2/datacard/${moduleId}/${menuId}/${itemId}${
          relId ? `?rel=${relId}` : ""
        }`
      )
      .then((res) => {
        dispatch("updateWizardBlock", { menuId, cardId });
      });
  },
  async saveForm({ commit, dispatch, state }, { moduleId, form }) {
    await this.$axios
      .post(`/api/card/${moduleId}/${state.blockId}/${state.cardId}`, form)
      .then(async (res) => {
        commit("setCardId", res.data.ID);
        dispatch("updateBlock", state.blockId);
      });
  },
  async fetchBlock({ commit, dispatch }, params) {
    let url;
    const urlJsonFilters = JSON.stringify(params.query);
    if (!params.zone) {
      url = `/api/list/55/${params.id}/${encodeURIComponent(urlJsonFilters)}`;
    } else {
      url = `/api/list/55/${params.id}/${encodeURIComponent(
        urlJsonFilters
      )}?zone=free`;
    }
    await this.$axios.get(url).then((res) => {
      commit("addBlock", { blockId: parseInt(params.id), data: res.data });
    });
  },
  async fetchWizardBlock({ commit, dispatch }, { itemId, cardId }) {
    await this.$axios
      .get(`/api/wizardlist/55/${itemId}/${cardId}`)
      .then((res) => {
        commit("addBlock", { blockId: parseInt(itemId), data: res.data });
      });
  },
  async updateWizardBlock({ commit, dispatch }, { menuId, cardId }) {
    await this.$axios
      .get(`/api/wizardlist/55/${menuId}/${cardId}`)
      .then((res) => {
        commit("updateBlock", { blockId: parseInt(menuId), data: res.data });
      });
  },
  async updateBlock({ commit, dispatch }, id) {
    await this.$axios.get(`/api/list/55/${id}/{}`).then((res) => {
      commit("updateBlock", { blockId: parseInt(id), data: res.data });
    });
  },
  async destroyForm({ commit }) {
    commit("setForm", []);
  },
  async clearBlock({ commit }) {
    commit("setForm", []);
    commit("clearBlock");
  },
  async executeAction(
    { commit, dispatch, getters },
    { relId, relActionId, rowId, itemId, actionId, body }
  ) {
    await this.$axios
      .post(
        `/api/card/actionexec/${rowId}/${actionId}/${relId}/${relActionId}`,
        body || {}
      )
      .then(async (resp) => {
        commit("setPoutValue", resp.data.POUTVALUE);
        dispatch("updateBlock", itemId);
      });
  },
};

export const mutations = {
  setPoutValue(state, address) {
    state.PoutValue = address;
  },

  setForm(state, data) {
    state.form = data;
  },
  addBlock(state, block) {
    const bs = state.blocks.find((b) => b.blockId === block.blockId);
    if (bs) {
      bs.data = block.data;
    } else {
      state.blocks.push(block);
    }
  },
  updateBlock(state, block) {
    const bs = state.blocks.find((b) => b.blockId === block.blockId);
    bs.data = block.data;
  },
  clearBlock(state) {
    state.blocks = [];
  },
  setCardId(state, data) {
    state.cardId = data;
  },
  setBlockId(state, data) {
    state.blockId = data;
  },

  clearFilter: (state, { propertyName }) => {
    state.filters = state.filters.filter(
      (item) => item.propertyName !== propertyName
    );
    return;
  },

  setFilter: (state, data) => {
    if (Array.isArray(data) === true) {
      state.filters = data;
    } else {
      state.filters.push(data);
    }
  },

  setServerFilters: (state, data) => {
    state.serverFilters.push(data);
    console.log("setServerFilters", state.serverFilters);
  },

  updateServerFilters: (state, data) => {
    state.serverFilters.forEach((item) => {
      if (item.propertyName === data.id) {
        item.filter = data.filterIdNumber.toString();
      }
    });

    let filter = state.serverFilters.find(
      (item) => item.propertyName == data.propertyName
    );

    filter.filter = data.filter;
  },

  replaceFilter: (state, { propertyName, filter, id }) => {
    const currentFilter = state.filters.find((item) => {
      return item.propertyName === propertyName && item.id === id;
    });
    if (currentFilter) {
      currentFilter.filter = filter;
    } else {
      state.filters.push({
        propertyName,
        filter,
        id,
      });
    }
  },

  toggleFilter: (state, { propertyName, filterItem, filterType, id }) => {
    let currentFilter = state.filters.find((filter) => {
      return filter.propertyName === propertyName;
    });
    if (currentFilter === undefined) {
      currentFilter = {
        propertyName,
        filter: [],
        id: id,
      };
      state.filters.push(currentFilter);
    }
    if (filterType === "radiobutton" || filterType === "combobox") {
      currentFilter.filter = [filterItem];
      return;
    }
    if (currentFilter.filter.includes(filterItem)) {
      currentFilter.filter = currentFilter.filter.filter(
        (item) => item !== filterItem
      );
    } else {
      currentFilter.filter.push(filterItem);
    }
  },
  setSearchParams(state, data) {
    state.searchParams = data;
  },
};
