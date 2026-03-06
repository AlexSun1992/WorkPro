import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import { BootstrapVue } from "bootstrap-vue";
import axios from "axios";
import { ControlSelectObjectFromMapFixtures as fixtures } from "./ControlSelectObjectFromMap.fixtures";
import * as blocks from "@/store/blocks";
import * as menu from "@/store/menu";
import * as dataCard from "@/store/data_card";
import SelectObjectFromMap from "./SelectObjectFromMap";

describe.skip("SelectObjectFromMap", () => {
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
    mount(SelectObjectFromMap, {
      localVue,
      propsData: {
        data: {},
        ...props,
      },
      mocks: {
        $store: store,
        $route: mockRoute,
      },
      stubs: {
        MapList: true,
      },
      ...options,
    });

  const card = fixtures.items[0];

  describe.skip("Initial state", () => {
    it("renders correctly with default props", () => {
      wrapper = createWrapper({ itemId: 1 });
      expect(wrapper.exists()).toBe(true);
    });

    it("opens a modal on click", async () => {
      wrapper = createWrapper({ itemId: 1 });
      expect(wrapper.exists()).toBe(true);

      const input = wrapper.find("input");
      input.trigger("click");

      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      const dialog = wrapper.find("dialog");
      expect(dialog.exists()).toBe(true);
    });

    // TODO: somehow find a way to test modal-closed
    it.skip("closes a modal on close button click", async () => {
      wrapper = createWrapper({ currentValue: null, edit: true, oneToManyData: {} });
      expect(wrapper.exists()).toBe(true);

      const input = wrapper.find("input");
      input.trigger("click");

      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      let dialog = wrapper.find(".control-select-object-from-map");
      expect(dialog.exists()).toBe(true);
      expect(dialog.classes()).toContain("modal-open");

      const closeButton = dialog.find(".close_clinic");
      closeButton.trigger("click");

      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      dialog = wrapper.find(".control-select-object-from-map");
      expect(dialog.classes()).toContain("modal-closed");
    });

    it("input is readonly when edit prop is restricted", () => {
      wrapper = createWrapper({ currentValue: null, edit: false, oneToManyData: {} });
      expect(wrapper.exists()).toBeTruthy();

      const input = wrapper.find("input");

      expect(input.element.readOnly).toBeTruthy();
      expect(input.element.readOnly).toBeTruthy();

      input.trigger("click");
      const dialog = wrapper.find(".control-select-object-from-map");
      expect(dialog.classes()).toContain("modal-closed");
    });

    it("updates the value on clinic being chosen", async () => {
      wrapper = createWrapper({ currentValue: null, edit: true, oneToManyData: {} });
      expect(wrapper.exists()).toBe(true);

      const input = wrapper.find("input");
      input.trigger("click");

      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      const dialog = wrapper.find(".control-select-object-from-map");
      expect(dialog.exists()).toBe(true);
      expect(dialog.classes()).toContain("modal-open");
    });
  });
});
