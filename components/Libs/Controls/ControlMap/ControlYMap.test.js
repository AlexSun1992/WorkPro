import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import ControlYMap from "./ControlYMap.vue";

// Замоканный MapInfoBlock
const MapInfoBlockStub = {
  name: "MapInfoBlock",
  props: ["data"],
  template: '<div class="mock-map-info-block" />',
};

const localVue = createLocalVue();
localVue.use(Vuex);

describe("ControlYMap", () => {
  let store;

  const mockMainFilteredItems = [
    { ID: 1, NLAT: 55.1, NLON: 37.1 },
    { ID: 2, NLAT: 55.2, NLON: 37.2 },
  ];

  const mockFilteredItems = [{ ID: 3, NLAT: 55.3, NLON: 37.3 }];
  const mockUnfilteredItems = [
    { ID: 4, NLAT: 55.4, NLON: 37.4 },
    { ID: 5, NLAT: 55.5, NLON: 37.5 },
  ];

  const createStore = (overrides = {}) =>
    new Vuex.Store({
      modules: {
        blocks: {
          namespaced: true,
          getters: {
            getBlockById: overrides.getBlockById || (() => jest.fn(() => ({ data: { items: mockFilteredItems } }))),
            getUnfilteredBlockById:
              overrides.getUnfilteredBlockById || (() => jest.fn(() => ({ data: { items: mockUnfilteredItems } }))),
          },
        },
      },
    });

  const mountComponent = (propsData = {}, localStore = store) =>
    shallowMount(ControlYMap, {
      localVue,
      store: localStore,
      propsData,
      stubs: { MapInfoBlock: MapInfoBlockStub },
      mocks: { $store: localStore },
    });

  it("renders MapInfoBlock", () => {
    store = createStore();
    const wrapper = mountComponent({ mainFilteredItems: mockMainFilteredItems });
    expect(wrapper.findComponent(MapInfoBlockStub).exists()).toBe(true);
  });

  it("passes mainFilteredItems to MapInfoBlock if provided", () => {
    store = createStore();
    const wrapper = mountComponent({ mainFilteredItems: mockMainFilteredItems });
    expect(wrapper.findComponent(MapInfoBlockStub).props("data")).toEqual(mockMainFilteredItems);
  });

  it("falls back to filtered items when mainFilteredItems is absent and itemId is set", () => {
    store = createStore();
    const wrapper = mountComponent({ itemId: 1 });
    expect(wrapper.findComponent(MapInfoBlockStub).props("data")).toEqual(mockFilteredItems);
  });

  it("returns empty array if data is empty and no other source exists", () => {
    store = createStore({
      getUnfilteredBlockById: () => jest.fn(() => ({ data: {} })),
    });
    const wrapper = mountComponent({ data: {} });
    expect(wrapper.findComponent(MapInfoBlockStub).props("data")).toEqual([]);
  });

  it("updates MapInfoBlock data when mainFilteredItems prop changes", async () => {
    store = createStore();
    const wrapper = mountComponent({ mainFilteredItems: mockMainFilteredItems });
    const newItems = [{ ID: 99, NLAT: 55.9, NLON: 37.9 }];
    await wrapper.setProps({ mainFilteredItems: newItems });
    expect(wrapper.findComponent(MapInfoBlockStub).props("data")).toEqual(newItems);
  });
});
