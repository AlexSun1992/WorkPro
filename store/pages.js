
export const state = () => ({
  pages: [],
  currentPage: null,
  menu: null,
  menuId: null
})

export const getters = {
  getPageById: state => id => {
    return state.pages.find(page => page.id === id);
  },
  getPageByUrl: state => {
    return state.currentPage
  },
  getMenu: state => state.menu,
  getMenuId: state => state.menuId
}

export const actions = {
  async get({commit}, params) {
    await this.$axios.get(`/wp-json/acf/v3/pages/${params}`)
    .then((res) => {
      if (res.status === 200) {
        commit('addPage', {id: params, data: res.data})
      }
    })
  },

  async setMenuId({commit, state}) {
    let menuId;
    let response;
    if (state.currentPage.acf.main_menu.custom) {
      menuId = state.currentPage.acf.main_menu.component_id;
    } else {
      response = await this.$axios.get(`/wp-json/wp/v2/pages?slug=index`)
      menuId = state.currentPage.acf.main_menu.component_id
    }
    commit('setMenuId', menuId);
  },

  async getComponent({commit}, params) {
    let component = await this.$axios.get(`/wp-json/wp/v2/component/${params}`);
    commit('setMenu', component.data.acf.list);
  },

  async fetchPageByUrl({commit}, params) {
    try {
      if (params.slice(params.length-1) === '/') {
        params = params.substring(0, params.length-1);
      } 
      params = params.split('/').pop();
      await this.$axios.get(`/wp-json/wp/v2/pages?slug=${params}`)
      .then(async (res) => {
        if (res.status === 200) {
          commit('setPage', res.data[0]);
        }
      })
    } catch(e) {
      console.log(e);
    }
  }
}

export const mutations = {
  addPage(state, page) {
    state.pages.push(page)
  },
  setPage(state, params) {
    state.currentPage = params;
  },
  setMenu(state, params) {
    state.menu = params;
  },
  setMenuId(state, params) {
    state.menuId = params;
  }
}
