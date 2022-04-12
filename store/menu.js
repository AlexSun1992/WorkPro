/* eslint-disable */
import breadcrumbs from "../converters/breadcrumbs";
const BFF_URL_GET_MENU = "/api/module";
const BFF_URL_GET_FREE_MENU = "/api/module?zone=free";
const URL_GET_FREE_MENU = "/api/module?zone=free";
export const state = () => ({
  menu: [],
  flatmenu: [],
  breadcrumbs: [],
});

export const getters = {
  breadcrumbs: (state) => state.breadcrumbs,
  menu: (state) => state.menu,
  flatmenu: (state) => state.flatmenu,
  getSettingsByIdItem: (state) => (id) => {
    return state.menu[0].children.find((m) => console.log(m));
  },
  getMenuById: (state) => (id) => {
    return state.flatmenu.find((m) => m.IDITEM === parseInt(id));
  },
  getMenuByName: (state) => (name) => {
    return state.flatmenu.find((m) => m.SCARDCAPTION === name);
  },
  getMenuWithOutIcon: (state) => {
    return state.menu[0].children.filter(
      (m) =>
        m.iconFileName !== undefined && m.iconFileName !== "" && m.isVisible
    );
  },
};

export const actions = {
  async fetchMenu({ commit, dispatch }, params) {
    const URL =
      params.zone === "free"
        ? `/api/menu/55/${params.idItem}?zone=free`
        : "/api/menu/55/null";
    if (params.zone !== "free") {
      await this.$axios.get("/api/module").then((res) => {
        commit("setMenu", res.data);
        commit("setBreadcrumbs", breadcrumbs.getData(res.data, params));
      });
    }
    await this.$axios.get(URL).then((res) => {
      commit("setFlatMenu", res.data[0]._data);
    });
  },
};

export const mutations = {
  setMenu(state, data) {
    state.menu = data;
  },
  setQueriesUrlByIdMenu(state, { idItem, url }) {
    const itemsMenu = state.menu[0]?.children;
    if (Array.isArray(itemsMenu)) {
      const menu = itemsMenu.find((i) => i.idItem === parseInt(idItem));
      if (menu) {
        menu.url = url;
      }
    }
  },
  setFlatMenu(state, data) {
    state.flatmenu = data;
  },
  setBreadcrumbs(state, data) {
    state.breadcrumbs = data;
  },
};
