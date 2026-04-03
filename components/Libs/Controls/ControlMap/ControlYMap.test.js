import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import ControlYMap from "./ControlYMap.vue";

jest.mock("vue-yandex-maps", () => ({
  YandexMap: {
    template: '<div class="mock-yandex-map"><slot /></div>',
    props: ["settings", "modelValue"],
    emits: ["update:modelValue"],
    created() {
      this.$emit("update:modelValue", {
        setLocation: jest.fn(() => [0.1, 0.05]),
        container: { clientWidth: 1000, clientHeight: 600 },
        projection: {
          fromWorldCoordinates: jest.fn(() => [0.1, 0.05]),
        },
      });
    },
  },
  YandexMapMarker: {
    template: '<div class="mock-marker"><slot /></div>',
    props: ["settings", "position"],
  },
  YandexMapDefaultSchemeLayer: { template: '<div class="mock-layer-scheme" />' },
  YandexMapDefaultFeaturesLayer: { template: '<div class="mock-layer-features" />' },
  pixelsToWorld: ({ x, y }, zoom) => ({ x: 0.1, y: 0.1 }),
  getBoundsFromCoords: jest.fn(() => [0, 0]),
  getLocationFromBounds: jest.fn(() => [0, 0]),
}));

jest.mock("./BaloonMap", () => ({
  name: "BaloonMap",
  template: '<div class="mock-baloon-map" />',
  props: ["data", "hasChooseButton", "filterIcons", "itemId"],
}));

const localVue = createLocalVue();
localVue.use(Vuex);

describe("ControlYMap", () => {
  let wrapper;
  let store;
  let dispatchSpy;
  let commitSpy;

  const mockMarkersData = [
    { ID: 1, NLAT: 55.1, NLON: 37.1, SBALOONCOLOR: "icon1.svg" },
    { ID: 2, NLAT: 55.1, NLON: 37.1, SBALOONCOLOR: "icon2.svg" },
    { ID: 3, NLAT: 55.2, NLON: 37.2, SBALOONCOLOR: "icon3.svg" },
  ];

  const mockPropsData = {
    data: {
      menudic: "TEST_MENU",
      fieldId: "FIELD_123",
      name: "Test Field",
    },
    itemId: 1,
    mainFilteredItems: mockMarkersData,
    hasChooseButton: false,
    filterIcons: {},
  };

  const createStore = (overrides = {}) =>
    new Vuex.Store({
      modules: {
        blocks: {
          namespaced: true,
          getters: {
            getBlockById:
              overrides.getBlockById ||
              (() => (_) => ({
                data: { items: [{ ID: 3, NLAT: 55.2, NLON: 37.2, SBALOONCOLOR: "icon3.svg" }] },
              })),
            getUnfilteredBlockById:
              overrides.getUnfilteredBlockById ||
              (() => (_) => ({
                data: {
                  items: [
                    { ID: 10, NLAT: 55.5, NLON: 37.5, SBALOONCOLOR: "icon10.svg" },
                    { ID: 11, NLAT: 55.6, NLON: 37.6, SBALOONCOLOR: "icon11.svg" },
                  ],
                },
              })),
          },
        },
        data_card: {
          namespaced: true,
          getters: {
            getSelectedValues: () => ({}),
            getActivePointInMap: overrides.getActivePointInMap || (() => null),
          },
          mutations: {
            setActivePointInMap: jest.fn(),
          },
        },
      },
    });

  beforeEach(() => {
    jest.clearAllMocks();

    store = createStore();

    dispatchSpy = jest.spyOn(store, "dispatch");
    commitSpy = jest.spyOn(store, "commit");

    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
    }));

    wrapper = shallowMount(ControlYMap, {
      localVue,
      store,
      mocks: {
        $store: store,
        $route: { params: { id: 123 }, query: {} },
      },
      propsData: mockPropsData,
      stubs: {
        "client-only": true,
        BaloonMap: true,
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("Init", () => {
    it("should initialize with default location", () => {
      expect(wrapper.vm.location).toEqual({ zoom: 10, center: [37.64, 55.76] });
    });
  });

  describe("computed", () => {
    it("markers should filter out ID 0 and map coordinates", async () => {
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      const { markers } = wrapper.vm;
      expect(markers.length).toBe(3);
      expect(markers.some((m) => m.ID === 0)).toBe(false);
    });

    it("markers should group items by coordinates", async () => {
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      const { markers } = wrapper.vm;
      const marker1 = markers.find((m) => m.ID === 1);
      const marker2 = markers.find((m) => m.ID === 2);

      expect(marker1.sameCoordsItems).toHaveLength(2);
      expect(marker2.sameCoordsItems).toHaveLength(2);
    });

    it("isDataExist should return true when data has keys", () => {
      expect(wrapper.vm.isDataExist).toBe(true);
    });

    it("isDataExist should return false when data is empty object", async () => {
      await wrapper.setProps({ data: {} });
      expect(wrapper.vm.isDataExist).toBe(false);
    });

    it("dataContent should call getUnfilteredBlockById with correct menudic", () => {
      const spy = jest.fn(() => ({ data: { items: [] } }));
      const localStore = createStore({ getUnfilteredBlockById: () => spy });
      const localWrapper = shallowMount(ControlYMap, {
        localVue,
        store: localStore,
        mocks: { $store: localStore, $route: { params: {}, query: {} } },
        propsData: mockPropsData,
        stubs: { "client-only": true, BaloonMap: true },
      });

      // eslint-disable-next-line
      localWrapper.vm.dataContent;
      expect(spy).toHaveBeenCalledWith("TEST_MENU");
      localWrapper.destroy();
    });

    it("dataContentFiltered should return items from store when itemId is set", () => {
      const items = [{ ID: 3, NLAT: 55.2, NLON: 37.2, SBALOONCOLOR: "icon3.svg" }];
      const localStore = createStore({
        getBlockById: () => (_) => ({ data: { items } }),
      });
      const localWrapper = shallowMount(ControlYMap, {
        localVue,
        store: localStore,
        mocks: { $store: localStore, $route: { params: {}, query: {} } },
        propsData: { ...mockPropsData, mainFilteredItems: undefined },
        stubs: { "client-only": true, BaloonMap: true },
      });

      expect(localWrapper.vm.dataContentFiltered).toEqual(items);
      localWrapper.destroy();
    });

    it("dataContentFiltered should return [] when itemId is not set", async () => {
      const localWrapper = shallowMount(ControlYMap, {
        localVue,
        store,
        mocks: { $store: store, $route: { params: {}, query: {} } },
        propsData: { ...mockPropsData, itemId: undefined },
        stubs: { "client-only": true, BaloonMap: true },
      });

      expect(localWrapper.vm.dataContentFiltered).toEqual([]);
      localWrapper.destroy();
    });

    it("dataContentFiltered should return [] when block has no items", () => {
      const localStore = createStore({
        getBlockById: () => (_) => ({ data: {} }),
      });
      const localWrapper = shallowMount(ControlYMap, {
        localVue,
        store: localStore,
        mocks: { $store: localStore, $route: { params: {}, query: {} } },
        propsData: { ...mockPropsData, mainFilteredItems: undefined },
        stubs: { "client-only": true, BaloonMap: true },
      });

      expect(localWrapper.vm.dataContentFiltered).toEqual([]);
      localWrapper.destroy();
    });

    it("markers should use mainFilteredItems when provided (highest priority)", async () => {
      await wrapper.vm.$nextTick();
      const ids = wrapper.vm.markers.map((m) => m.ID);
      expect(ids).toEqual(expect.arrayContaining([1, 2, 3]));
    });

    it("markers should fall back to dataContentFiltered when mainFilteredItems is absent", async () => {
      const items = [{ ID: 99, NLAT: 55.9, NLON: 37.9, SBALOONCOLOR: "icon99.svg" }];
      const localStore = createStore({
        getBlockById: () => (_) => ({ data: { items } }),
      });
      const localWrapper = shallowMount(ControlYMap, {
        localVue,
        store: localStore,
        mocks: { $store: localStore, $route: { params: {}, query: {} } },
        propsData: { ...mockPropsData, mainFilteredItems: undefined },
        stubs: { "client-only": true, BaloonMap: true },
      });

      await localWrapper.vm.$nextTick();
      const ids = localWrapper.vm.markers.map((m) => m.ID);
      expect(ids).toContain(99);
      localWrapper.destroy();
    });

    it("markers should fall back to dataContent when both mainFilteredItems and dataContentFiltered are absent", async () => {
      const localStore = createStore({
        getBlockById: () => (_) => null,
        getUnfilteredBlockById: () => (_) => ({
          data: {
            items: [{ ID: 77, NLAT: 55.7, NLON: 37.7, SBALOONCOLOR: "icon77.svg" }],
          },
        }),
      });
      const localWrapper = shallowMount(ControlYMap, {
        localVue,
        store: localStore,
        mocks: { $store: localStore, $route: { params: {}, query: {} } },
        propsData: { ...mockPropsData, mainFilteredItems: undefined, itemId: undefined },
        stubs: { "client-only": true, BaloonMap: true },
      });

      await localWrapper.vm.$nextTick();
      const ids = localWrapper.vm.markers.map((m) => m.ID);
      expect(ids).toContain(77);
      localWrapper.destroy();
    });

    it("markers active field should be true only for activeMarkerId", async () => {
      wrapper.vm.activeMarkerId = 3;
      await wrapper.vm.$nextTick();

      const activeMarkers = wrapper.vm.markers.filter((m) => m.active);

      expect(activeMarkers).toHaveLength(1);
      expect(activeMarkers[0].ID).toBe(3);
    });

    it("markers active should be false for all markers when activeMarkerId is null", async () => {
      wrapper.vm.activeMarkerId = null;
      await wrapper.vm.$nextTick();

      const activeMarkers = wrapper.vm.markers.filter((m) => m.active);
      expect(activeMarkers).toHaveLength(0);
    });

    it("getAllCoordinates should return array of coordinates for all markers", async () => {
      await wrapper.vm.$nextTick();
      const coords = wrapper.vm.getAllCoordinates;

      expect(Array.isArray(coords)).toBe(true);
      expect(coords.length).toBe(wrapper.vm.markers.length);
      coords.forEach((coord) => {
        expect(Array.isArray(coord)).toBe(true);
        expect(coord).toHaveLength(2);
      });
    });

    it("initialMarkerId should return value from store getter", () => {
      const localStore = createStore({
        getActivePointInMap: () => 42,
      });
      const localWrapper = shallowMount(ControlYMap, {
        localVue,
        store: localStore,
        mocks: { $store: localStore, $route: { params: {}, query: {} } },
        propsData: mockPropsData,
        stubs: { "client-only": true, BaloonMap: true },
      });

      expect(localWrapper.vm.initialMarkerId).toBe(42);
      localWrapper.destroy();
    });

    it("initialMarkerId should return null when store has no active point", () => {
      expect(wrapper.vm.initialMarkerId).toBeNull();
    });
  });
  describe("methods", () => {
    it("normalizeLocation should floor zoom and subtract 0.5", () => {
      const result = wrapper.vm.normalizeLocation({ center: [37.6, 55.7], zoom: 11.8 });
      expect(result.zoom).toBe(10.5);
    });

    it("normalizeLocation should merge MAP_TRANSITION_SETTINGS", () => {
      const result = wrapper.vm.normalizeLocation({ center: [37.6, 55.7], zoom: 10 });
      expect(result).toMatchObject({
        duration: expect.any(Number),
        easing: expect.any(String),
      });
    });

    it("getActiveCard should return marker matching given ID", async () => {
      await wrapper.vm.$nextTick();
      const card = wrapper.vm.getActiveCard(3);
      expect(card).toBeDefined();
      expect(card.ID).toBe(3);
    });

    it("getActiveCard should return undefined for unknown ID", async () => {
      await wrapper.vm.$nextTick();
      const card = wrapper.vm.getActiveCard(9999);
      expect(card).toBeUndefined();
    });

    it("setActiveMarker should set showInfoPanel to true", async () => {
      await wrapper.vm.$nextTick();
      wrapper.vm.setActiveMarker(3);
      expect(wrapper.vm.showInfoPanel).toBe(true);
    });

    it("setActiveMarker should set activeMarkerId to given id", async () => {
      await wrapper.vm.$nextTick();
      wrapper.vm.setActiveMarker(3);
      expect(wrapper.vm.activeMarkerId).toBe(3);
    });

    it("setActiveMarker should set activeCard from markers", async () => {
      await wrapper.vm.$nextTick();
      wrapper.vm.setActiveMarker(3);
      expect(wrapper.vm.activeCard).toBeDefined();
      expect(wrapper.vm.activeCard.ID).toBe(3);
    });

    it("setActiveMarker should update location center with offset applied", async () => {
      await wrapper.vm.$nextTick();

      const getInfoBlockOffsetSpy = jest.spyOn(wrapper.vm, "getInfoBlockOffset").mockReturnValue([0.05, 0.02]);

      wrapper.vm.setActiveMarker(3);

      const marker = wrapper.vm.markers.find((m) => m.ID === 3);
      const expectedX = parseFloat(marker.coordinates[0]) + 0.05;
      const expectedY = parseFloat(marker.coordinates[1]) + 0.02;

      expect(wrapper.vm.location.center[0]).toBeCloseTo(expectedX);
      expect(wrapper.vm.location.center[1]).toBeCloseTo(expectedY);

      getInfoBlockOffsetSpy.mockRestore();
    });

    it("getNumberedIcon should return a data URI SVG", () => {
      const icon = wrapper.vm.getNumberedIcon(5);
      expect(icon).toMatch(/^data:image\/svg\+xml/);
    });

    it("getNumberedIcon should embed the correct number in SVG text", () => {
      const icon = wrapper.vm.getNumberedIcon(7);
      const decoded = decodeURIComponent(icon.replace("data:image/svg+xml;charset=utf-8,", ""));
      expect(decoded).toContain(">7<");
    });

    it("onMapInit should call setActiveMarker when initialMarkerId is set", async () => {
      const localStore = createStore({ getActivePointInMap: () => 3 });
      const localWrapper = shallowMount(ControlYMap, {
        localVue,
        store: localStore,
        mocks: { $store: localStore, $route: { params: {}, query: {} } },
        propsData: mockPropsData,
        stubs: { "client-only": true, BaloonMap: true },
      });

      await localWrapper.vm.$nextTick();

      const setActiveMarkerSpy = jest.spyOn(localWrapper.vm, "setActiveMarker");
      const getMarkerLocationMock = jest
        .spyOn(localWrapper.vm, "getMarkerLocation")
        .mockResolvedValue({ center: [37.6, 55.7], zoom: 10 });

      await localWrapper.vm.onMapInit();

      expect(setActiveMarkerSpy).toHaveBeenCalledWith(3);

      setActiveMarkerSpy.mockRestore();
      getMarkerLocationMock.mockRestore();
      localWrapper.destroy();
    });

    it("onMapInit should not call setActiveMarker when initialMarkerId is null", async () => {
      const setActiveMarkerSpy = jest.spyOn(wrapper.vm, "setActiveMarker");
      const getMarkerLocationMock = jest
        .spyOn(wrapper.vm, "getMarkerLocation")
        .mockResolvedValue({ center: [37.6, 55.7], zoom: 10 });

      await wrapper.vm.onMapInit();

      expect(setActiveMarkerSpy).not.toHaveBeenCalled();

      setActiveMarkerSpy.mockRestore();
      getMarkerLocationMock.mockRestore();
    });

    it("onMapInit should set location with zoom reduced by 0.5", async () => {
      const getMarkerLocationMock = jest
        .spyOn(wrapper.vm, "getMarkerLocation")
        .mockResolvedValue({ center: [37.6, 55.7], zoom: 12 });

      await wrapper.vm.onMapInit();

      expect(wrapper.vm.location.zoom).toBe(11.5); // 12 - 0.5
      getMarkerLocationMock.mockRestore();
    });

    it("handleMarkerClick should set activeMarkerId", () => {
      wrapper.vm.handleMarkerClick(3)(new Event("click"));
      expect(wrapper.vm.activeMarkerId).toBe(3);
      expect(wrapper.vm.showInfoPanel).toBe(true);
    });

    it("handleInfoClose should reset activeMarkerId", () => {
      wrapper.vm.showInfoPanel = true;
      wrapper.vm.activeMarkerId = 55;
      wrapper.vm.handleInfoClose();
      expect(wrapper.vm.showInfoPanel).toBe(false);
      expect(wrapper.vm.activeMarkerId).toBeNull();
    });

    it("handleSelect should emit select event", () => {
      wrapper.vm.handleSelect(42);
      expect(wrapper.emitted().select).toBeTruthy();
      expect(wrapper.emitted().select[0]).toEqual([42]);
    });

    it("handleSelect should not emit select when not called", () => {
      expect(wrapper.emitted().select).toBeFalsy();
    });

    it("markerIcon should return numbered icon when multiple items share coords", () => {
      const marker = { sameCoordsItems: [{}, {}, {}], SBALOONCOLOR: "icon.svg" };
      const icon = wrapper.vm.markerIcon(marker);
      expect(icon).toContain("image/svg+xml");
    });

    it("markerIcon should return SBALOONCOLOR when single item", () => {
      const marker = { sameCoordsItems: [{}], SBALOONCOLOR: "custom-icon.svg" };
      const icon = wrapper.vm.markerIcon(marker);
      expect(icon).toBe("custom-icon.svg");
    });

    it("getHeight should return correct marker height", () => {
      expect(wrapper.vm.getHeight(false)).toBe(32);
      expect(wrapper.vm.getHeight(true)).toBe(50);
    });
  });

  describe("watchers", () => {
    it("markers watcher should call setMarkerLocation when length changes", async () => {
      const setMarkerLocationSpy = jest.spyOn(wrapper.vm, "setMarkerLocation").mockResolvedValue(undefined);

      await wrapper.setProps({
        mainFilteredItems: [{ ID: 5, NLAT: 55.5, NLON: 37.5, SBALOONCOLOR: "icon5.svg" }],
      });
      await wrapper.vm.$nextTick();

      expect(setMarkerLocationSpy).toHaveBeenCalled();
      setMarkerLocationSpy.mockRestore();
    });
  });

  describe("getInfoBlockOffset", () => {
    it("should return [0, 0] when map is not initialized", () => {
      const result = wrapper.vm.getInfoBlockOffset();
      expect(result).toEqual([0, 0]);
    });

    it("should return horizontal offset on desktop (matchMedia > 998px = false for matches)", () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: false });

      const result = wrapper.vm.getInfoBlockOffset();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });

    it("should return vertical offset on mobile (matchMedia matches = true)", () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: true });

      const result = wrapper.vm.getInfoBlockOffset();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });
  });

  describe("lifecycle", () => {
    it("beforeUnmount should commit setActivePointInMap with null", async () => {
      const localStore = createStore();
      const localCommitSpy = jest.spyOn(localStore, "commit");

      const localWrapper = shallowMount(ControlYMap, {
        localVue,
        store: localStore,
        mocks: { $store: localStore, $route: { params: {}, query: {} } },
        propsData: mockPropsData,
        stubs: { "client-only": true, BaloonMap: true },
      });

      localWrapper.destroy();

      expect(localCommitSpy).toHaveBeenCalledWith("data_card/setActivePointInMap", null);
    });
  });

  describe("props passed to BaloonMap", () => {
    beforeEach(async () => {
      await wrapper.vm.$nextTick();
      wrapper.vm.setActiveMarker(3);
      await wrapper.vm.$nextTick();
    });

    it("should pass hasChooseButton prop to BaloonMap", () => {
      const baloon = wrapper.findComponent({ name: "BaloonMap" });
      expect(baloon.exists()).toBe(true);
      expect(baloon.props("hasChooseButton")).toBe(false);
    });

    it("should pass filterIcons prop to BaloonMap", () => {
      const baloon = wrapper.findComponent({ name: "BaloonMap" });
      expect(baloon.props("filterIcons")).toEqual({});
    });

    it("should pass itemId prop to BaloonMap", () => {
      const baloon = wrapper.findComponent({ name: "BaloonMap" });
      expect(baloon.props("itemId")).toBe(1);
    });

    it("should pass card data prop to BaloonMap", () => {
      const baloon = wrapper.findComponent({ name: "BaloonMap" });
      expect(baloon.props("data")).toBeDefined();
    });
  });
});
