export const state = () => ({
  pages: []
})

export const getters = {
  getPageById: state => id => {
    return state.pages.find(page => page.id === id);
  }
}

export const actions = {
  async get({commit}, params) {
    await this.$axios.get(`/wp-json/acf/v3/main/${params}`)
      .then((res) => {
        if (res.status === 200) {
          commit('addPage', {id: params, data: res.data})
        }
      })
  }
}

export const mutations = {
  addPage(state, page) {
    state.pages.push(page)
  }
}
