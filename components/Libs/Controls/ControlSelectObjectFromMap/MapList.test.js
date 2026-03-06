import { createLocalVue, mount } from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import { BootstrapVue } from "bootstrap-vue";
import axios from "axios";
import MapList from "./MapList.vue";
// eslint-disable-next-line import/extensions
import { ControlSelectObjectFromMapFixtures as fixtures } from "./ControlSelectObjectFromMap.fixtures";
import * as blocks from "@/store/blocks";
import * as menu from "@/store/menu";
import * as dataCard from "@/store/data_card";

describe.skip("MapList", () => {
  Vue.use(Vuex);
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  localVue.use(Vuex);
  let store;
  let wrapper;
  let mockRoute;
  let dispatchSpy;
  let commitSpy;

  const params = {
    idRel: "SOMERELVALUE",
    idCard: "123456",
    idItem: "712",
    idModule: "55",
    idParent: "0",
  };

  beforeEach(async () => {
    mockRoute = {
      params,
      _location: {
        path: "/cabinet/55/0/718/0",
        query: { ref: "/cabinet/55/0/979" },
        params,
      },
      path: "/cabinet/55/0/718/0",
      fullPath: "/cabinet/55/0/38882/0/123456",
      query: {
        ref: "/cabinet/55/0/979",
      },
      push: jest.fn(),
    };
    store = new Vuex.Store({
      modules: {
        blocks: {
          ...blocks,
          actions: {
            ...blocks.actions,
            executeAction: jest.fn((_, payload) => {}),
          },
          namespaced: true,
        },
        menu: {
          ...menu,
          getters: {
            ...menu.getters,
            getActionById: jest.fn(() => (_) => ({ REL: "relActionId" })),
          },
          namespaced: true,
        },
        data_card: {
          ...dataCard,
          namespaced: true,
        },
      },
    });
    process.server = true;
    store.$axios = axios;
    global.eventHandler = () => null;
    global.fetch = jest.fn();
    store.commit("blocks/clearBlockById", 1);
    store.commit("blocks/addBlock", { blockId: 1, data: fixtures });

    dispatchSpy = jest.spyOn(store, "dispatch");
    commitSpy = jest.spyOn(store, "commit");
  });
  afterEach(() => {
    delete global.eventHandler;
    delete process.server;
    global.fetch.mockClear();
    jest.resetAllMocks();
  });

  const createWrapper = (props = {}, options = {}) =>
    mount(MapList, {
      localVue,
      propsData: {
        data: {},
        itemId: 1,
        ...props,
      },
      mocks: {
        $store: store,
        $route: mockRoute,
      },
      ...options,
    });

  const card = fixtures.items[0];

  describe.skip("Initial state", () => {
    it("renders correctly with default props", () => {
      wrapper = createWrapper({ itemId: 1 });
      expect(wrapper.exists()).toBe(true);
    });

    it("has two tabs that switch correctly", async () => {
      wrapper = createWrapper({ itemId: 1 });
      const listTab = wrapper.find(".tab-list");
      const mapTab = wrapper.find(".tab-map");

      expect(listTab.exists()).toBeTruthy();
      expect(mapTab.exists()).toBeTruthy();

      const listButton = listTab.find("button");

      expect(listButton.classes()).toContain("active");

      const mapButton = mapTab.find("button");

      mapButton.trigger("click");

      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      expect(listButton.classes()).not.toContain("active");
      expect(mapButton.classes()).toContain("active");
    });

    it("has correct filters with correct filtering logic", async () => {
      wrapper = createWrapper({ itemId: 1 });

      const filterBlock = wrapper.find(".filterblock");
      expect(filterBlock.exists()).toBeTruthy();

      let recommendedFilter = wrapper.find('[data-test-id="filter-button-Рекомендованные"]');
      expect(recommendedFilter.exists()).toBeTruthy();
      expect(recommendedFilter.classes()).not.toContain("filter-checked");

      recommendedFilter.trigger("click");

      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      recommendedFilter = wrapper.find('[data-test-id="filter-button-Рекомендованные"]');
      expect(recommendedFilter.classes()).toContain("filter-checked");

      expect(wrapper.findAll(".agent-blocks")).toHaveLength(3);

      let favouriteFilter = wrapper.find('[data-test-id="filter-button-Любимые клиники"]');
      expect(favouriteFilter.exists()).toBeTruthy();
      expect(favouriteFilter.classes()).not.toContain("filter-checked");

      favouriteFilter.trigger("click");

      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      favouriteFilter = wrapper.find('[data-test-id="filter-button-Любимые клиники"]');

      expect(favouriteFilter.classes()).toContain("filter-checked");
      expect(wrapper.findAll(".agent-blocks")).toHaveLength(1);

      recommendedFilter = wrapper.find('[data-test-id="filter-button-Рекомендованные"]');
      expect(recommendedFilter.classes()).toContain("filter-checked");
    });

    it("resets filter on removing a like from a button", async () => {
      wrapper = createWrapper({ itemId: 1 });

      const filterBlock = wrapper.find(".filterblock");
      expect(filterBlock.exists()).toBeTruthy();

      let favouriteFilter = wrapper.find('[data-test-id="filter-button-Любимые клиники"]');
      expect(favouriteFilter.exists()).toBeTruthy();
      expect(favouriteFilter.classes()).not.toContain("filter-checked");

      favouriteFilter.trigger("click");

      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      favouriteFilter = wrapper.find('[data-test-id="filter-button-Любимые клиники"]');

      expect(favouriteFilter.classes()).toContain("filter-checked");
      expect(wrapper.findAll(".agent-blocks")).toHaveLength(1);

      const likeButton = wrapper.find(".btn-heart");

      expect(likeButton.classes()).toContain("active");

      likeButton.trigger("click");

      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      expect(dispatchSpy).toHaveBeenCalledWith(
        "blocks/toggleFavoriteObject",

        expect.objectContaining({
          blockId: 1,
          idCard: card.ID,
          relId: card.REL,
          relationValue: card.IDMEDPARTNER,
        })
      );

      expect(wrapper.findAll('[data-test-id="filter-button-Любимые клиники"]')).toHaveLength(0);
      expect(wrapper.findAll(".agent-blocks")).toHaveLength(58);
    });

    it("shows the correct object on show on map button clicked", async () => {
      wrapper = createWrapper({ itemId: 1 });

      const showOnMapButton = wrapper.findAll(".btn-show-on-map").wrappers[0];

      expect(showOnMapButton.exists()).toBeTruthy();

      showOnMapButton.trigger("click");

      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      const listTab = wrapper.find(".tab-list");
      const mapTab = wrapper.find(".tab-map");

      expect(listTab.exists()).toBeTruthy();
      expect(mapTab.exists()).toBeTruthy();

      const listButton = listTab.find("button");

      expect(listButton.classes()).not.toContain("active");

      const mapButton = mapTab.find("button");

      expect(mapButton.classes()).toContain("active");

      const controlYMap = wrapper.find(".control-map");
      expect(controlYMap.exists()).toBeTruthy();

      // TODO: add proper ymaps tests
    });
    it("correctly selects an object on objectClick ", async () => {
      wrapper = createWrapper({ itemId: 1 });

      let firstClinic = wrapper.findAll(".agent-blocks").wrappers[0];
      expect(firstClinic.exists()).toBeTruthy();

      let chooseButton = wrapper.find(".btn-baloon");
      expect(chooseButton.exists()).toBeTruthy();
      expect(chooseButton.element.hasAttribute("disabled")).toBe(true);
      firstClinic.trigger("click");

      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      // eslint-disable-next-line
      firstClinic = wrapper.findAll(".agent-blocks").wrappers[0];

      expect(firstClinic.classes()).toContain("active");

      chooseButton = wrapper.find(".btn-baloon");
      expect(chooseButton.element.attributes).not.toContain("disabled");
    });
  });
});
