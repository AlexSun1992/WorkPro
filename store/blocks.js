/* eslint-disable */
export const state = () => ({
  blocks: [],
  form: [],
  isBlock: true,
  isForm: false,
  cardId: 0,
  blockId: null,
  filters: [],
});

export const getters = {
  getUnfilteredBlockById: (state) => (id) => {
    return state.blocks.find((b) => b.blockId === parseInt(id));
  },
  getBlockById: (state) => (id) => {
    const currentBlock = state.blocks.find((b) => b.blockId === parseInt(id));
    if (currentBlock) {
      return {
        ...currentBlock,
        data: {
          ...currentBlock.data,
          items: currentBlock.data.items.filter((item) => {
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
          }),
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
    if (!params.zone) {
      url = `/api/list/55/${params.id}/{}`;
    } else {
      url = `/api/list/55/${params.id}/{}?zone=free`;
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
        if (body) return;
        dispatch("updateBlock", itemId);
      });
  },
};

export const mutations = {
  setForm(state, data) {
    state.form = data;
  },
  addBlock(state, block) {
    state.blocks.push(block);
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

  clearFilter: (state, data) => {
    const { propertyName } = data;
    const { filterType } = data;

    const currentFilter = state.filters.find(
      (filter) => filter.propertyName === propertyName
    );

    const query = new URLSearchParams(window.location.search);
    query.delete(propertyName);
    window.history.replaceState(null, "", `?${query.toString()}`);

    state.filters = [];

    if (currentFilter) {
      currentFilter.filter = [];
    }
    return;
  },

  setFilter: (state, data) => {
    state.filters.push(data);
  },

  toggleFilter: (state, data) => {
    const { propertyName, filterItem, filterType } = data;
    if (!state.filters.find((filter) => filter.propertyName === propertyName)) {
      state.filters.push({
        propertyName,
        filter: [],
        className: "filter-checked",
      });
    }

    const currentFilter = state.filters.find(
      (filter) => filter.propertyName === propertyName
    );

    if (filterType === "radiobutton") {
      currentFilter.filter = [filterItem];

      const query = new URLSearchParams();
      state.filters.forEach((filter) => {
        if (filter.filter.length > 0) {
          if (Array.isArray(filter.filter)) {
            query.append(filter.propertyName, filter.filter.join(","));
          }
        }
      });
      window.history.replaceState(null, "", `?${query.toString()}`);
      return;
    }
    if (currentFilter.filter.includes(filterItem)) {
      currentFilter.filter = currentFilter.filter.filter(
        (item) => item !== filterItem
      );
    } else {
      currentFilter.filter.push(filterItem);
    }

    const query = new URLSearchParams();

    state.filters.forEach((filter) => {
      if (filter.filter.length > 0) {
        if (Array.isArray(filter.filter)) {
          query.append(filter.propertyName, filter.filter.join(","));
        }
      }
    });
    window.history.replaceState(null, "", `?${query.toString()}`);
  },
};
