/* eslint-disable */
import breadcrumbs from "../converters/breadcrumbs";
const BFF_URL_GET_MENU = "/api/module";
const BFF_URL_GET_FREE_MENU = "/api/module?zone=free";
const URL_GET_FREE_MENU = "/api/module?zone=free";
const DEFAULT_BREADCRUMBS = [
  {
    text: "Главная",
    href: "/",
  },
  {
    text: "Личный кабинет",
    to: "/cabinet/55/0/701",
  },
];
export const state = () => ({
  menu: [{ children: [] }],
  flatmenu: [],
  breadcrumbs: [],
  breadCrumbs: [],
  counters: [],
});

export const getters = {
  counters: (state) => state.counters,
  breadcrumbs: (state) => state.breadcrumbs,
  breadCrumbs: (state) => state.breadCrumbs,
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
  getVisibleShowMenu: (state) => {
    return state.menu[0].children.filter((m) => m.isVisible == true);
  },
};

export const actions = {
  async fetchMenu({ commit, dispatch, state }, params) {
    try {
      const URL =
        params?.zone === "free"
          ? `/api/menu/55/${params.idItem}?zone=free`
          : "/api/menu/55/null";
      let module = null;
      if (params?.zone !== "free") {
        module = await this.$axios.get("/api/module").then((res) => {
          if (res) {
            commit("setMenu", res.data);
            if (params) {
              commit("setBreadcrumbs", breadcrumbs.getData(res.data, params));
            }
            return res;
          } else {
            throw new Error("Error /api/module");
          }
        });
      }
      if (module || params?.zone === "free") {
        await this.$axios.get(URL).then((res) => {
          commit(
            "setFlatMenu",
            params?.zone === "free" ? res.data[0]._data : res.data
          );
        });
      }
      return module;
    } catch (e) {
      return null;
    }
  },
  async fetchMenuById({ commit, dispatch, state }, params) {
    try {
      if (params !== null) {
        const URL =
          params?.zone === "free"
            ? `/api/module/55/${params.idItem}?zone=free`
            : `/api/module/55/${params.idItem}`;
        await this.$axios.get(URL).then((res) => {
          if (res) {
            commit("setMenuById", res.data);
          } else {
            throw new Error("Error /api/module");
          }
          if (process.server) {
            commit("setBreadcrumbs", breadcrumbs.getData(state.menu, params));
          }
        });
        if (params?.idWizard) {
          await this.$axios
            .get(`/api/module/55/${params.idWizard}`)
            .then((res) => {
              if (res.data?.settings && res.data?.subSettings) {
                commit("setMenuById", res.data);
              }
            });
        }
      }
    } catch (e) {
      console.error(e);
    }
  },
  async fetchCounters({ commit, state }, params) {
    try {
      return await this.$axios.get("/am/main/v2/data/55/802").then((res) => {
        const menuItems = state.menu[0].children;
        const counters = res.data[0]._data;
        commit("setCounters", counters);
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
        return counters;
      });
    } catch (e) {
      console.error(e);
      return e?.response?.data;
    }
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
      const counter = state.counters.find((i) => i.IDITEM === settings.IDITEM);
      const itemFlatMenu = itemsFlatMenu.find(
        (i) => i.IDITEM === settings.IDITEM
      );
      if (itemMenu) {
        Object.entries(subSettings).forEach(([key, value]) => {
          itemMenu[key] = value;
        });
        if (counter) {
          itemMenu.newCount = counter?.NCOUNT ? counter.NCOUNT : null;
          itemMenu.newCountColor = counter?.SCOLOR ? counter.SCOLOR : null;
        }
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
  setBreadCrumbs(state, data) {
    state.breadCrumbs = data || DEFAULT_BREADCRUMBS;
  },
  setCounter(state, data) {
    const menuItems = state.menu[0].children;
    const item = menuItems.find((i) => i.idItem === data.IDITEM);
    item.newCount = data?.NCOUNT ? data.NCOUNT : null;
    item.newCountColor = data?.SCOLOR ? data.SCOLOR : null;
  },
  setCounters(state, data) {
    state.counters = data;
  },
};
