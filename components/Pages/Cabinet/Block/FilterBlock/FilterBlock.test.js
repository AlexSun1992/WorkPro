import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import FilterBlock from "./FilterBlock.vue";

import {
  storaNoFilters,
  storaWithFilters,
} from "./FilterBlock.helper.fixtures";

describe("Пишем компонентные тесты на FilterBlock", () => {
  Vue.use(Vuex);
  let wrapper;

  const createComponent = (store) => {
    wrapper = shallowMount(FilterBlock, {
      propsData: {
        uniqueItems: ["Проекты", "Действующие", "Архивные"],
        propertyName: "SSTATUS",
        itemId: "712",
        showFilteredItemsCount: true,
        filterType: "radiobutton",
        allItemsButtonName: "Все полисы",
        showButtonAll: true,
      },

      store,
      mocks: {
        $route: {
          query: {},
        },
      },
    });
  };

  it("Проверяем отображение передаваемого property uniqueItems и наличие дефолтного класса у кнопки 'Все полисы'", () => {
    createComponent(storaNoFilters);
    const getPasswordSelector = "[data-activeitems='11']";
    const getAllpolicesButton = wrapper.find(getPasswordSelector);
    expect(getAllpolicesButton.classes()).toContain("filter-checked");
    expect(wrapper.text()).toContain(
      "Все полисы",
      "Архивные",
      "Действующие",
      "Проекты"
    );
  });

  it("Проверяем наличие атрибута disabled у кнопки фильтра 'Проекты',а также url(не должен содержать переданных фильтров)", () => {
    createComponent(storaNoFilters);

    const getButton = wrapper.find("[disabled='disabled']");

    expect(window.location.href).toBe("http://localhost/");
    expect(getButton.text()).toContain("Проекты");
  });

  it("проверяем механзм переключения классов у кнопки 'Действующие'", async () => {
    createComponent(storaWithFilters);
    const allpolicesButton = wrapper
      .findAll("button")
      .filter((node) => node.text().includes("Все полисы"))
      .at(0);
    const activePoliciesButton = wrapper
      .findAll("button")
      .filter((node) => node.text().includes("Действующие"))
      .at(0);

    await activePoliciesButton.trigger("click");

    expect(allpolicesButton.classes()).not.toContain("filter-checked");
    expect(activePoliciesButton.classes()).toContain("filter-checked");
  });

  it("проверяем механзм переключения классов у кнопки 'Архивные'", async () => {
    createComponent(storaWithFilters);
    const getAllpolicesButton = wrapper.find("[data-activeitems='11']");
    const getArchivePolices = wrapper.find("[data-activeitems='8']");

    await getArchivePolices.trigger("click");

    expect(getAllpolicesButton.classes()).not.toContain("filter-checked");
    expect(getArchivePolices.classes()).toContain("filter-checked");
  });

  it("проверяем изменения url после нажатия на кнопку 'Архивные'", async () => {
    createComponent(storaWithFilters);

    const activeButton = wrapper
      .findAll("button")
      .filter((node) => node.text().includes("Архивные"))
      .at(0);

    await activeButton.trigger("click");

    const getUrlAfterClick = new URL(window.location.href);
    expect(getUrlAfterClick.searchParams.has("SSTATUS")).toBe(true);
    expect(getUrlAfterClick.searchParams.get("SSTATUS")).toBe("Архивные");
  });

  it("проверяем изменения url после нажатия на кнопку'Действующие'", async () => {
    createComponent(storaWithFilters);

    const activeButton = wrapper
      .findAll("button")
      .filter((node) => node.text().includes("Действующие"))
      .at(0);

    await activeButton.trigger("click");

    const getUrlAfterClick = new URL(window.location.href);
    expect(getUrlAfterClick.searchParams.has("SSTATUS")).toBe(true);
    expect(getUrlAfterClick.searchParams.get("SSTATUS")).toBe("Действующие");
  });
});
