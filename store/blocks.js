import axios, { Axios } from "axios";
import {
  updateScript,
  clearScript,
} from "../components/EventHandler/eventHandler.helper";

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
  requestFinish: false,
  isLoadedScript: false,
  isCollapseVisible: true,
});

export const getters = {
  isCollapseVisible: (state) => state.isCollapseVisible,
  getScriptStatus: (state) => state.isLoadedScript,

  getServerFilters: (state) => state.serverFilters,

  getRequestStatus: (state) => state.requestFinish,

  getUnfilteredBlockById: (state) => (id) =>
    state.blocks.find((b) => b.blockId === parseInt(id)),
  getBlockById: (state) => (id) => {
    const currentBlock = state.blocks.find((b) => b.blockId == parseInt(id));

    if (currentBlock) {
      const items = currentBlock.data.items
        .filter((item) => {
          let isItemShow = true;
          state.filters.forEach((filter) => {
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
          if (
            state.searchParams &&
            state.searchParams.id == currentBlock.blockId
          ) {
            return state.searchParams.searchProperty.some((param) =>
              String(item[param])
                .toLowerCase()
                .includes(state.searchParams.searchString.toLowerCase())
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
  cardId: (state) => state.cardId,
  moduleId: (state) => state.moduleId,
  menuId: (state) => state.menuId,
  blockId: (state) => state.blockId,
  getUrl: (state) => state.PoutValue,
};

let cachedController = null;
let cacheKey = null;
let cachedPromised = null;

export const actions = {
  async toggleCollapse({ commit }, payload) {
    commit("setToggleCollapse", payload);
  },
  async getScript({ commit, state }, payload) {
    if (global.window) {
      if (cacheKey !== payload.idItem) {
        cachedController?.abort();
        await cachedPromised?.catch(() => null);
        commit("scriptLoaded", false);
        cacheKey = payload.idItem;
        cachedController = new AbortController();
        clearScript();
        cachedPromised = fetch(
          `/api/card/js/${payload.idModule}/${
            payload.idItem
          }?time=${Date.now()}`,
          {
            method: "GET",
            signal: cachedController.signal,
          }
        )
          .then((res) => res.text())
          .then((scriptText) => updateScript(scriptText))
          .then(() => commit("scriptLoaded", true));
      }
      await cachedPromised;
    }
  },
  async fetchForm({ commit, dispatch }, { moduleId, menuId, itemId }) {
    await this.$axios
      .get(`/api/card/${moduleId}/${menuId}/${itemId}`)
      .then((res) => {
        commit("setCardId", itemId);
        commit("setBlockId", menuId);
        commit("setForm", res.data.metaData.data);
      });
  },
  async deleteForm({ commit, dispatch }, { moduleId, menuId, itemId, relId }) {
    await this.$axios
      .delete(
        `/am/main/v2/datacard/${moduleId}/${menuId}/${itemId}${
          relId ? `?rel=${relId}` : ""
        }`
      )
      .then((res) => {
        dispatch("updateBlock", menuId);
      });
  },
  async deleteWizardForm(
    { commit, dispatch },
    { moduleId, menuId, itemId, cardId, relId }
  ) {
    await this.$axios
      .delete(
        `/am/main/v2/datacard/${moduleId}/${menuId}/${itemId}${
          relId ? `?rel=${relId}` : ""
        }`
      )
      .then((res) => {
        dispatch("updateWizardBlock", { menuId, cardId });
      });
  },
  async saveForm({ commit, dispatch, state }, { moduleId, form }) {
    await this.$axios
      .post(`/api/card/${moduleId}/${state.blockId}/${state.cardId}`, form)
      .then(async (res) => {
        commit("setCardId", res.data.ID);
        dispatch("updateBlock", state.blockId);
      });
  },
  async fetchBlock({ commit, dispatch, state }, params) {
    let url;
    if (!params.zone) {
      url = `/api/list/55/${params.id}`;
    } else {
      url = `/api/list/55/${params.id}?zone=free`;
    }
    try {
      const response = await this.$axios.post(url, params.query);
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
  async fetchWizardBlock({ commit, dispatch }, { itemId, cardId, ...params }) {
    await this.$axios
      .get(`/api/wizardlist/55/${itemId}/${cardId}`)
      .then((res) => {
        commit(
          "menu/setMenuById",
          {
            settings: res.data.settings,
            subSettings: res.data.subSettings,
          },
          { root: true }
        );
        commit("addBlock", { blockId: parseInt(itemId), data: res.data });
        if (itemId === params.idItem) {
          commit("menu/setBreadCrumbs", res.data?.breadCrumbs, {
            root: true,
          });
        }
      });
  },
  async updateWizardBlock({ commit, dispatch }, { menuId, cardId }) {
    await this.$axios
      .get(`/api/wizardlist/55/${menuId}/${cardId}`)
      .then((res) => {
        commit("updateBlock", { blockId: parseInt(menuId), data: res.data });
        commit("menu/setBreadCrumbs", res.data?.breadCrumbs, {
          root: true,
        });
      });
  },
  async updateBlock({ commit, dispatch, getters }, id) {
    const filters = getters.getServerFilters.length
      ? encodeURIComponent(
          JSON.stringify({ filters: JSON.stringify(getters.getServerFilters) })
        )
      : `{}`;
    await this.$axios.get(`/api/list/55/${id}/${filters}`).then((res) => {
      commit("updateBlock", { blockId: parseInt(id), data: res.data });
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
    return await this.$axios
      .post(
        `/api/card/actionexec/${rowId}/${actionId}/${relId}/${relActionId}`,
        body || {}
      )
      .then(async (resp) => {
        if (getters.getBlockById(itemId) && actionRefresh) {
          dispatch("updateBlock", itemId);
        }
        dispatch("menu/fetchCounters", null, { root: true });
        return resp.data;
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
    bs.data = block.data;
  },

  clearBlockById(state, blockId) {
    state.blocks = state.blocks.filter((item) => item.blockId !== blockId);
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
    state.filters = state.filters.filter(
      (item) => item.propertyName !== propertyName
    );
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

    const filter = state.serverFilters.find(
      (item) => item.propertyName == data.propertyName
    );

    filter.filter = data.filter;
  },

  replaceFilter: (state, { propertyName, filter, id }) => {
    const currentFilter = state.filters.find(
      (item) => item.propertyName === propertyName && item.id === id
    );
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

  toggleFilter: (state, { propertyName, filterItem, filterType, id }) => {
    let currentFilter = state.filters.find(
      (filter) => filter.propertyName === propertyName
    );
    if (currentFilter === undefined) {
      currentFilter = {
        propertyName,
        filter: [],
        id,
      };
      state.filters.push(currentFilter);
    }
    if (filterType === "radiobutton" || filterType === "combobox") {
      currentFilter.filter = [filterItem];
      return;
    }
    if (currentFilter.filter.includes(filterItem)) {
      currentFilter.filter = currentFilter.filter.filter(
        (item) => item !== filterItem
      );
    } else {
      currentFilter.filter.push(filterItem);
    }
  },
  setSearchParams(state, data) {
    state.searchParams = data;
  },
};
