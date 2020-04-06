
export const state = () => ({
  pages: [],
  currentPage: null,
  url: '',
  menu: null
})

export const getters = {
  getPageById: state => id => {
    return state.pages.find(page => page.id === id);
  },
  getPageByUrl: state => state.currentPage,
  getMenu: state => state.menu,
  url: state => state.url
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

  setUrl({commit}, params) {
    commit('setUrl', params)
  },

  async fetchPageByUrl({commit, dispatch}, params) {
    try {
      if (params.slice(params.length-1) === '/') {
        params = params.substring(0, params.length-1);
      } 
      params = params.split('/').pop();
      // Вынести в отдельный action
      await this.$axios.get(`/wp-json/wp/v2/pages?slug=${params}`)
      .then(async (res) => {
        if (res.status === 200) {
          commit('setPage', res.data[0]);
          let menuId;
          let response;
          if (res.data[0].acf.main_menu.custom) {
            menuId = res.data[0].acf.main_menu.component_id
          } else if(!res.data[0].acf.main_menu.custom && res.data[0].parent != 0) {
            //Для показа! (переделать на рекурсию)
            response = dispatch('get', res.data[0].parent)
            // response = await this.$axios.get(`/wp-json/wp/v2/pages/${res.data[0].parent}`);
            if (response.data[0].acf.main_menu.custom) {
              menuId = res.data[0].acf.main_menu.component_id
            }
          } else if (res.data[0].parent === 0){
            // Вынести в отдельный action
            response = await this.$axios.get(`/wp-json/wp/v2/pages?slug=index`)
            menuId = response.data[0].acf.main_menu.component_id
          }
          // Вынести в отдельный action
          let component = await this.$axios.get(`/wp-json/wp/v2/component/${menuId}`);
          commit('setMenu', component.data.acf.list);
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
  setUrl(state, params) {
    state.url = params;
  },
}
