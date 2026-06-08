import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import MapInfoBlock from "./MapInfoBlock.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

const MapComponentStub = {
  name: "MapComponent",
  props: ["markers", "activeMarkerId"],
  template: '<div class="mock-map-component"><slot /></div>',
};

const BaloonMapStub = {
  name: "BaloonMap",
  props: ["data", "hasChooseButton", "filterIcons", "itemId"],
  template: `
    <button
      class="mock-baloon-map"
      @click="$emit('select', data.ID)"
    />
  `,
};

describe("MapInfoBlock", () => {
  let wrapper;
  let store;

  const mockMarkersData = [
    { ID: 1, NLAT: 55.1, NLON: 37.1, SBALOONCOLOR: "icon1.svg" },
    { ID: 2, NLAT: 55.1, NLON: 37.1, SBALOONCOLOR: "icon2.svg" },
    { ID: 3, NLAT: 55.2, NLON: 37.2, SBALOONCOLOR: "icon3.svg" },
    { ID: 0, NLAT: 55.3, NLON: 37.3, SBALOONCOLOR: "icon0.svg" },
    { ID: 3, NLAT: 55.2, NLON: 37.2, SBALOONCOLOR: "icon3-duplicate.svg" },
    { ID: 4, SBALOONCOLOR: "icon4.svg" },
  ];

  const mockPropsData = {
    data: mockMarkersData,
    hasChooseButton: false,
    filterIcons: {},
    itemId: 1,
  };

  const createStore = (overrides = {}) =>
    new Vuex.Store({
      modules: {
        data_card: {
          namespaced: true,
          getters: {
            getActivePointInMap: () => overrides.activePointInMap || null,
          },
        },
      },
    });

  const mountComponent = (propsData = mockPropsData, localStore = store) =>
    shallowMount(MapInfoBlock, {
      localVue,
      store: localStore,
      propsData,
      stubs: {
        MapComponent: MapComponentStub,
        BaloonMap: BaloonMapStub,
      },
      mocks: {
        $store: localStore,
      },
    });

  const getMapComponent = () => wrapper.findComponent(MapComponentStub);

  const getBaloonMaps = () => wrapper.findAllComponents(BaloonMapStub);

  beforeEach(() => {
    jest.clearAllMocks();

    store = createStore();

    wrapper = mountComponent();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  const clickMarker = async () => {
    getMapComponent().vm.$emit("marker-click", 1);

    await wrapper.vm.$nextTick();
  };

  describe("Init", () => {
    it("should render MapComponent", () => {
      expect(getMapComponent().exists()).toBe(true);
    });

    it("should pass markers to MapComponent", () => {
      expect(getMapComponent().props("markers")).toEqual(wrapper.vm.markers);
    });

    it("should pass activeMarkerId to MapComponent", () => {
      expect(getMapComponent().props("activeMarkerId")).toBeNull();
    });
  });

  describe("computed", () => {
    it("markers should filter out ID 0 and items without coordinates", () => {
      const ids = wrapper.vm.markers.map((marker) => marker.ID);

      expect(ids).toEqual([1, 2, 3]);
      expect(ids).not.toContain(0);
      expect(ids).not.toContain(4);
    });

    it("markers should remove duplicated items by ID", () => {
      const markerWithId3 = wrapper.vm.markers.filter((marker) => marker.ID === 3);

      expect(markerWithId3).toHaveLength(1);
    });

    it("markers should map coordinates as [NLON, NLAT]", () => {
      const marker = wrapper.vm.markers.find((item) => item.ID === 3);

      expect(marker.coordinates).toEqual([37.2, 55.2]);
    });

    it("markers should group items by same coordinates", () => {
      const marker1 = wrapper.vm.markers.find((marker) => marker.ID === 1);
      const marker2 = wrapper.vm.markers.find((marker) => marker.ID === 2);

      expect(marker1.sameCoordsItems).toHaveLength(2);
      expect(marker2.sameCoordsItems).toHaveLength(2);
      expect(marker1.sameCoordsItems).toEqual(marker2.sameCoordsItems);
    });

    it("markers should use numbered icon for grouped markers", () => {
      const marker1 = wrapper.vm.markers.find((marker) => marker.ID === 1);
      const marker2 = wrapper.vm.markers.find((marker) => marker.ID === 2);

      expect(marker1.icon).toContain("data:image/svg+xml");
      expect(marker2.icon).toContain("data:image/svg+xml");
    });

    it("markers should use SBALOONCOLOR as icon for single marker", () => {
      const marker = wrapper.vm.markers.find((item) => item.ID === 3);

      expect(marker.icon).toBe("icon3.svg");
    });

    it("activeMarkerId should be null when activeCard is empty", () => {
      expect(wrapper.vm.activeMarkerId).toBeNull();
    });

    it("markers active field should be true only for active marker", async () => {
      wrapper.vm.handleMarkerClick(3);

      await wrapper.vm.$nextTick();

      const activeMarkers = wrapper.vm.markers.filter((marker) => marker.active);

      expect(activeMarkers).toHaveLength(1);
      expect(activeMarkers[0].ID).toBe(3);
    });

    it("markers active field should be false for all markers when activeCard is null", async () => {
      wrapper.vm.handleMarkerClick(3);
      await wrapper.vm.$nextTick();

      wrapper.vm.handleInfoClose();
      await wrapper.vm.$nextTick();

      const activeMarkers = wrapper.vm.markers.filter((marker) => marker.active);

      expect(activeMarkers).toHaveLength(0);
    });
  });

  describe("active card", () => {
    it("should set activeCard on marker-click from MapComponent", async () => {
      await clickMarker();

      expect(wrapper.vm.activeCard.ID).toBe(1);
      expect(wrapper.vm.activeMarkerId).toBe(1);
    });

    it("should render info block when marker is selected", async () => {
      await clickMarker();

      expect(wrapper.find(".info-block").exists()).toBe(true);
    });

    it("should render BaloonMap for every sameCoordsItems item", async () => {
      await clickMarker();

      expect(getBaloonMaps()).toHaveLength(2);
    });

    it("should pass props to BaloonMap", async () => {
      const filterIcons = {
        test: "icon.svg",
      };

      await wrapper.setProps({
        hasChooseButton: true,
        filterIcons,
        itemId: 123,
      });

      await clickMarker();

      const baloonMap = getBaloonMaps().at(0);

      expect(baloonMap.props("data")).toEqual(mockMarkersData[0]);
      expect(baloonMap.props("hasChooseButton")).toBe(true);
      expect(baloonMap.props("filterIcons")).toEqual(filterIcons);
      expect(baloonMap.props("itemId")).toBe(123);
    });

    it("should close info block on close button click", async () => {
      await clickMarker();

      expect(wrapper.find(".info-block").exists()).toBe(true);

      await wrapper.find(".close").trigger("click");

      expect(wrapper.vm.activeCard).toBeNull();
      expect(wrapper.find(".info-block").exists()).toBe(false);
    });

    it("should reset activeCard when markers length changes", async () => {
      await clickMarker();

      expect(wrapper.vm.activeCard.ID).toBe(1);

      await wrapper.setProps({
        data: [{ ID: 1, NLAT: 55.1, NLON: 37.1, SBALOONCOLOR: "icon1.svg" }],
      });

      expect(wrapper.vm.activeCard).toBeNull();
    });
  });

  describe("initial active marker", () => {
    it("should set activeCard from data_card/getActivePointInMap on mount", async () => {
      wrapper.destroy();

      store = createStore({
        activePointInMap: 3,
      });

      wrapper = mountComponent(mockPropsData, store);

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.activeMarkerId).toBe(3);
      expect(wrapper.vm.activeCard.ID).toBe(3);
      expect(getMapComponent().props("activeMarkerId")).toBe(3);
    });

    it("should not set activeCard when data_card/getActivePointInMap is empty", () => {
      expect(wrapper.vm.activeCard).toBeUndefined();
      expect(wrapper.vm.activeMarkerId).toBeNull();
    });
  });

  describe("events", () => {
    it("should emit select when BaloonMap emits select", async () => {
      await clickMarker();

      getBaloonMaps().at(0).vm.$emit("select", 1);

      expect(wrapper.emitted("select")).toEqual([[1]]);
    });
  });
});
