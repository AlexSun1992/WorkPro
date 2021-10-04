import { indexOf } from "lodash";

/* eslint-disable */
export const state = () => ({
  blocks: [],
  form: [],
  isBlock: true,
  isForm: false,
  cardId: 0,
  blockId: null,
  // propertyNameHub: [],
  // allData: [],
  // choosenData: [],
});

export const getters = {
  getBlockById: (state) => (id) => {
    return state.blocks.find((b) => b.blockId === parseInt(id));
  },
  getAllBlocks: (state) => state.allData,
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

  setFilters(state, data) {
    console.log(state);

    data.type = !data.type;
    console.log(data);
  },

  // setPropertyName(state, param) {
  //   state.propertyNameHub.splice(0, state.propertyNameHub.length);
  //   state.propertyNameHub.unshift(param);
  // },

  // setFilters(state, parametr) {
  //   const property = state.propertyNameHub[0];

  //   state.blocks[0].data.items.forEach((item) => {
  //     if (state.allData.length < state.blocks[0].data.items.length) {
  //       state.allData.unshift(item);
  //     }
  //   });

  //   state.blocks[0].data.items = state.allData.filter((item) => {
  //     return item[property] === parametr.element;
  //   });

  // state.blocks[0].data.items.forEach((item) => {
  //   if (state.choosenData.includes(item)) {
  //     state.choosenData.forEach((item) => {
  //       console.log(item[property]);
  //       console.log(parametr.element);
  //       if ((item[property] = parametr.element)) {
  //         item[property] = "Удалено!!!";
  //       }
  //     });
  //     state.choosenData = state.choosenData.filter((unit) => {
  //       return unit[property] !== parametr.element;
  //     });
  //   }
  //   if (!state.choosenData.includes(item)) {
  //     state.choosenData.unshift(item);
  //   }
  // });

  // state.blocks[0].data.items = state.choosenData;
  // console.log(state.blocks[0].data.items);
  // },
};
