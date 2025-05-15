import Vue from "vue";
import Vuex from "vuex";
import YmapPlugin, { yandexMap } from "vue-yandex-maps";
import { mount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import ControlMap from "./ControlMap.vue";
import * as blocks from "../../../../store/blocks";
import * as dataCard from "../../../../store/data_card";
import * as menu from "../../../../store/menu";

const adressesCoords = {
  "г. Одинцово": [55.679138, 37.263663],
};
const createWrapper = (store) => {
  const mockData = {
    name: "test",
    menudic: 123,
    fieldId: 1231,
  };
  const mockRoute = {
    path: "/cabinet/55/0/872/0",
  };
  const mockRouter = {
    params: {},
  };
  const YandexMapMock = {
    name: "yandex-map",
    template: "<div><slot></slot></div>",
    props: ["coords"],
    emits: ["map-was-initialized"],
  };
  return mount(ControlMap, {
    propsData: {
      isIdActiveMarker: 12,
      data: mockData,
      edit: true,
    },
    stubs: {
      "yandex-map": YandexMapMock,
      "yandex-marker": true,
      "baloon-map": true,
    },
    mocks: {
      $store: store,
      $router: mockRouter,
      $route: mockRoute,
    },
  });
};

describe("ControlMap", () => {
  Vue.use(Vuex, BootstrapVue, YmapPlugin);
  beforeAll(() => {
    global.ymaps = {
      geocode: (address) => {
        const result = {
          geoObjects: {
            get: () => ({
              geometry: {
                _coordinates: adressesCoords[address],
              },
            }),
          },
        };

        return result;
      },
    };
  });

  const storeWithFilter = new Vuex.Store({
    modules: {
      blocks: {
        ...blocks,
        namespaced: true,
      },
      data_card: {
        ...dataCard,
        state: {
          ...dataCard.state(),
          form: [
            {
              label: "Город",
              value: {
                value: {
                  IDSYSTEMFILTR: -1,
                  IDLPU: 0,
                  IDLPUFILTR: 0,
                  IDPLACE: 1504,
                  SNAME: "г. Одинцово",
                  VNSBER_OLD: 0,
                },
                text: 1504,
              },
              type: "listSelect",
              id: "872",
              fieldId: 59715,
              cols: 4,
              colSm: 12,
              colMd: 12,
              isMask: false,
              colLg: 12,
              width: "100%",
              name: "FKIDTOWN",
              cssClass: "",
              webId: "",
              visible: true,
              required: true,
              page: 0,
              readonly: false,
              control: null,
              state: true,
              checked: true,
              error: null,
              isRelation: false,
              fieldRelation: null,
              isTab: true,
              menudic: 874,
              dic: "IDTOWN",
              options: null,
            },
            {
              checked: null,
              control: null,
              cssClass: "",
              error: null,
              fieldId: 1231,
              fieldRelation: "",
              id: "1028",
              isRelation: false,
              isTab: false,
              label: "СТОА",
              menudic: 1030,
              name: "STOAMAP",
              page: 6,
              readonly: false,
              required: false,
              state: null,
              type: "Map",
              value: null,
              visible: true,
              webId: "",
              width: "100%",
            },
          ],
        },
        namespaced: true,
      },
      menu: {
        ...menu,
        namespaced: true,
      },
    },
  });

  const emptyStore = new Vuex.Store({
    modules: {
      blocks: {
        ...blocks,
        namespaced: true,
      },
      data_card: {
        ...dataCard,
        namespaced: true,
      },
      menu: {
        ...menu,
        namespaced: true,
      },
    },
  });

  let wrapper;

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    wrapper.destroy();
  });

  it("В store есть выбранный город", async () => {
    wrapper = createWrapper(storeWithFilter);

    expect(wrapper.vm.selectedCity).toEqual("г. Одинцово");
  });

  it("В карту передаются дефолтные координаты", async () => {
    wrapper = createWrapper(emptyStore);

    const YMap = wrapper.findComponent({ name: "yandex-map" });
    await YMap.vm.$emit("map-was-initialized");
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.coordinates).toEqual([55.76, 37.64]);
    expect(YMap.props("coords")).toEqual([55.76, 37.64]);
  });

  it("Переданные координаты в карту соответствуют городу в фильтре", async () => {
    wrapper = createWrapper(storeWithFilter);

    const YMap = wrapper.findComponent({ name: "yandex-map" });
    await YMap.vm.$emit("map-was-initialized");
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.coordinates).toEqual([55.679138, 37.263663]);
    expect(YMap.props("coords")).toEqual([55.679138, 37.263663]);
  });
});
