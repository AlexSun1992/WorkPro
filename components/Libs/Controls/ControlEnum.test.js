import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import ControlEnum from "./ControlEnum.vue";
import { dataProps, params, fetchForm, fetchDicDate, fetchDicDep } from "./ControlEnum.helper.fixuter";
import * as dataCard from "@/store/data_card";

const localVue = createLocalVue();

localVue.use(Vuex);
jest.mock("axios");
describe("ControlEnum", () => {
  let wrapper;
  let store;
  beforeEach(async () => {
    Vue.use(Vuex, BootstrapVue);
    store = new Vuex.Store({
      modules: {
        data_card: {
          ...dataCard,
          namespaced: true,
        },
      },
    });
    store.$axios = axios;
    jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: fetchForm,
    });

    await store.dispatch("data_card/fetchForm", params);
    jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({
        data: fetchDicDep,
      })
      .mockResolvedValueOnce({
        data: fetchDicDate,
      });

    await store.dispatch("data_card/fetchDic", dataProps);
  });
  afterEach(() => {
    wrapper.destroy();
    jest.resetAllMocks();
    jest.resetModules();
  });

  it("Поле не является связанным и не disabled", async () => {
    const props = JSON.parse(JSON.stringify(dataProps));
    props.fieldRelation = null;
    wrapper = mount(ControlEnum, {
      localVue,
      propsData: {
        data: props,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });
    expect(wrapper.find("input").attributes().disabled).toBe(undefined);
  });
  it("Поле является связанным и disabled", async () => {
    const props = JSON.parse(JSON.stringify(dataProps));
    props.fieldRelation = "IDINDEP_PSO_OFF";
    wrapper = mount(ControlEnum, {
      localVue,
      propsData: {
        data: props,
        edit: false,
      },
      mocks: {
        $store: store,
      },
    });
    expect(wrapper.find("input").attributes().disabled).toBe("disabled");
  });

  it("В поле ввели несуществующее значение и появилась ошибка", async () => {
    const props = JSON.parse(JSON.stringify(dataProps));
    props.fieldRelation = null;
    wrapper = mount(ControlEnum, {
      localVue,
      propsData: {
        data: props,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });
    await wrapper.find("input").setValue("fdп");

    expect(wrapper.find("b-form-invalid-feedback").text()).toContain('По фразе "fdп" ничего не найдено');
  });

  it("При клике на элемент из списка он отображается в поле", async () => {
    const props = JSON.parse(JSON.stringify(dataProps));
    props.fieldRelation = null;

    wrapper = mount(ControlEnum, {
      localVue,
      propsData: {
        data: props,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });

    await wrapper.find("input").trigger("click");
    await wrapper.find("input").setValue("");
    await wrapper.vm.$nextTick();
    await wrapper.find("#autocomplete-result-0").trigger("click");

    expect(wrapper.find("input").element.value).toEqual("450071, Башкортостан Респ, Уфа г, 50 лет СССР ул, д 27");
  });

  it("Если в props-ах есть значение, то оно отображается в поле", async () => {
    const props = JSON.parse(JSON.stringify(dataProps));
    props.value = {
      ID: 43,
      SNAME: "450071, Башкортостан Респ, Уфа г, 50 лет СССР ул, д 27",
      text: "450071, Башкортостан Респ, Уфа г, 50 лет СССР ул, д 27",
      value: 43,
    };
    wrapper = mount(ControlEnum, {
      localVue,
      propsData: {
        data: props,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });

    expect(wrapper.find("input").element.value).toEqual("450071, Башкортостан Респ, Уфа г, 50 лет СССР ул, д 27");
  });

  it("Если в props-ах нет значения, то в поле отображается placeholder", async () => {
    const props = JSON.parse(JSON.stringify(dataProps));
    props.value = {};
    wrapper = mount(ControlEnum, {
      localVue,
      propsData: {
        data: props,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });

    expect(wrapper.find("input").element.value).toEqual("");
    expect(wrapper.find("input").attributes().placeholder).toEqual("Выберите из списка");
  });

  it("Если required, то поле валидируется", async () => {
    const props = JSON.parse(JSON.stringify(dataProps));
    props.fieldRelation = null;
    props.required = true;
    wrapper = mount(ControlEnum, {
      localVue,
      propsData: {
        data: props,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });

    await wrapper.find("input").trigger("click");
    await wrapper.find("input").setValue("");
    await wrapper.find("input").trigger("blur");

    expect(wrapper.find("b-form-invalid-feedback").text()).toContain("Обязательно для заполнения");
  });

  it("Если не required, то поле не валидируется", async () => {
    const props = JSON.parse(JSON.stringify(dataProps));
    props.fieldRelation = null;
    props.required = false;
    props.options = false;
    wrapper = mount(ControlEnum, {
      localVue,
      propsData: {
        data: props,
        edit: true,
      },
      mocks: {
        $store: store,
      },
    });

    await wrapper.find("input").trigger("click");
    await wrapper.find("input").setValue("");
    await wrapper.find("input").trigger("blur");

    expect(wrapper.find("b-form-invalid-feedback").text()).toContain("");
  });
});
