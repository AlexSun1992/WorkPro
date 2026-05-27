import { mount, createLocalVue } from "@vue/test-utils";
import flushPromises from "flush-promises";
import ControlDadataSelect2 from "./ControlDadataSelect2";
import ControlDropdownBase from "@/components/Libs/Controls/ControlDropdownBase";
import { getQueryParams } from "./controlDadataSelect.helper";

jest.mock("./controlDadataSelect.helper", () => ({
  getQueryParams: jest.fn(),
}));

const localVue = createLocalVue();

const VEHICLE_SUGGESTIONS = [
  {
    value: "BMW X5",
    data: {
      brand_model_modification: "BMW X5",
      model_id: "bmw_x5_id",
    },
  },
  {
    value: "BMW X3M",
    data: {
      brand_model_modification: "BMW X3M",
      model_id: "bmw_x3m_id",
    },
  },
  {
    value: "BMW X7",
    data: {
      brand_model_modification: "BMW X7",
      model_id: "bmw_x7_id",
    },
  },
  {
    value: "LADA VESTA",
    data: {
      brand_model_modification: "LADA VESTA",
      model_id: "lada_vesta_id",
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
  return mount(ControlDadataSelect2, {
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

async function runDebouncedSearch() {
  jest.advanceTimersByTime(300);
  await flushPromises();
}

function getRenderedItems(wrapper) {
  return wrapper.findAll("li.item").wrappers.map((w) => w.text());
}

describe("ControlDadataSelect", () => {
  beforeEach(() => {
    jest.useFakeTimers();

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

    it("рендерит дефолтный placeholder если он не передан", () => {
      const wrapper = mountComponent({
        data: makeData({
          placeholder: undefined,
        }),
      });

      expect(wrapper.vm.placeholder).toBe("Выберите из списка");
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

    it("показывает readonly result", () => {
      const wrapper = mountComponent({
        data: makeData({
          readonly: true,
          value: "Текущее значение",
        }),
      });

      expect(wrapper.find(".result").exists()).toBe(true);
      expect(wrapper.find(".result").text()).toBe("Текущее значение");
    });

    it("показывает invalid feedback при data.state=false", () => {
      const wrapper = mountComponent({
        data: makeData({
          state: false,
          error: "Поле обязательно",
        }),
      });

      const error = wrapper.find(".invalid-feedback.d-block");
      expect(error.exists()).toBe(true);
      expect(error.text()).toBe("Поле обязательно");
    });

    it("показывает дефолтный invalid feedback при data.state=false и пустом error", () => {
      const wrapper = mountComponent({
        data: makeData({
          state: false,
          error: "",
        }),
      });

      const error = wrapper.find(".invalid-feedback.d-block");
      expect(error.exists()).toBe(true);
      expect(error.text()).toBe("Обязательно для заполнения");
    });
  });

  describe("search", () => {
    it("ищет опции по searchQuery с debounce", async () => {
      const wrapper = mountComponent();
      await openDropdown(wrapper);

      await typeSearch(wrapper, "bmw x5");
      await runDebouncedSearch();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(wrapper.vm.options).toHaveLength(1);

      const items = getRenderedItems(wrapper);
      expect(items).toEqual(["BMW X5"]);
    });

    it("поиск регистронезависим", async () => {
      const wrapper = mountComponent();
      await openDropdown(wrapper);

      await typeSearch(wrapper, "bmw");
      await runDebouncedSearch();

      const items = getRenderedItems(wrapper);
      expect(items).toEqual(expect.arrayContaining(["BMW X5", "BMW X3M", "BMW X7"]));
      expect(items).not.toContain("LADA VESTA");
    });

    it("показывает 'Нет подходящих значений' если результатов нет", async () => {
      const wrapper = mountComponent();
      await openDropdown(wrapper);

      await typeSearch(wrapper, "zzz");
      await runDebouncedSearch();

      expect(wrapper.vm.options).toEqual([]);
      expect(wrapper.text()).toContain("Нет подходящих значений");
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

    it("search сохраняет id из getQueryParams", async () => {
      const wrapper = mountComponent({
        data: makeData({
          name: "FIRSTNAME",
        }),
      });

      await wrapper.vm.search("иван");
      await flushPromises();

      expect(wrapper.vm.id).toBe("fio_id");
    });

    it("search выставляет isSearching=false после завершения", async () => {
      const wrapper = mountComponent();

      wrapper.setData({ isSearching: true });
      await wrapper.vm.search("bmw");
      await flushPromises();

      expect(wrapper.vm.isSearching).toBe(false);
    });
  });

  describe("selection", () => {
    it("выбор item закрывает dropdown и эмитит object value если id нет", async () => {
      const wrapper = mountComponent({
        data: makeData({
          name: "SVEHICLE_MODEL",
        }),
      });

      await openDropdown(wrapper);
      await typeSearch(wrapper, "bmw x5");
      await runDebouncedSearch();

      const item = wrapper.findAll("li.item").wrappers.find((w) => w.text() === "BMW X5");
      expect(item).toBeTruthy();

      await item.trigger("mousedown");
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.isOpen).toBe(false);

      const emitted = wrapper.emitted("update");
      expect(emitted).toBeTruthy();

      const lastPayload = emitted[emitted.length - 1][0];
      expect(lastPayload).toEqual({
        fieldId: 1,
        name: "SVEHICLE_MODEL",
        value: {
          value: "BMW X5",
          data: {
            brand_model_modification: "BMW X5",
            model_id: "bmw_x5_id",
          },
        },
      });
    });

    it("выбор item эмитит value с prefix|value если id есть", async () => {
      const wrapper = mountComponent({
        data: makeData({
          name: "TEST",
          value: "",
        }),
      });

      await openDropdown(wrapper);
      await typeSearch(wrapper, "иван");
      await runDebouncedSearch();

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

    it("handleSubmit поддерживает fallback к пустому prefix если id есть, но значения в data нет", () => {
      const wrapper = mountComponent({
        data: makeData({
          name: "TEST",
        }),
      });

      wrapper.setData({ id: "missing_id" });

      wrapper.vm.handleSubmit({
        value: "Иванов",
        data: {},
      });

      const emitted = wrapper.emitted("update");
      expect(emitted).toBeTruthy();

      const lastPayload = emitted[0][0];
      expect(lastPayload).toEqual({
        fieldId: 1,
        name: "TEST",
        value: "|Иванов",
      });
    });

    it("handleSubmit хранит только последнее значение в valueHub", () => {
      const wrapper = mountComponent();

      wrapper.vm.handleSubmit({
        value: "BMW X5",
        data: { brand_model_modification: "BMW X5" },
      });

      wrapper.vm.handleSubmit({
        value: "BMW X7",
        data: { brand_model_modification: "BMW X7" },
      });

      expect(wrapper.vm.valueHub).toEqual(["BMW X7"]);
    });

    it("closeDropdown закрывает dropdown и выключает isSearching", async () => {
      const wrapper = mountComponent();

      wrapper.setData({
        isOpen: true,
        isSearching: true,
        searchQuery: "BMW X5",
      });

      wrapper.vm.closeDropdown();
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.isOpen).toBe(false);
      expect(wrapper.vm.isSearching).toBe(false);
    });
  });

  describe("computed", () => {
    it("getCurrentValue возвращает raw string", () => {
      const wrapper = mountComponent({
        data: makeData({
          value: "BMW X5",
        }),
      });

      expect(wrapper.vm.getCurrentValue).toBe("BMW X5");
    });

    it("getCurrentValue возвращает value из object", () => {
      const wrapper = mountComponent({
        data: makeData({
          value: {
            value: "BMW X5",
          },
        }),
      });

      expect(wrapper.vm.getCurrentValue).toBe("BMW X5");
    });

    it("getCurrentValue возвращает value из JSON object string", () => {
      const wrapper = mountComponent({
        data: makeData({
          value: JSON.stringify({ value: "BMW X5" }),
        }),
      });

      expect(wrapper.vm.getCurrentValue).toBe("BMW X5");
    });

    it("getCurrentValue возвращает string из JSON string", () => {
      const wrapper = mountComponent({
        data: makeData({
          value: JSON.stringify("BMW X5"),
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

    it("validClass возвращает is-valid при data.state=true", () => {
      const wrapper = mountComponent({
        data: makeData({
          state: true,
        }),
      });

      expect(wrapper.vm.validClass).toBe("is-valid");
    });

    it("validClass возвращает is-invalid при data.state=false", () => {
      const wrapper = mountComponent({
        data: makeData({
          state: false,
        }),
      });

      expect(wrapper.vm.validClass).toBe("is-invalid");
    });

    it("validClass возвращает пустую строку если state не задан", () => {
      const wrapper = mountComponent({
        data: makeData({
          state: null,
        }),
      });

      expect(wrapper.vm.validClass).toBe("");
    });

    it("disabled возвращает true если edit=false", () => {
      const wrapper = mountComponent({
        edit: false,
      });

      expect(wrapper.vm.disabled).toBe(true);
    });

    it("disabled возвращает true если readonly=true", () => {
      const wrapper = mountComponent({
        data: makeData({
          readonly: true,
        }),
      });

      expect(wrapper.vm.disabled).toBe(true);
    });
  });

  describe("watchers / edge cases", () => {
    it("watch searchQuery вызывает search через debounce", async () => {
      const wrapper = mountComponent();

      await openDropdown(wrapper);

      await typeSearch(wrapper, "bmw");

      expect(global.fetch).not.toHaveBeenCalled();

      jest.advanceTimersByTime(300);

      await flushPromises();
      await wrapper.vm.$nextTick();

      expect(getQueryParams).toHaveBeenCalledWith("SVEHICLE_MODEL", "bmw");

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/suggestions/vehicle",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ query: "bmw" }),
        })
      );

      expect(getRenderedItems(wrapper)).toEqual(["BMW X5", "BMW X3M", "BMW X7"]);
    });

    it("handleSearchInput ничего не делает без event", async () => {
      const wrapper = mountComponent();

      await wrapper.vm.handleSearchInput();

      expect(wrapper.vm.searchQuery).toBe("");
      expect(wrapper.vm.isSearching).toBe(false);
      expect(wrapper.vm.isOpen).toBe(false);
    });
  });
});
