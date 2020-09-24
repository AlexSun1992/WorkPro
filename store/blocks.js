export const state = () => ({
  blocks: [],
  form: [],
  isBlock: true,
  isForm: false,
  cardId: 0,
  blockId: null
})

export const getters = {
  getBlockById: state => id => {
    return state.blocks.find(b => b.blockId === parseInt(id));
  },
  getForm: state => state.form,
  cardId: state => state.cardId,
  moduleId: state => state.moduleId,
  menuId: state => state.menuId,
  blockId: state => state.blockId,
}

export const actions = {
  async fetchForm ({commit, dispatch}, {moduleId, menuId, itemId}) {
    await this.$axios.get(`/api/card/${moduleId}/${menuId}/${itemId}`)
      .then((res) => {
        commit('setCardId', itemId);
        commit('setBlockId', menuId);
        commit('setForm', res.data.metaData.data);
      })
  },
  async deleteForm ({commit, dispatch}, {moduleId, menuId, itemId}) {
    await this.$axios.delete(`/am/main/v2/datacard/${moduleId}/${menuId}/${itemId}`)
      .then((res) => {
        dispatch('updateBlock', menuId);
      })
  },
  async saveForm ({commit, dispatch, state}, {moduleId,form}) {
    await this.$axios.post(`/api/card/${moduleId}/${state.blockId}/${state.cardId}`, form)
      .then(async res => {
        commit('setCardId', res.data.ID);
        dispatch('updateBlock', state.blockId)
      })
  },
  async fetchBlock ({commit, dispatch}, id) {
    await this.$axios.get(`/api/list/55/${id}/{}`)
      .then((res) => {
        commit('addBlock', {blockId : parseInt(id), data : res.data });
      })
  },
  async updateBlock ({commit, dispatch}, id) {
    await this.$axios.get(`/api/list/55/${id}/{}`)
      .then((res) => {
        commit('updateBlock', {blockId : parseInt(id), data : res.data });
      })
  },
  async destroyForm ({commit}) {
    commit('setForm', []);
  },
  async clearBlock ({commit}) {
    commit('setForm', []);
    commit('clearBlock');
  },
  async executeAction ({commit, dispatch, getters}, {rowId, itemId, actionId, body}) {
    await this.$axios.post(`/am/main/v2/actionexec/${rowId}/${actionId}`, body ? body : {})
      .then(async resp => {
        if (body) return;
        dispatch('updateBlock', itemId);
      })
  },
}

export const mutations = {
  setForm(state, data) {
    state.form = data
  },
  addBlock(state, block) {
    state.blocks.push(block)
  },
  updateBlock(state, block) {
    const bs = state.blocks.find(b => b.blockId === block.blockId);
    bs.data = block.data
  },
  clearBlock(state) {
    state.blocks = []
  },
  setCardId(state, data) {
    state.cardId = data
  },
  setBlockId(state, data) {
    state.blockId = data
  },
}

