
export const state = () => ({
  pages: [],
  currentPage: null,
  menu: null,
  menuId: null,
  config: null
})

export const getters = {
  getPageById: state => id => {
    return state.pages.find(page => page.id === id);
  },
  getPageByUrl: state => {
    return state.currentPage
  },
  getMenu: state => state.menu,
  getMenuId: state => state.menuId,
  getConfig: state => state.config
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
    let mainPage;
    mainPage = state.config.wpreso_settings_index_page.value;
    response = await this.$axios.get(`/wp-json/wp/v2/pages?slug=${mainPage}`)
    menuId = state.currentPage.wpreso.inherited.main_menu_id;
    commit('setMenuId', menuId);
  },

  async getComponent({commit}, params) {
    let component = await this.$axios.get(`/wp-json/wp/v2/wpreso_template_elem/${params}`);
    commit('setMenu', component.data.acf.wp_reso_main_menu_items);
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
  },

  async setConfig({commit}) {
    let { data } = await this.$axios.get(`/wp-json/wpreso/v1/options`);
    commit('setConfig', data);
  },
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
  },
  setConfig(state, params) {
    state.config = params;
  }
}
