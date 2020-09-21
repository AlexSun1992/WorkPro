export const state = () => ({
  form : [],
  captions: null
})
export const getters = {
  getForm: state => state.form,
  getCaptions: state => state.captions,
  getDataFieldByName: state => name => {
    debugger
    return state.form.find(b => b.name === name);
  },
  getDataFieldByFieldId: state => id => {
    debugger
    return state.form.find(b => b.fieldId === id);
  },
}
export const actions = {
  async fetchForm ({commit, getters}, params) {
    commit('clearFormData')
    await  this.$axios.get(`/api/card/${params.idModule}/${params.idItem}/${params.idCard}`)
      .then((res) => {
        debugger
        commit('setForm', res.data.metaData.data);
        debugger
        if (res.data.metaData.captions) {
          commit('setCaptions', res.data.metaData.captions);
        }
      })
  }
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
    let item = state.wizardData.find(d => d.fieldId === data.fieldId)
    if (item) {
      item.value = data.value
    }
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
