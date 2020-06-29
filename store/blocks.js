export const state = () => ({
  blocks: []
})

export const getters = {
  getBlockById: state => id => {
    return state.blocks.find(b => b.blockId === parseInt(id));
  },
}

export const actions = {
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
  async clearBlock ({commit}) {
    commit('clearBlock');
  },
  async executeAction ({commit, dispatch, getters}, {rowId, itemId, actionId}) {
    await this.$axios.post(`/am/main/v2/actionexec/${rowId}/${actionId}`, {})
      .then(async resp => {
        dispatch('updateBlock', itemId)
      })
  },
}

export const mutations = {
  addBlock(state, block) {
    state.blocks.push(block)
  },
  updateBlock(state, block) {
    const bs = state.blocks.find(b => b.blockId === block.blockId);
    bs.data = block.data
  },
  clearBlock(state) {
    state.blocks = []
  }
}

