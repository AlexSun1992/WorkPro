import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import FilterBlock from "./FilterBlock.vue";

import {
  storaNoFilters,
  filter,
  storaWithFilters,
  activeFilterItem,
  archiveFilterItem,
} from "./FilterBlock.helper.fixtures";

describe("Пишем компонентные тесты на FilterBlock", () => {
  Vue.use(Vuex);
  let wrapper;

  const createComponent = (store, filter) => {
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
          query: {
            filters: filter,
          },
        },
      },
    });
  };

  it("Проверяем отображение передаваемого property uniqueItems и наличие дефолтного класса у кнопки 'Все полисы'", () => {
    createComponent(storaNoFilters, filter);
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
  ///
  it("Проверяем наличие атрибута disabled у кнопки фильтра 'Проекты',а также url(не должен содержать переданных фильтров)", () => {
    createComponent(storaNoFilters, filter);
    const getButton = wrapper.find("[disabled='disabled']");
    expect(window.location.href).toBe("http://localhost/");
    expect(getButton.text()).toContain("Проекты");
  });
  ///
  it("проверяем механзм переключения классов у кнопки 'Действующие'", () => {
    createComponent(storaWithFilters, activeFilterItem);
    const getActivePolices = wrapper.find("[data-activeitems='3']");
    const getAllpolicesButton = wrapper.find("[data-activeitems='11']");
    expect(getAllpolicesButton.classes()).not.toContain("filter-checked");
    expect(getActivePolices.classes()).toContain("filter-checked");
  });
  //
  it("проверяем механзм переключения классов у кнопки 'Архивные'", () => {
    createComponent(storaWithFilters, archiveFilterItem);
    const getAllpolicesButton = wrapper.find("[data-activeitems='11']");
    const getArchivePolices = wrapper.find("[data-activeitems='8']");
    getArchivePolices.trigger("click");
    expect(getAllpolicesButton.classes()).not.toContain("filter-checked");
    expect(getArchivePolices.classes()).toContain("filter-checked");
  });
  //
  it("проверяем изменения url после нажатия на кнопку 'Архивные'", () => {
    createComponent(storaWithFilters, archiveFilterItem);
    const getUrlAfterClick = window.location.href;
    expect(getUrlAfterClick).toContain("propertyName");
    expect(getUrlAfterClick).toContain("filter");
  });
  //
  it("проверяем изменения url после нажатия на кнопку'Действующие'", () => {
    createComponent(storaWithFilters, activeFilterItem);
    const getUrlAfterClick = window.location.href;
    expect(getUrlAfterClick).toContain("propertyName");
    expect(getUrlAfterClick).toContain("filter");
  });
});
