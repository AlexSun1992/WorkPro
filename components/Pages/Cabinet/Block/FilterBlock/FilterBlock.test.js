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
  it("проверяем механзм переключения классов у кнопки 'Действующие'", async () => {
    createComponent(storaWithFilters, activeFilterItem);
    const getActivePolices = wrapper.find("[data-activeitems='3']");
    const getAllpolicesButton = wrapper.find("[data-activeitems='11']");
    expect(getAllpolicesButton.classes()).not.toContain("filter-checked");
    expect(getActivePolices.classes()).toContain("filter-checked");
  });
  //
  it("проверяем механзм переключения классов у кнопки 'Архивные'", async () => {
    createComponent(storaWithFilters, archiveFilterItem);
    const getAllpolicesButton = wrapper.find("[data-activeitems='11']");
    const getArchivePolices = wrapper.find("[data-activeitems='8']");
    expect(getAllpolicesButton.classes()).not.toContain("filter-checked");
    expect(getArchivePolices.classes()).toContain("filter-checked");
  });
});
