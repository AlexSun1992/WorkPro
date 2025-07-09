import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import FilterBlock from "./FilterBlock.vue";

import { storeNoFilters, storeWithFilters } from "./FilterBlock.helper.fixtures";

const defaultProps = {
  uniqueItems: ["Проекты", "Действующие", "Архивные"],
  propertyName: "SSTATUS",
  itemId: "712",
  showFilteredItemsCount: true,
  filterType: "radiobutton",
  allItemsButtonName: "Все полисы",
  showButtonAll: true,
  isMultiSelect: true,
};

Vue.use(Vuex);
let wrapper;

const createComponent = (store, propsData = defaultProps) => {
  wrapper = shallowMount(FilterBlock, {
    propsData,
    store,
    mocks: {
      $route: {
        query: {},
      },
    },
  });
};

describe("Пишем компонентные тесты на FilterBlock", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("Проверяем наличие ошибок при пустых пропсах", async () => {
    const emptyProps = {};
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    createComponent(storeNoFilters(), emptyProps);
    expect(consoleErrorSpy).toBeCalledTimes(3);
    consoleErrorSpy.mockRestore();
  });

  it("Проверяем отображение передаваемого property uniqueItems и наличие дефолтного класса у кнопки 'Все полисы'", () => {
    const errorProps = {
      uniqueItems: [],
      propertyName: "ERROR-SSTATUS",
      itemId: "ERROR-712",
      showFilteredItemsCount: true,
      filterType: "error-radiobutton",
      allItemsButtonName: "Все полисы",
      showButtonAll: true,
    };

    createComponent(storeNoFilters(), errorProps);
    expect(wrapper.text()).toContain("Все полисы");
  });

  it("Проверяем отображение передаваемого property uniqueItems и наличие дефолтного класса у кнопки 'Все полисы'", () => {
    createComponent(storeNoFilters());
    const getPasswordSelector = "[data-activeitems='11'] > button";
    const getAllpolicesButton = wrapper.find(getPasswordSelector);
    expect(getAllpolicesButton.classes()).toContain("filter-checked");
    expect(wrapper.text()).toContain("Все полисы", "Архивные", "Действующие", "Проекты");
  });

  it("Проверяем отображение передаваемого property uniqueItems c наличием isOptional  { text: Проекты, isOptional: true } и  отсутствием элементов, которые она может отфильтровать", () => {
    const createNewComponent = (store) => {
      wrapper = shallowMount(FilterBlock, {
        propsData: {
          uniqueItems: [{ text: "Проекты", isOptional: true }, "Действующие", "Архивные"],
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

    createNewComponent(storeNoFilters());
    expect(wrapper.text()).toContain("Все полисы");
    expect(wrapper.text()).toContain("Архивные");
    expect(wrapper.text()).toContain("Действующие");
    expect(wrapper.text()).not.toContain("Проекты");
  });

  it("Проверяем отображение передаваемого property uniqueItems c наличием isOptional  { text: Проекты, isOptional: false } и  отсутствием элементов, которые она может отфильтровать", () => {
    const createNewComponent = (store) => {
      wrapper = shallowMount(FilterBlock, {
        propsData: {
          uniqueItems: [{ text: "Проекты", isOptional: false }, "Действующие", "Архивные"],
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

    createNewComponent(storeNoFilters());
    expect(wrapper.text()).toContain("Все полисы");
    expect(wrapper.text()).toContain("Архивные");
    expect(wrapper.text()).toContain("Действующие");
    expect(wrapper.text()).toContain("Проекты");
  });

  it("Проверяем отображение передаваемого property uniqueItems c наличием isOptional false на всех кнопках ", () => {
    const createNewComponent = (store) => {
      wrapper = shallowMount(FilterBlock, {
        propsData: {
          uniqueItems: [
            { text: "Проекты", isOptional: false },
            { text: "Действующие", isOptional: false },
            { text: "Архивные", isOptional: false },
          ],
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

    createNewComponent(storeNoFilters());
    expect(wrapper.text()).toContain("Все полисы");
    expect(wrapper.text()).toContain("Архивные");
    expect(wrapper.text()).toContain("Действующие");
    expect(wrapper.text()).toContain("Проекты");
  });

  it("Проверяем отображение передаваемого property uniqueItems c наличием isOptional true на всех кнопках ", () => {
    const createNewComponent = (store) => {
      wrapper = shallowMount(FilterBlock, {
        propsData: {
          uniqueItems: [
            { text: "Проекты", isOptional: true },
            { text: "Действующие", isOptional: true },
            { text: "Архивные", isOptional: true },
          ],
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

    createNewComponent(storeNoFilters());
    expect(wrapper.text()).toContain("Все полисы");
    expect(wrapper.text()).toContain("Архивные");
    expect(wrapper.text()).toContain("Действующие");
    expect(wrapper.text()).not.toContain("Проекты");
  });

  it("Проверяем наличие атрибута disabled у кнопки фильтра 'Проекты',а также url(не должен содержать переданных фильтров)", () => {
    createComponent(storeNoFilters());

    const getButton = wrapper.find("[disabled='disabled']");

    expect(window.location.href).toBe("http://localhost/");
    expect(getButton.text()).toContain("Проекты");
  });

  it("проверяем механзм переключения классов у кнопки 'Действующие'", async () => {
    createComponent(storeWithFilters());
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
    createComponent(storeWithFilters());
    const getAllpolicesButton = wrapper.find("[data-activeitems='11']");
    const getArchivePolices = wrapper.find("[data-activeitems='8']");

    await getArchivePolices.trigger("click");

    expect(getAllpolicesButton.classes()).not.toContain("filter-checked");
    expect(getArchivePolices.classes()).toContain("filter-checked");
  });

  it("проверяем изменения url после нажатия на кнопку 'Архивные'", async () => {
    createComponent(storeWithFilters());

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
    createComponent(storeWithFilters());

    const activeButton = wrapper
      .findAll("button")
      .filter((node) => node.text().includes("Действующие"))
      .at(0);
    console.log(new URL(window.location.href).searchParams.get("SSTATUS"));
    await activeButton.trigger("click");
    const getUrlAfterClick = new URL(window.location.href);
    expect(getUrlAfterClick.searchParams.has("SSTATUS")).toBe(true);
    expect(getUrlAfterClick.searchParams.get("SSTATUS")).toBe("Действующие");
  });
});
