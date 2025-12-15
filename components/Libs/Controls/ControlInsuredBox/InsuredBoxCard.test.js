import Vue from "vue";
import Vuex from "vuex";
import { BootstrapVue } from "bootstrap-vue";
import { shallowMount } from "@vue/test-utils";
import InsuredBoxCard from "./InsuredBoxCard.vue";
import { saleExist, noSale, dataProperty, bestSeller } from "./InsuredBoxCard.fixtures";

describe("InsuredBoxCard", () => {
  beforeEach(() => {
    Vue.use(Vuex, BootstrapVue);
  });
  const createComponent = (data) => shallowMount(InsuredBoxCard, {
      propsData: {
        data: { ...dataProperty },
        index: 1,
      },
      computed: {
        getPolicyCardOptions() {
          return data;
        },
      },
    });
  it("Наличие метки 'Хит продаж'", async () => {
    const wrapper = createComponent(bestSeller);
    expect(wrapper.text()).toContain("Хит продаж");
  });
  it("Наличие скидки", async () => {
    const wrapper = createComponent(saleExist);
    const sTag = wrapper.find(".box-price + .box-price");
    expect(sTag.exists()).toBe(true);
    expect(sTag.text().trim()).toBe("7 500 ₽");
    expect(wrapper).not.toBe(null);
  });
  it("Отсутствие скидки", () => {
    const wrapper = createComponent(noSale);
    const sTag = wrapper.find(".box-price .box-price");
    expect(sTag.exists()).toBe(false);
    // const span = wrapper.find("span");
    // expect(span.exists()).toBe(true);
    // expect(wrapper.text()).not.toContain("Хит продаж");
  });
});
