import breadcrumbs from '~/converters/breadcrumbs'
export const state = () => ({
  menu: [],
  breadcrumbs: []
})

export const getters = {
  breadcrumbs: state => state.breadcrumbs,
  menu: state => state.menu
}

export const actions = {
  async fetchMenu ({commit, dispatch}, params) {
    await this.$axios.get(`/api/module`)
      .then((res) => {
        commit('setMenu', res.data);
        commit('setBreadcrumbs', breadcrumbs.getData(res.data, params))
      })
  },
}

export const mutations = {
  setMenu(state, data) {
    state.menu = data
  },
  setBreadcrumbs(state, data) {
    state.breadcrumbs = data
  }
}
