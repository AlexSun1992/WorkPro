import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import ControlCustomComboboxJSON from "@/components/Libs/Controls/ControlCustomComboboxJSON/ControlCustomComboboxJSON";
import ControlDropdownBase from "@/components/Libs/Controls/ControlDropdownBase";
import { comboboxPropsDataJSON } from "./controlCustomCombobox.fixtures";
import SearchBox from "@/components/Libs/Controls/ControlTokenBox/SearchBox";

jest.useFakeTimers();

async function openDropdown(wrapper) {
  const dropdown = wrapper.findComponent(ControlDropdownBase);

  dropdown.vm.$emit("click-trigger", { target: wrapper.element });

  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
}

function makeData(overrides = {}) {
  return {
    ...comboboxPropsDataJSON,
    ...overrides,
  };
}

function getWrapper(propsData = {}) {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const fieldData = propsData.data ?? makeData();

  const store = new Vuex.Store({
    modules: {
      data_card: {
        namespaced: true,
        getters: {
          getDataFieldByFieldId: () => () => fieldData,
          getOneToManyDataFieldByFieldId: () => () => fieldData,
          getDataFieldsByNames: () => () => [],
          getForm: () => () => [],
          getOneToManyBlock: () => () => [],
        },
        actions: {
          updateFiltersData: jest.fn(() => Promise.resolve()),
          fetchOptionsByJSON: jest.fn(() => Promise.resolve()),
        },
      },
    },
  });

  return mount(ControlCustomComboboxJSON, {
    localVue,
    store,
    propsData: {
      data: fieldData,
      edit: true,
      oneToManyData: {},
      ...propsData,
    },
    mocks: {
      $route: {
        params: {
          zone: "free",
        },
      },
    },
    components: {
      ControlDropdownBase,
      SearchBox,
    },
  });
}

describe("ControlCustomComboboxJSON", () => {
  it("renders current value text when value exists", () => {
    const wrapper = getWrapper();

    expect(wrapper.text()).toContain("ПТС");
  });

  it("renders placeholder when value is empty", () => {
    const wrapper = getWrapper({
      data: makeData({ value: null }),
    });

    expect(wrapper.text()).toContain("Выбрать");
  });

  it("gets options from store field by fieldId", () => {
    const wrapper = getWrapper();

    expect(wrapper.vm.options).toEqual(comboboxPropsDataJSON.options);
  });

  it("filters available options by search query", async () => {
    const wrapper = getWrapper();

    await wrapper.setData({ searchQuery: "гин" });

    expect(wrapper.vm.availableOptions).toEqual([
      expect.objectContaining({
        SNAME: "Гинеколог",
      }),
    ]);
  });

  it("opens dropdown by ControlDropdownBase click-trigger", async () => {
    const wrapper = getWrapper();

    await openDropdown(wrapper);

    expect(wrapper.vm.isOpen).toBe(true);
  });

  it("does not open dropdown when disabled", async () => {
    const wrapper = getWrapper({
      edit: false,
    });

    await openDropdown(wrapper);

    expect(wrapper.vm.isOpen).toBe(false);
  });

  it("emits update with normalized JSON value on submit", () => {
    const wrapper = getWrapper({
      data: makeData({ value: null }),
    });

    const item = comboboxPropsDataJSON.options[0];

    wrapper.vm.handleSubmit(item);

    expect(wrapper.emitted("update")[0][0]).toEqual({
      fieldId: 68150,
      name: "SSPECIALIST",
      value: {
        value: item,
        text: "Аллерголог",
      },
    });
  });

  it("does not emit update if submitted value equals current value", () => {
    const item = comboboxPropsDataJSON.value.value;

    const wrapper = getWrapper({
      data: makeData({
        value: {
          value: item,
          text: "ПТС",
        },
      }),
    });

    wrapper.vm.handleSubmit(item);

    expect(wrapper.emitted("update")).toBeUndefined();
  });

  it("dispatches updateFiltersData after submit", () => {
    const wrapper = getWrapper();
    const dispatchSpy = jest.spyOn(wrapper.vm.$store, "dispatch");

    wrapper.vm.handleSubmit(comboboxPropsDataJSON.options[0]);

    expect(dispatchSpy).toHaveBeenCalledWith("data_card/updateFiltersData", {
      filters: expect.objectContaining({
        SSPECIALIST: "Аллерголог",
      }),
      index: undefined,
    });
  });

  it("closes dropdown", async () => {
    const wrapper = getWrapper();

    await wrapper.setData({
      isOpen: true,
      isSearching: true,
      searchQuery: "test",
    });

    await wrapper.vm.closeDropdown();

    expect(wrapper.vm.isOpen).toBe(false);
    expect(wrapper.vm.isSearching).toBe(false);
  });

  it("sets required error when closing empty required combobox", async () => {
    const wrapper = getWrapper({
      data: makeData({
        value: null,
        required: true,
      }),
    });

    await wrapper.setData({
      searchQuery: "",
      isOpen: true,
    });

    await wrapper.vm.closeDropdown();

    expect(wrapper.vm.isErr).toBe(false);
    expect(wrapper.vm.validationErrorText).toBe("Обязательно для заполнения");
  });

  it("returns valid class from data", () => {
    const validWrapper = getWrapper({
      data: makeData({
        required: true,
        state: true,
      }),
    });

    const invalidWrapper = getWrapper({
      data: makeData({
        required: true,
        state: false,
      }),
    });

    expect(validWrapper.vm.validClass).toBe("is-valid");
    expect(invalidWrapper.vm.validClass).toBe("is-invalid");
  });

  it("returns invalid class from isErr=false", async () => {
    const wrapper = getWrapper({
      data: makeData({
        required: true,
        state: null,
      }),
    });

    await wrapper.setData({ isErr: false });

    expect(wrapper.vm.validClass).toBe("is-invalid");
  });

  it("fetches options with expected payload", async () => {
    const fieldData = makeData();
    const wrapper = getWrapper({
      data: fieldData,
    });

    wrapper.vm.$route.params.zone = "test-zone";

    const dispatchSpy = jest.spyOn(wrapper.vm.$store, "dispatch");

    await wrapper.vm.getOptions("test");

    expect(dispatchSpy).toHaveBeenCalledWith("data_card/fetchOptionsByJSON", {
      zone: "test-zone",
      field: fieldData,
      oneToManyData: {},
      value: "test",
    });

    expect(wrapper.vm.isLoading).toBe(false);
  });
});
