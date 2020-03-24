export const state = () => ({
  breadcrumbs: []
})

export const getters = {
  breadcrumbs: state => state.breadcrumbs
}

export const mutations = {
  setBreadcrumbs(state, data) {
    state.breadcrumbs = data
  }
}
