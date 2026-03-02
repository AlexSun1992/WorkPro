import formConverter from "../converters/dataform";
import { isStringInItem } from "../components/Pages/Cabinet/Block/FilterBlock/SearchBlock.helper";
import contentBlockHelper from "../components/Pages/Cabinet/Block/contentBlock.helper";
import { getFilterValue } from "../components/Pages/Cabinet/Block/FilterBlock/FilterBlock.helper";

export const state = () => ({
  blocks: [],
  form: [],
  isBlock: true,
  isForm: false,
  cardId: 0,
  blockId: null,
  filters: [],
  serverFilters: [],
  searchParams: null,
  PoutValue: "",
  searchValue: null,
  requestFinish: false,
  isLoadedScript: false,
  isCollapseVisible: true,
});

export const getters = {
  isCollapseVisible: (state) => state.isCollapseVisible,
  getScriptStatus: (state) => state.isLoadedScript,

  getServerFilters: (state) => state.serverFilters,

  getRequestStatus: (state) => state.requestFinish,

  getUnfilteredBlockById: (state) => (id) => state.blocks.find((b) => b.blockId === parseInt(id, 10)),

  getMainFilteredItems: (state) => (id) => {
    const currentBlock = state.blocks.find((b) => b.blockId == parseInt(id, 10));

    const mainFilters = state.filters.filter(({ isMainFilter }) => isMainFilter);
    if (currentBlock) {
      // @TODO Вынести фильтры в отдельную функцию, т.к. они повторяют те, что в getBlockById
      return currentBlock.data.items
        .filter((item) => {
          let isItemShow = true;
          mainFilters.forEach((filter) => {
            if (!isItemShow) {
              return;
            }
            const value = item[filter.propertyName];

            if (filter.filter.length === 0) {
              return;
            }
            isItemShow = filter.filter.includes(value);
          });
          return isItemShow;
        })
        .filter((item) => {
          if (state.searchValue) {
            return isStringInItem(item, state.searchValue);
          }
          return true;
        })
        .filter((item) => {
          if (state.searchParams && state.searchParams.id == currentBlock.blockId) {
            return state.searchParams.searchProperty.some((param) =>
              String(item[param]).toLowerCase().includes(state.searchParams.searchString.toLowerCase())
            );
          }
          return true;
        });
    }
    return [];
  },

  getBlockById:
    (state, getters) =>
    (id, mode = "OR") => {
      const currentBlock = state.blocks.find((b) => b.blockId == parseInt(id, 10));

      if (currentBlock) {
        const items = currentBlock.data.items
          .filter((item) => {
            let isItemShow = true;

            getters.getFilters.forEach((filter) => {
              if (!isItemShow || filter.filter.length === 0) {
                return;
              }
              if (mode === "OR") {
                isItemShow = contentBlockHelper.unionFilter(filter.filter, item[filter.propertyName]);
              } else if (mode === "AND") {
                isItemShow = contentBlockHelper.intersectionFilter(filter.filter, item[filter.propertyName]);
              }
            });
            return isItemShow;
          })
          .filter((item) => {
            if (state.searchValue) {
              return isStringInItem(item, state.searchValue);
            }
            return true;
          })
          .filter((item) => {
            if (state.searchParams && state.searchParams.id == currentBlock.blockId) {
              return state.searchParams.searchProperty.some((param) =>
                String(item[param]).toLowerCase().includes(state.searchParams.searchString.toLowerCase())
              );
            }
            return true;
          });
        return {
          ...currentBlock,
          data: {
            ...currentBlock.data,
            items,
          },
        };
      }
    },
  getFilters: (state) => state.filters,
  getForm: (state) => state.form,
  getAddFields: (state, getters) => (id) => {
    const currentBlock = getters.getUnfilteredBlockById(id);
    if (currentBlock) return currentBlock.data.addFields;
  },
  cardId: (state) => state.cardId,
  moduleId: (state) => state.moduleId,
  menuId: (state) => state.menuId,
  blockId: (state) => state.blockId,
  getUrl: (state) => state.PoutValue,
};

export const actions = {
  async toggleCollapse({ commit }, payload) {
    commit("setToggleCollapse", payload);
  },
  async fetchForm({ commit }, { moduleId, menuId, itemId }) {
    await this.$axios.get(`/api/card/${moduleId}/${menuId}/${itemId}`).then((res) => {
      commit("setCardId", itemId);
      commit("setBlockId", menuId);
      commit("setForm", res.data.metaData.data);
    });
  },
  async deleteForm({ dispatch }, { moduleId, menuId, itemId, relId }) {
    await this.$axios
      .delete(`/am/main/v2/datacard/${moduleId}/${menuId}/${itemId}${relId ? `?rel=${relId}` : ""}`)
      .then(() => {
        dispatch("updateBlock", menuId);
      });
  },
  async deleteWizardForm({ dispatch }, { moduleId, menuId, itemId, cardId, relId }) {
    await this.$axios
      .delete(`/am/main/v2/datacard/${moduleId}/${menuId}/${itemId}${relId ? `?rel=${relId}` : ""}`)
      .then(() => {
        dispatch("updateWizardBlock", { menuId, cardId });
      });
  },
  async saveForm({ commit, dispatch, state }, { moduleId, form }) {
    await this.$axios.post(`/api/card/${moduleId}/${state.blockId}/${state.cardId}`, form).then(async (res) => {
      commit("setCardId", res.data.ID);
      dispatch("updateBlock", state.blockId);
    });
  },

  async fetchBlock({ commit }, params) {
    let url;
    if (!params.zone) {
      url = `/api/list/55/${params.id}`;
    } else {
      url = `/api/list/55/${params.id}?zone=free`;
    }
    try {
      const response = await this.$axios.post(url, formConverter.cutHTMLFromQueryParams(params.query || {}));
      const responseData = response.data;
      commit(
        "menu/setMenuById",
        {
          settings: responseData.settings,
          subSettings: responseData.subSettings,
        },
        { root: true }
      );
      commit("addBlock", {
        blockId: parseInt(params.id, 10),
        data: responseData,
      });
      if (params.id === params.idItem) {
        commit("menu/setBreadCrumbs", responseData?.breadCrumbs, {
          root: true,
        });
      }
    } catch (err) {
      return err.response;
    }
  },
  async fetchWizardBlock({ commit }, { itemId, cardId, ...params }) {
    await this.$axios.get(`/api/wizardlist/55/${itemId}/${cardId}`).then((res) => {
      commit(
        "menu/setMenuById",
        {
          settings: res.data.settings,
          subSettings: res.data.subSettings,
        },
        { root: true }
      );
      commit("addBlock", { blockId: parseInt(itemId, 10), data: res.data });
      if (itemId === params.idItem) {
        commit("menu/setBreadCrumbs", res.data?.breadCrumbs, {
          root: true,
        });
      }
    });
  },
  async updateWizardBlock({ commit }, { menuId, cardId }) {
    await this.$axios.get(`/api/wizardlist/55/${menuId}/${cardId}`).then((res) => {
      commit("updateBlock", {
        blockId: parseInt(menuId, 10),
        data: res.data,
      });
      commit("menu/setBreadCrumbs", res.data?.breadCrumbs, {
        root: true,
      });
    });
  },
  async updateBlock({ commit, getters }, id) {
    const filters = getters.getServerFilters.length
      ? encodeURIComponent(JSON.stringify({ filters: JSON.stringify(getters.getServerFilters) }))
      : `{}`;

    await this.$axios.get(`/api/list/55/${id}/${filters}`).then((res) => {
      commit("updateBlock", { blockId: parseInt(id, 10), data: res.data });
      commit("menu/setBreadCrumbs", res.data?.breadCrumbs, {
        root: true,
      });
    });
  },
  async destroyForm({ commit }) {
    commit("setForm", []);
  },
  async clearBlock({ commit }) {
    commit("setForm", []);
    commit("clearBlock");
  },
  async executeAction(
    { commit, dispatch, getters },
    { relId, relActionId, rowId, itemId, actionId, actionRefresh, body }
  ) {
    commit("data_card/setLoading", true, { root: true });
    return await this.$axios
      .post(`/api/card/actionexec/${rowId}/${actionId}/${relId}/${relActionId}`, formConverter.save(body || {}))
      .then(async (resp) => {
        if (getters.getBlockById(itemId) && actionRefresh) {
          dispatch("updateBlock", itemId);
        }
        dispatch("menu/fetchCounters", null, { root: true });
        commit("data_card/setLoading", false, { root: true });
        return resp.data;
      });
  },
  async toggleFavoriteObject({ commit, dispatch, getters, rootGetters }, { blockId, idCard, relId, relationValue }) {
    const { SFAV_NAME: favoriteFilter, IDACTION: actionId, RELATIONID: relationKey } = getters.getAddFields(blockId);
    const parsedActionId = Number.parseInt(actionId, 10);
    const relActionId = rootGetters["menu/getActionById"](parsedActionId)?.REL;

    commit("toggleFavoriteButtons", { blockId, idCard, favoriteFilter });

    await dispatch("executeAction", {
      relId,
      relActionId,
      rowId: idCard,
      body: [
        { name: "ID", value: idCard },
        { name: relationKey, value: relationValue },
      ],
      actionId: parsedActionId,
    });
  },
};

export const mutations = {
  setToggleCollapse(state, data) {
    state.isCollapseVisible = !data;
  },
  scriptLoaded(state, status) {
    state.isLoadedScript = status;
  },

  setPoutValue(state, address) {
    state.PoutValue = address;
  },

  isRequestFinish(state, reqState) {
    state.requestFinish = reqState;
  },

  setForm(state, data) {
    state.form = data;
  },
  addBlock(state, block) {
    const bs = state.blocks.find((b) => b.blockId === block.blockId);

    if (bs) {
      bs.data = block.data;
    } else {
      state.blocks.push(block);
    }
  },
  updateBlock(state, block) {
    const bs = state.blocks.find((b) => b.blockId === block.blockId);

    if (bs) {
      bs.data = block.data;
    }
  },

  clearBlockById(state, blockId) {
    state.blocks = state.blocks.filter((item) => item.blockId !== blockId);
  },

  toggleFavoriteButtons(state, payload) {
    const blockId = parseInt(payload.blockId, 10);
    if (!blockId) return;
    const block = state.blocks.find((b) => b.blockId === blockId);
    if (!block || !Array.isArray(block.data?.items)) return;
    const card = block.data.items.find((el) => el.ID === payload.idCard);
    card.LFAV = !card.LFAV;

    let filters = JSON.parse(card.SFIL);
    const { favoriteFilter } = payload;
    if (filters.includes(favoriteFilter)) {
      filters = filters.filter((val) => val !== favoriteFilter);
    } else {
      filters.push(favoriteFilter);
    }

    if (card.LFAV) {
      card.SBALOONCOLOR = "/img/maps-icon-heart.svg";
    } else if (card.LREC) {
      card.SBALOONCOLOR = "/img/maps-icon-lightning.svg";
    } else {
      card.SBALOONCOLOR = "/img/maps-icon-empty.svg";
    }

    card.SFIL = JSON.stringify(filters);
  },

  clearBlock(state) {
    state.blocks = [];
  },
  setCardId(state, data) {
    state.cardId = data;
  },
  setBlockId(state, data) {
    state.blockId = data;
  },

  clearFilter: (state, { propertyName }) => {
    state.filters = state.filters.filter((item) => item.propertyName !== propertyName);
  },

  clearFilters: (state) => {
    state.filters = [];
  },

  setFilter: (state, data) => {
    if (Array.isArray(data) === true) {
      state.filters = data;
    } else {
      state.filters.push(data);
    }
  },

  setServerFilters: (state, data) => {
    state.serverFilters.push(data);
  },

  updateServerFilters: (state, data) => {
    state.serverFilters.forEach((item) => {
      if (item.propertyName === data.id) {
        item.filter = data.filterIdNumber.toString();
        item.filterOptions = data.filterOptions;
      }
    });

    const filter = state.serverFilters.find((item) => item.propertyName == data.propertyName);

    filter.filter = data.filter;
  },

  replaceFilter: (state, { propertyName, filter, id }) => {
    const currentFilter = state.filters.find((item) => item.propertyName === propertyName && item.id === id);
    if (currentFilter) {
      currentFilter.filter = filter;
    } else {
      state.filters.push({
        propertyName,
        filter,
        id,
      });
    }
  },

  toggleFilter: (state, { propertyName, filterItem, filterType, id, isMainFilter }) => {
    const clearFilterItem = getFilterValue(filterItem);
    let currentFilter = state.filters.find((filter) => filter.propertyName === propertyName);

    if (currentFilter === undefined) {
      currentFilter = {
        propertyName,
        isMainFilter,
        filter: [],
        id,
      };
      state.filters.push(currentFilter);
    }
    if (filterType === "radiobutton" || filterType === "combobox") {
      currentFilter.filter = [...clearFilterItem];
      return;
    }
    if (currentFilter.filter.includes(clearFilterItem)) {
      currentFilter.filter = currentFilter.filter.filter((item) => item !== clearFilterItem);
    } else {
      currentFilter.filter.push(clearFilterItem);
    }
  },
  setSearchParams(state, data) {
    state.searchParams = data;
  },
  setSearchBlock(state, data) {
    state.searchValue = data;
  },
};
