import Vuex from "vuex";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import ControlMap from "./ControlMap.vue";

const ICON_PREFIX = "https://reso.ru/system/modules/ru.reso.v2/resources/img/icons/ya_agent";

jest.mock("vue-yandex-maps", () => ({
  YandexMap: { template: '<div class="mock-yandex-map"><slot /></div>' },
  YandexMapMarker: { template: '<div class="mock-marker"><slot /></div>' },
  YandexMapDefaultSchemeLayer: { template: '<div class="mock-layer-scheme" />' },
  YandexMapDefaultFeaturesLayer: { template: '<div class="mock-layer-features" />' },
  VueYandexMaps: {
    isLoaded: { value: true },
  },
}));

jest.mock("./BaloonMap.vue", () => ({
  name: "BaloonMap",
  template: '<div class="mock-baloon-map" />',
}));

global.ymaps3 = {
  search: jest.fn(),
};

const localVue = createLocalVue();
localVue.use(Vuex);

describe.skip("ControlMap", () => {
  let wrapper;
  let store;
  let mockStoreData;
  let dispatchSpy;
  let commitSpy;

  const mockPropsData = {
    data: {
      menudic: "TEST_MENU",
      fieldId: "FIELD_123",
      name: "Test Field",
    },
    edit: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    const mockFetchBlock = jest.fn().mockResolvedValue({ id: 123 });

    mockStoreData = {
      data: {
        items: [
          { ID: 1, NLON: 37.1, NLAT: 55.1, SNAME: "1" },
          { ID: 2, NLON: 37.2, NLAT: 55.2, SNAME: "2" },
        ],
      },
    };

    store = new Vuex.Store({
      modules: {
        blocks: {
          namespaced: true,
          actions: {
            fetchBlock: mockFetchBlock,
          },
          getters: {
            getUnfilteredBlockById: () => () => mockStoreData,
          },
        },
        data_card: {
          namespaced: true,
          getters: {
            getForm: () => [{ dic: "IDTOWN", value: { value: { SNAME: "Moscow" } } }],
            getSelectedValues: () => ({}),
          },
          mutations: {
            setFilters: jest.fn(),
          },
        },
      },
    });

    dispatchSpy = jest.spyOn(store, "dispatch");
    commitSpy = jest.spyOn(store, "commit");

    wrapper = shallowMount(ControlMap, {
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

  describe("init", () => {
    it("should dispatch fetchBlock action on created", async () => {
      await wrapper.vm.$nextTick();
      expect(dispatchSpy).toHaveBeenCalledWith("blocks/fetchBlock", { id: 123, query: {} });
    });

    it("should set dataContent from store getter", async () => {
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.dataContent).toBeDefined();
      expect(wrapper.vm.dataContent.data.items).toHaveLength(2);
    });

    it("should initialize with default coordinates", () => {
      expect(wrapper.vm.coordinates).toEqual([37.64, 55.76]);
    });
  });

  describe("Computed", () => {
    it("markers should filter out ID 0 and map coordinates", () => {
      const { markers } = wrapper.vm;
      expect(markers.length).toBe(2);
      expect(markers[0].coordinates).toEqual([37.1, 55.1]);
      expect(markers[1].coordinates).toEqual([37.2, 55.2]);
    });

    it("selectedCity should return city name from store", () => {
      expect(wrapper.vm.selectedCity).toBe("Moscow");
    });

    it("markers should reflect activeMarkerId", async () => {
      wrapper.vm.activeMarkerId = 1;
      await wrapper.vm.$nextTick();
      const { markers } = wrapper.vm;
      expect(markers.find((m) => m.ID === 1).active).toBe(true);
      expect(markers.find((m) => m.ID === 2).active).toBe(false);
    });
  });

  describe("Interactions", () => {
    it("handleMarkerClick should set activeMarkerId", () => {
      const mockMarker = { ID: 55 };
      const handler = wrapper.vm.handleMarkerClick(mockMarker);
      handler({ type: "click" });
      expect(wrapper.vm.activeMarkerId).toBe(55);
    });

    it("handleBalloonClose should reset activeMarkerId", () => {
      wrapper.vm.activeMarkerId = 55;
      wrapper.vm.handleBalloonClose();
      expect(wrapper.vm.activeMarkerId).toBeNull();
    });

    it("getIcon should return correct URL", () => {
      expect(wrapper.vm.getIcon(true)).toBe(`${ICON_PREFIX}_active.svg`);
      expect(wrapper.vm.getIcon(false)).toBe(`${ICON_PREFIX}.svg`);
    });

    it("handleSelect should commit to store and emit update", () => {
      wrapper.vm.dataContent = {
        data: {
          items: [{ ID: 99, NLON: 1, NLAT: 1 }],
        },
      };
      wrapper.vm.handleSelect(99);
      expect(commitSpy).toHaveBeenCalledWith("data_card/setFilters", expect.any(Object));
      expect(wrapper.emitted().update).toBeTruthy();
    });
  });

  describe("Geocoding", () => {
    it("getCoordinates should call ymaps3.search if city exists", async () => {
      global.ymaps3.search.mockResolvedValue([{ geometry: { coordinates: [30.0, 60.0] } }]);
      await wrapper.vm.getCoordinates();
      expect(global.ymaps3.search).toHaveBeenCalledWith({
        text: "Moscow",
      });
      expect(wrapper.vm.coordinates).toEqual([30.0, 60.0]);
    });

    it("getCoordinates should fallback on error", async () => {
      global.ymaps3.search.mockRejectedValue(new Error("Geo API Fail"));
      await wrapper.vm.getCoordinates();
      expect(wrapper.vm.coordinates).toEqual([37.64, 55.76]);
    });
  });
});
