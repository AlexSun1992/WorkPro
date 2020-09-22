export const state = () => ({
  form : [],
  cardId: null,
  captions: null
})
export const getters = {
  getForm: state => state.form,
  getCardId: state => state.cardId,
  getCaptions: state => state.captions,
  getDataFieldByName: state => name => {
    return state.form.find(b => b.name === name);
  },
  getDataFieldByFieldId: state => id => {
    return state.form.find(b => b.fieldId === id);
  },
}
export const actions = {
  async fetchForm ({commit, getters}, params) {
    commit('setCardId', params.idCard)
    commit('clearFormData')
    await  this.$axios.get(`/api/card/${params.idModule}/${params.idItem}/${params.idCard}`)
      .then((res) => {
        commit('setForm', res.data.metaData.data);
        if (res.data.metaData.captions) {
          commit('setCaptions', res.data.metaData.captions);
        }
      })
  },
  async saveDataCard ({commit, getters}, params) {
      await this.$axios.post(`/api/card/${params.moduleId}/${params.itemId}/${getters.getCardId}`, params.form)
      .then(async resp => {
        commit('setCardId', resp.data.ID)
      })
  },

}
export const mutations = {
  setForm(state, data) {
    state.form = data
  },
  setCaptions(state, data) {
    let captions = data.split(';')
    captions.pop();
    state.captions = captions
  },
  setFormField(state, data) {
    let item = state.form.find(d => d.fieldId === data.fieldId)
    if (item) {
      item.value = data.value
    }
  },
  setCardId(state, data) {
    state.cardId = data
  },
  clearFormData(state) {
    state.captions = null
    state.form = []
  },
  clearFormRelationField(state, data) {
    const item = state.form.find(d => d.fieldRelation === data.fieldName)
    if(item){
      item.value = {}
    }
  }
}
