import Vue from 'vue'
export const state = () => ({
  pages: [],
  currentPage: null,
  mainMenu: null,
  mainMenuId: null,
  footerMenu: null,
  footerMenuId: null,
  breadcrumbs: null,
  isShowBreadcrumbs: false,
  config: null
})

export const getters = {
  getPageById: state => id => {
    return state.pages.find(page => page.id === id)
  },
  getPageByUrl: state => {
    return state.currentPage
  },
  getMenu: state => state.mainMenu,
  getFooterMenu: state => state.footerMenu,
  getMainMenuId: state => state.mainMenuId,
  getFooterMenuId: state => state.footerMenuId,
  getBreadCrumbs: state => state.breadcrumbs,
  getShowBreadCrumbs: state => state.isShowBreadcrumbs,
  getConfig: state => state.config
}

export const actions = {
  async setMenuIDs ({ commit, state }) {
    const mainMenuId = state.currentPage.wpreso.properties.main_menu_id
    const footerMenuId = state.currentPage.wpreso.properties.footer_menu_id
    commit('setMenuIDs', { mainMenuId, footerMenuId })
  },

  // Объединить в один запрос после добавления в одну страницу WP (Алексей)
  async getMainMenu ({ commit }, params) {
    try {
      const component = await this.$axios.get(`/wp-json/wp/v2/wpreso_template_elem/${params}`)
      commit('setMainMenu', component.data.acf.wpreso_main_menu_items)
    } catch (e) {
      console.log(e)
    }
  },
  // Объединить в один запрос после добавления в одну страницу WP (Алексей)
  async getFooterMenu ({ commit }, params) {
    try {
      const component = await this.$axios.get(`/wp-json/wp/v2/wpreso_template_elem/${params}`)
      commit('setFooterMenu', component.data.acf.wpreso_footer_menu_items)
    } catch (e) {
      console.log(e)
    }
  },
  //
  async fetchPageByUrl ({ commit }, params) {
    try {
      if (params.slice(params.length - 1) === '/') {
        params = params.substring(0, params.length - 1)
      }
      await this.$axios.get(`/wp-json/wpreso/v1/pages-by-url?url=${params}`)
        .then(async (res) => {
          if (res.status === 200) {
            commit('setPage', res.data)
            commit('setBreadCrumbs', res.data.wpreso.autobreadcrumbs)
            commit('setShowBreadCrumbs', !res.data.wpreso.properties.skip_breadcrumbs)
          }
        })
    } catch (e) {
      commit('setPage', e.response.data)
      commit('setBreadCrumbs', null)
    }
  },

  async setConfig ({ commit }) {
    const { data } = await this.$axios.get('/wp-json/wpreso/v1/options')
    commit('setConfig', data)
  }
}

export const mutations = {
  addPage (state, page) {
    state.pages.push(page)
  },
  setPage (state, params) {
    state.currentPage = params
  },
  // Объединить в одну мутацию после добавления в одну страницу WP (Алексей)
  setMainMenu (state, params) {
    state.mainMenu = params
  },
  // Объединить в одну мутацию после добавления в одну страницу WP (Алексей)
  setFooterMenu (state, params) {
    state.footerMenu = params
  },
  //
  setMenuIDs (state, params) {
    state.mainMenuId = params.mainMenuId
    state.footerMenuId = params.footerMenuId
  },
  setConfig (state, params) {
    state.config = params
  },
  setBreadCrumbs (state, params) {
    state.breadcrumbs = params
  },
  setShowBreadCrumbs (state, params) {
    state.isShowBreadcrumbs = params
  },
  changeFooterActiveSection (state, title) {
    const section = state.footerMenu.find(b => b.title === title)
    Vue.set(section, 'isActive', section.isActive === undefined ? true : !section.isActive)
  }
}
