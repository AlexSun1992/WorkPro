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
  // getBlockById: (state) => (id) => {
  //   console.log(state.filters);
  //   return state.blocks.find((b) => b.blockId === parseInt(id));
  // },

  getBlockById: (state) => (id) => {
    if (state.filters.length !== 0) {
      // return state.blocks
      //   .find((b) => b.blockId === parseInt(id))
      //   .data.items.filter((item) => {
      //     return item.SPRODUCTNAME === state.filters[0];
      //   });
      console.log(state.blocks);
      return state.blocks.find((b) => b.blockId === parseInt(id));
    } else {
      return state.blocks.find((b) => b.blockId === parseInt(id));
    }
  },

  getAttempt: (state) => (item) => {
    return state.blocks[0].data.items.filter(
      (elem) => elem.SPRODUCTNAME === item
    );
  },
  getFilter: (state) => state.filters,
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
  setFilters(state, parametr) {
    state.filters.unshift(parametr);
  },
};
