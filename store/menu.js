import breadcrumbs from '~/converters/breadcrumbs'
export const state = () => ({
  menu: [],
  flatmenu: [],
  breadcrumbs: []
})

export const getters = {
  breadcrumbs: state => state.breadcrumbs,
  menu: state => state.menu,
  flatmenu: state => state.flatmenu,
  getMenuById: state => id => {
    return state.flatmenu.find(m => m.IDITEM === parseInt(id));
  },
  getMenuWithOutIcon: state => {
    return state.menu[0].children.filter(m => m.iconFileName !== undefined && m.iconFileName !== '');
  },
}

export const actions = {
  async fetchMenu ({commit, dispatch}, params) {
    await this.$axios.get(`/api/module`)
      .then((res) => {
        commit('setMenu', res.data);
        commit('setBreadcrumbs', breadcrumbs.getData(res.data, params))
      })
    await this.$axios.get(`am/main/v2/clientmenu/55`)
      .then((res) => {
        commit('setFlatMenu', res.data[0]._data);
      })
  },
}

export const mutations = {
  setMenu(state, data) {
    state.menu = data
  },
  setFlatMenu(state, data) {
    state.flatmenu = data
  },
  setBreadcrumbs(state, data) {
    state.breadcrumbs = data
  }
}
