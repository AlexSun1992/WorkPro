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
    return state.menu[0].children.find((m) => m.idItem === parseInt(id));
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
      params?.zone === "free"
        ? `/api/menu/55/${params.idItem}?zone=free`
        : "/api/menu/55/null";
    if (params?.zone !== "free") {
      await this.$axios.get("/api/module").then((res) => {
        commit("setMenu", res.data);
        if (params) {
          commit("setBreadcrumbs", breadcrumbs.getData(res.data, params));
        }
      });
    }
    await this.$axios.get(URL).then((res) => {
      commit("setFlatMenu", res.data[0]._data);
    });
  },
  async fetchMenuById({ commit, dispatch }, params) {
    const URL =
      params?.zone === "free"
        ? `/api/menu/55/${params.idItem}?zone=free`
        : "/api/menu/55/null";
    if (params?.zone !== "free") {
      await this.$axios.get(`/api/module/55/${params.idItem}`).then((res) => {
        commit("setMenuById", res.data);
      });
      if (params.idWizard) {
        await this.$axios
          .get(`/api/module/55/${params.idWizard}`)
          .then((res) => {
            commit("setMenuById", res.data);
          });
      }
    }
  },
  async fetchCounters({ commit, state }, params) {
    await this.$axios.get("/am/main/v2/data/55/802").then((res) => {
      const menuItems = state.menu[0].children;
      const counters = res.data[0]._data;
      menuItems.forEach((item) => {
        const counter = counters.find((c) => c.IDITEM === item.idItem);
        if (counter) {
          if (
            ["RED", "GREEN"].includes(counter.SCOLOR) &&
            counter.NCOUNT !== null
          ) {
            commit("setCounter", counter);
          } else {
            console.warn(
              `Неверно заданы параметры счетчика для пункта меню ${item.idItem}`
            );
          }
        } else {
          commit("setCounter", { IDITEM: item.idItem });
        }
      });
    });
  },
};

export const mutations = {
  setMenu(state, data) {
    state.menu = data;
  },
  setMenuById(state, data) {
    const itemsMenu = state.menu[0]?.children;
    const itemsFlatMenu = state.flatmenu;
    const { settings, subSettings } = data;
    if (itemsMenu && itemsFlatMenu) {
      const itemMenu = itemsMenu.find((i) => i.idItem === subSettings.idItem);
      const itemFlatMenu = itemsFlatMenu.find(
        (i) => i.IDITEM === settings.IDITEM
      );
      if (itemMenu) {
        Object.entries(subSettings).forEach(([key, value]) => {
          itemMenu[key] = value;
        });
      } else {
        itemsMenu.push(subSettings);
      }
      if (itemFlatMenu) {
        Object.entries(settings).forEach(([key, value]) => {
          itemFlatMenu[key] = value;
        });
      } else {
        itemsFlatMenu.push(settings);
      }
    }
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
  setCounter(state, data) {
    const menuItems = state.menu[0].children;
    const item = menuItems.find((i) => i.idItem === data.IDITEM);
    item.newCount = data?.NCOUNT ? data.NCOUNT : null;
    item.newCountColor = data?.SCOLOR ? data.SCOLOR : null;
  },
};
