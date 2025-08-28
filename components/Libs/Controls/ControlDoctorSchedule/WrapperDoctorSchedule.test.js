import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { mount } from "@vue/test-utils";

import CardDoctorShedule from "./CardDoctorSchedule";

import { propsData } from "./CardDoctorShedule.helper.fixtures";
import * as menu from "@/store/menu";
import * as dataCard from "@/store/data_card";

jest.mock("axios");

describe("CardPage", () => {
  Vue.use(Vuex);
  Vue.use(Vuex);
  let store;
  let wrapper;

  beforeEach(async () => {
    store = new Vuex.Store({
      modules: {
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
    wrapper = mount(CardDoctorShedule, {
      propsData,
      modules: {
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
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("При клике на енопку '>' даты сдвигаются на 1 элемент, если всего лементов 5  ", async () => {
    await wrapper.vm.$nextTick();

    console.log(wrapper.find(".btn-doc-time").text(), "btn-doc-time");
    await wrapper.find(".btn-doc-time").trigger("click");

    await wrapper.vm.$nextTick();

    console.log(wrapper.html(), "html");
  });
});
