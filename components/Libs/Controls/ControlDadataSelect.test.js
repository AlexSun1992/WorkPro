import { mount, createLocalVue } from "@vue/test-utils";
import flushPromises from "flush-promises";
import ControlDadataSelect from "./ControlDadataSelect.vue";
import ControlDropdownBase from "@/components/Libs/Controls/ControlDropdownBase";
import { getQueryParams, isFieldFIONotValid } from "./controlDadataSelect.helper";

jest.mock("./controlDadataSelect.helper", () => ({
  getQueryParams: jest.fn(),
  isFieldFIONotValid: jest.fn(),
}));

const localVue = createLocalVue();

const VEHICLE_SUGGESTIONS = [
  {
    value: "BMW X5",
    data: {
      brand_model_modification: "BMW X5",
    },
  },
  {
    value: "BMW X3M",
    data: {
      brand_model_modification: "BMW X3M",
    },
  },
  {
    value: "BMW X7",
    data: {
      brand_model_modification: "BMW X7",
    },
  },
  {
    value: "LADA VESTA",
    data: {
      brand_model_modification: "LADA VESTA",
    },
  },
];

const FIO_SUGGESTIONS = [
  {
    value: "Иванов",
    data: {
      fio_id: "ivanov_id",
    },
  },
  {
    value: "Петров",
    data: {
      fio_id: "petrov_id",
    },
  },
];

function makeData(overrides = {}) {
  return {
    fieldId: 1,
    label: "Тест",
    name: "SVEHICLE_MODEL",
    placeholder: "Выберите",
    readonly: false,
    required: false,
    value: "",
    state: null,
    error: "",
    helpText: "",
    ...overrides,
  };
}

function mountComponent(propsData = {}) {
  return mount(ControlDadataSelect, {
    localVue,
    propsData: {
      data: makeData(),
      edit: true,
      ...propsData,
    },
    stubs: {
      "vue-easy-tooltip": true,
    },
  });
}

async function openDropdown(wrapper) {
  const dropdown = wrapper.findComponent(ControlDropdownBase);
  dropdown.vm.$emit("click-trigger", { target: wrapper.element });
  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
}

async function typeSearch(wrapper, value) {
  const input = wrapper.find("input.combobox-search-input");
  expect(input.exists()).toBe(true);

  await input.setValue(value);
  await input.trigger("input");
}

async function runDebouncedSearch(wrapper) {
  jest.advanceTimersByTime(300);
  await flushPromises();
  await wrapper.vm.$nextTick();
}

function getRenderedItems(wrapper) {
  return wrapper.findAll("li.item").wrappers.map((w) => w.text());
}

describe("ControlDadataSelect", () => {
  beforeEach(() => {
    jest.useFakeTimers();

    isFieldFIONotValid.mockImplementation(() => false);

    getQueryParams.mockImplementation((fieldName, input) => {
      if (fieldName.includes("SVEHICLE_MODEL")) {
        return {
          query: "vehicle",
          body: { query: input },
          id: null,
        };
      }

      return {
        query: "fio",
        body: { query: input },
        id: "fio_id",
      };
    });

    global.fetch = jest.fn((url, options) => {
      const { query } = JSON.parse(options.body);
      const source = url.includes("/vehicle") ? VEHICLE_SUGGESTIONS : FIO_SUGGESTIONS;

      const filtered = source.filter((item) => item.value.toLowerCase().includes(String(query).toLowerCase()));

      return Promise.resolve({
        json: () =>
          Promise.resolve({
            suggestions: filtered,
          }),
      });
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.resetAllMocks();
  });

  describe("render", () => {
    it("рендерит label и placeholder", () => {
      const wrapper = mountComponent({
        data: makeData({
          label: "Марка/модель",
          placeholder: "Выберите модель",
        }),
      });

      expect(wrapper.text()).toContain("Марка/модель");
      expect(wrapper.text()).toContain("Выберите модель");
    });

    it("рендерит helpText", () => {
      const wrapper = mountComponent({
        data: makeData({
          helpText: "<b>Подсказка</b>",
        }),
      });

      expect(wrapper.text()).toContain("(?)");
    });

    it("не открывает dropdown если disabled из-за readonly", async () => {
      const wrapper = mountComponent({
        data: makeData({ readonly: true }),
        edit: true,
      });

      const dropdown = wrapper.findComponent(ControlDropdownBase);
      dropdown.vm.$emit("click-trigger", { target: wrapper.element });
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("не открывает dropdown если edit = false", async () => {
      const wrapper = mountComponent({
        data: makeData({ readonly: false }),
        edit: false,
      });

      const dropdown = wrapper.findComponent(ControlDropdownBase);
      dropdown.vm.$emit("click-trigger", { target: wrapper.element });
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("открывает dropdown через click-trigger", async () => {
      const wrapper = mountComponent();
      await openDropdown(wrapper);

      expect(wrapper.vm.isOpen).toBe(true);
      expect(wrapper.find(".combobox-search-input").exists()).toBe(true);
    });
  });

  describe("search", () => {
    it("ищет опции по searchQuery с debounce", async () => {
      const wrapper = mountComponent();
      await openDropdown(wrapper);

      await typeSearch(wrapper, "bmw x5");
      await runDebouncedSearch(wrapper);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(wrapper.vm.options).toHaveLength(1);

      const items = getRenderedItems(wrapper);
      expect(items).toEqual(["BMW X5"]);
    });

    it("поиск регистронезависим", async () => {
      const wrapper = mountComponent();
      await openDropdown(wrapper);
      await typeSearch(wrapper, "bmw");
      await runDebouncedSearch(wrapper);

      const items = getRenderedItems(wrapper);
      expect(items).toEqual(expect.arrayContaining(["BMW X5", "BMW X3M", "BMW X7"]));
      expect(items).not.toContain("LADA VESTA");
    });

    it("показывает 'Нет подходящих значений' если результатов нет", async () => {
      const wrapper = mountComponent();
      await openDropdown(wrapper);

      await typeSearch(wrapper, "zzz");
      await runDebouncedSearch(wrapper);

      expect(wrapper.vm.options).toEqual([]);
      expect(wrapper.text()).toContain("Нет подходящих значений");
    });

    it("очищает options если input короче 1 символа", async () => {
      const wrapper = mountComponent();
      wrapper.setData({
        options: [{ value: "BMW X5", data: {} }],
      });

      const result = await wrapper.vm.search("");

      expect(result).toEqual([]);
      expect(wrapper.vm.options).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("сбрасывает предыдущий debounce timeout при новом вводе", async () => {
      const wrapper = mountComponent();
      await openDropdown(wrapper);

      await typeSearch(wrapper, "bm");
      await typeSearch(wrapper, "bmw");
      await typeSearch(wrapper, "bmw x5");

      jest.advanceTimersByTime(299);
      await flushPromises();

      expect(global.fetch).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      await flushPromises();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(wrapper.vm.options).toHaveLength(1);
      expect(getRenderedItems(wrapper)).toEqual(["BMW X5"]);
    });
  });

  describe("selection", () => {
    it("выбор vehicle item закрывает dropdown и эмитит object value", async () => {
      const wrapper = mountComponent({
        data: makeData({
          name: "SVEHICLE_MODEL",
        }),
      });

      await openDropdown(wrapper);
      await typeSearch(wrapper, "bmw x5");
      await runDebouncedSearch(wrapper);

      const item = wrapper.findAll("li.item").wrappers.find((w) => w.text() === "BMW X5");
      expect(item).toBeTruthy();

      await item.trigger("mousedown");

      expect(wrapper.vm.isOpen).toBe(false);

      const emitted = wrapper.emitted("update");
      expect(emitted).toBeTruthy();

      const lastPayload = emitted[emitted.length - 1][0];
      expect(lastPayload).toEqual({
        fieldId: 1,
        name: "SVEHICLE_MODEL",
        value: {
          brand_model_modification: "BMW X5",
        },
      });
    });

    it("выбор non-vehicle и не FIO item эмитит value с prefix|value", async () => {
      const wrapper = mountComponent({
        data: makeData({
          name: "TEST",
          value: "",
          id: "fio_id",
        }),
      });

      await openDropdown(wrapper);
      await typeSearch(wrapper, "иван");
      await runDebouncedSearch(wrapper);

      const item = wrapper.findAll("li.item").wrappers.find((w) => w.text() === "Иванов");
      expect(item).toBeTruthy();

      await item.trigger("mousedown");

      await wrapper.vm.$nextTick();

      const emitted = wrapper.emitted("update");
      expect(emitted).toBeTruthy();

      const lastPayload = emitted[emitted.length - 1][0];
      expect(lastPayload).toEqual({
        fieldId: 1,
        name: "TEST",
        value: "ivanov_id|Иванов",
      });
    });

    it("closeDropdown выбирает exactMatch", async () => {
      const wrapper = mountComponent();
      wrapper.setData({
        isOpen: true,
        isSearching: true,
        searchQuery: "BMW X5",
        options: [...VEHICLE_SUGGESTIONS],
      });

      wrapper.vm.closeDropdown();
      await wrapper.vm.$nextTick();

      const emitted = wrapper.emitted("update");
      expect(emitted).toBeTruthy();

      const lastPayload = emitted[emitted.length - 1][0];
      expect(lastPayload.value.brand_model_modification).toBe("BMW X5");
      expect(wrapper.vm.isFieldValid).toBe(true);
      expect(wrapper.vm.isOpen).toBe(false);
    });

    it("closeDropdown очищает searchQuery если current value отсутствует", async () => {
      const wrapper = mountComponent({
        data: makeData({
          value: "",
        }),
      });

      wrapper.setData({
        isOpen: true,
        isSearching: true,
        searchQuery: "не найдено",
        options: [],
      });

      wrapper.vm.closeDropdown();
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.searchQuery).toBe("");
      expect(wrapper.emitted("update")).toBeFalsy();
    });
  });

  describe("mounted behavior", () => {
    it("на mounted для vehicle string value ищет exact match и эмитит update", async () => {
      const wrapper = mountComponent({
        data: makeData({
          name: "SVEHICLE_MODEL",
          value: "BMW X5",
        }),
      });

      await flushPromises();

      expect(global.fetch).toHaveBeenCalledTimes(1);

      const emitted = wrapper.emitted("update");
      expect(emitted).toBeTruthy();

      const firstPayload = emitted[0][0];
      expect(firstPayload).toEqual({
        fieldId: 1,
        name: "SVEHICLE_MODEL",
        value: {
          brand_model_modification: "BMW X5",
        },
      });

      expect(wrapper.vm.isFieldValid).toBe(true);
    });

    it("на mounted не эмитит update если exact match не найден", async () => {
      const wrapper = mountComponent({
        data: makeData({
          name: "SVEHICLE_MODEL",
          value: "BMW X6",
        }),
      });

      await flushPromises();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(wrapper.emitted("update")).toBeFalsy();
      expect(wrapper.vm.isFieldValid).toBe(null);
    });
  });

  describe("FIO edge cases", () => {
    it("не делает fetch если FIO input начинается с пробела", async () => {
      const wrapper = mountComponent({
        data: makeData({
          name: "FIRSTNAME",
        }),
      });

      const result = await wrapper.vm.search(" Иван");

      expect(result).toEqual([]);
      expect(wrapper.vm.options).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("не делает fetch если FIO невалиден", async () => {
      isFieldFIONotValid.mockReturnValue(true);

      const wrapper = mountComponent({
        data: makeData({
          name: "FIRSTNAME",
        }),
      });

      const result = await wrapper.vm.search("Ив@н");

      expect(result).toEqual([]);
      expect(wrapper.vm.options).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe("computed", () => {
    it("getCurrentValue возвращает label из строки c prefix для vehicle", () => {
      const wrapper = mountComponent({
        data: makeData({
          value: "110230|ВАЗ 2114",
        }),
      });

      expect(wrapper.vm.getCurrentValue).toBe("ВАЗ 2114");
    });

    it("getCurrentValue возвращает brand_model_modification для vehicle object", () => {
      const wrapper = mountComponent({
        data: makeData({
          value: {
            brand_model_modification: "BMW X5",
          },
        }),
      });

      expect(wrapper.vm.getCurrentValue).toBe("BMW X5");
    });

    it("inputDisplayValue показывает searchQuery когда dropdown открыт", async () => {
      const wrapper = mountComponent();

      wrapper.setData({
        isOpen: true,
        searchQuery: "BMW X5",
      });

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.inputDisplayValue).toBe("BMW X5");
    });

    it("validClass возвращает is-valid при isFieldValid=true", () => {
      const wrapper = mountComponent();
      wrapper.setData({ isFieldValid: true });

      expect(wrapper.vm.validClass).toBe("is-valid");
    });

    it("validClass возвращает is-invalid при isFieldValid=false", () => {
      const wrapper = mountComponent();
      wrapper.setData({ isFieldValid: false });

      expect(wrapper.vm.validClass).toBe("is-invalid");
    });

    it("validClass берет значение из data.state если local validation не выставлена", () => {
      const wrapper = mountComponent({
        data: makeData({
          state: false,
        }),
      });

      expect(wrapper.vm.validClass).toBe("is-invalid");
    });
  });
});
