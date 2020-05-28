
export const state = () => ({
  pages: [],
  currentPage: null,
  mainMenu: null,
  mainMenuId: null,
  footerMenu: null,
  footerMenuId: null,
  config: null
})

export const getters = {
  getPageById: state => id => {
    return state.pages.find(page => page.id === id);
  },
  getPageByUrl: state => {
    return state.currentPage
  },
  getMenu: state => state.mainMenu,
  getFooterMenu: state => state.footerMenu,
  getMainMenuId: state => state.mainMenuId,
  getFooterMenuId: state => state.footerMenuId,
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

  async setMenuIDs({commit, state}) {
    let mainMenuId = state.currentPage.wpreso.inherited.main_menu_id;
    let footerMenuId = state.currentPage.wpreso.inherited.footer_menu_id;
    commit('setMenuIDs', {mainMenuId, footerMenuId});
  },

  // Объединить в один запрос после добавления в одну страницу WP (Алексей)
  async getMainMenu({commit}, params) {
    try {
      let component = await this.$axios.get(`/wp-json/wp/v2/wpreso_template_elem/${params}`);
      commit('setMainMenu', component.data.acf.wpreso_main_menu_items);
    } catch(e) {
      console.log(e);
    }
  },
  // Объединить в один запрос после добавления в одну страницу WP (Алексей)
  async getFooterMenu({commit}, params) {
    try {
      let component = await this.$axios.get(`/wp-json/wp/v2/wpreso_template_elem/${params}`);
      commit('setFooterMenu', component.data.acf.wpreso_footer_menu_items);
    } catch (e) {
      console.log(e);
    }
  },
  //
  async fetchPageByUrl({commit}, params) {
    try {
      if (params.slice(params.length-1) === '/') {
        params = params.substring(0, params.length-1);
      }
      await this.$axios.get(`/wp-json/wpreso/v1/pages-by-url?url=${params}`)
      .then(async (res) => {
        if (res.status === 200) {
          commit('setPage', res.data);
        }
      })
    } catch(e) {
      commit('setPage', e.response.data);
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
  // Объединить в одну мутацию после добавления в одну страницу WP (Алексей)
  setMainMenu(state, params) {
    state.mainMenu = params;
  },
  // Объединить в одну мутацию после добавления в одну страницу WP (Алексей)
  setFooterMenu(state, params) {
    state.footerMenu = params;
  },
  //
  setMenuIDs(state, params) {
    state.mainMenuId = params.mainMenuId;
    state.footerMenuId = params.footerMenuId;
  },
  setConfig(state, params) {
    state.config = params;
  }
}
