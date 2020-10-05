export const state = () => ({
  form : [],
  copyForm: [],
  cardId: null,
  captions: null,
  cardCaption: null,
  cardChanged: false,
  saveButtonClicked: false
})
export const getters = {
  getForm: state => state.form,
  cardChanged: state => state.cardChanged,
  saveButtonClicked: state => state.saveButtonClicked,
  cardCaption: state => state.cardCaption,
  getCopyForm: state => state.copyForm,
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
        commit('setForm', res.data.metaData.data.length ? res.data.metaData.data : res.data);
        commit('setCopyForm', JSON.parse(JSON.stringify(res.data.metaData.data)));
        if (res.data.metaData.captions) {
          commit('setCaptions', res.data.metaData.captions);
        }
        commit('setCardCaption', res.data.metaData.cardCaption);
      })
  },
  async saveDataCard ({commit}, params) {
      await this.$axios.post(`/api/card/${params.moduleId}/${params.itemId}/${params.cardId}`, params.form)
      .then(async resp => {
        commit('setCardId', resp.data.ID)
      })
  },

}
export const mutations = {
  cardChanged(state, data) {
    state.cardChanged = data
  },
  saveButtonClicked(state, data) {
    state.saveButtonClicked = data
  },
  setForm(state, data) {
    state.form = data
  },
  setCopyForm(state, data) {
    state.copyForm = data
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
  setCardCaption(state, data) {
    state.cardCaption = data
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
