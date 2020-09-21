export const state = () => ({
  form : []
})
export const getters = {
  getForm: state => state.form,
  getDataFieldByName: state => name => {
    return state.form.find(b => b.name === name);
  },
  getDataFieldByFieldId: state => id => {
    return state.form.find(b => b.fieldId === id);
  },
}
export const actions = {
  async fetchForm ({commit, getters}, params) {
    await  this.$axios.get(`/api/card/${params.idModule}/${params.idItem}/${params.idCard}`)
      .then((res) => {
        commit('setForm', res.data.data);
      })
  }
}
export const mutations = {
  setForm(state, data) {
    state.form = data
  },
  setFormField(state, data) {
    let item = state.wizardData.find(d => d.fieldId === data.fieldId)
    if (item) {
      item.value = data.value
    }
  },
  clearFormRelationField(state, data) {
    const item = state.wizardData.find(d => d.fieldRelation === data.fieldName)
    if(item){
      item.value = {}
    }
  }
}
