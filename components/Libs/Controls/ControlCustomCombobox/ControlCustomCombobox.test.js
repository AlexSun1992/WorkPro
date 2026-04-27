import Vue from "vue";
import Vuex from "vuex";
import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import ControlCustomCombobox, { calcDisabledByRelation } from "./ControlCustomCombobox";
import { dataProps, data as dataMulti } from "./ControlCustomCombobox.helper.fixtures";
import * as dataCard from "@/store/data_card";

function mountComponent(propsData, localVue, store) {
  return mount(ControlCustomCombobox, {
    localVue,
    propsData,
    mocks: { $store: store },
    stubs: { "vue-easy-tooltip": true },
  });
}

async function openDropdown(wrapper) {
  wrapper.vm.isOpen = true;
  await wrapper.vm.$nextTick();
}

describe("calcDisabledByRelation", () => {
  it("пустой массив связей → не disabled", () => {
    expect(calcDisabledByRelation([])).toBe(false);
  });

  it("связь не обязательная → не disabled", () => {
    expect(calcDisabledByRelation([{ required: false, visible: true }])).toBe(false);
  });

  it("связь не видима → не disabled", () => {
    expect(calcDisabledByRelation([{ required: true, visible: false }])).toBe(false);
  });

  it("обязательная видимая связь без value → disabled", () => {
    expect(calcDisabledByRelation([{ required: true, visible: true }])).toBe(true);
  });

  it("одна из связей без value → disabled", () => {
    expect(
      calcDisabledByRelation([
        { required: true, visible: true },
        { required: true, visible: true, value: 123 },
      ])
    ).toBe(true);
  });

  it("все обязательные связи заполнены → не disabled", () => {
    expect(
      calcDisabledByRelation([
        { required: true, visible: true, value: 1 },
        { required: true, visible: true, value: 123 },
      ])
    ).toBe(false);
  });

  it("связь заполнена нулём → не disabled", () => {
    expect(calcDisabledByRelation([{ required: true, visible: true, value: 0 }])).toBe(false);
  });
});

describe("ControlCustomCombobox", () => {
  let localVue;
  let store;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(BootstrapVue);
    store = new Vuex.Store({
      modules: {
        data_card: { ...dataCard, namespaced: true },
      },
    });
  });

  describe("отображение trigger", () => {
    it("показывает текст выбранного значения, если value совпадает с options", async () => {
      const wrapper = mountComponent({ data: { ...dataProps, value: 1 }, edit: true }, localVue, store);
      expect(wrapper.text()).toContain("ААА");
    });

    it("показывает placeholder, если ничего не выбрано", async () => {
      const wrapper = mountComponent(
        { data: { ...dataProps, value: null, placeholder: "Выберите значение" }, edit: true },
        localVue,
        store
      );
      expect(wrapper.text()).toContain("Выберите значение");
    });

    it("не показывает поиск пока дропдаун закрыт", async () => {
      const wrapper = mountComponent({ data: dataProps, edit: true }, localVue, store);
      expect(wrapper.find(".combobox-search-input").exists()).toBe(false);
    });
  });

  describe("поиск в меню", () => {
    it("показывает поиск при открытом дропдауне (options > 5)", async () => {
      const wrapper = mountComponent({ data: dataProps, edit: true }, localVue, store);
      await openDropdown(wrapper);
      expect(wrapper.find(".search-input").exists()).toBe(true);
    });

    it("не показывает поиск если options <= 5 и searchQuery пустой", async () => {
      const fewOptions = { ...dataProps, options: dataProps.options.slice(0, 4) };
      const wrapper = mountComponent({ data: fewOptions, edit: true }, localVue, store);
      await openDropdown(wrapper);
      expect(wrapper.find(".combobox-search-input").exists()).toBe(false);
    });

    it("фильтрует опции по введённому запросу", async () => {
      const wrapper = mountComponent({ data: dataProps, edit: true }, localVue, store);
      await openDropdown(wrapper);
      const searchInput = wrapper.find(".search-input");
      await searchInput.setValue("ААА");
      await searchInput.trigger("input");
      const items = wrapper.findAll("li .selected-option, li span").wrappers.map((w) => w.text());
      expect(items.some((t) => t === "ААА")).toBe(true);
    });

    it("показывает 'Нет подходящих значений' при несуществующем запросе", async () => {
      const wrapper = mountComponent({ data: dataProps, edit: true }, localVue, store);
      await openDropdown(wrapper);
      const searchInput = wrapper.find(".search-input");
      await searchInput.setValue("ZZZZZ");
      await searchInput.trigger("input");
      expect(wrapper.html()).toContain("Нет подходящих значений");
    });

    it("после ввода несуществующего запроса устанавливает state=false", async () => {
      const wrapper = mountComponent({ data: { ...dataProps, state: null }, edit: true }, localVue, store);
      const commitSpy = jest.spyOn(store, "commit");
      await openDropdown(wrapper);
      const searchInput = wrapper.find(".search-input");
      await searchInput.setValue("ффф");
      await searchInput.trigger("input");
      expect(commitSpy).toHaveBeenCalledWith("data_card/setFieldState", expect.objectContaining({ state: false }));
    });
  });

  describe("выбор элемента", () => {
    it("выбор элемента закрывает дропдаун и сбрасывает searchQuery", async () => {
      const wrapper = mountComponent({ data: dataProps, edit: true }, localVue, store);

      await openDropdown(wrapper);

      const searchInput = wrapper.find(".search-input");
      await searchInput.setValue("ААА");
      await searchInput.trigger("input");

      const items = wrapper.findAll("li");
      const target = items.wrappers.find((li) => li.text() === "ААА");
      await target.trigger("mousedown");

      expect(wrapper.vm.isOpen).toBe(false);
      expect(wrapper.vm.searchQuery).toBe("");
    });

    it("выбор элемента эмитит update с правильным value", async () => {
      const wrapper = mountComponent({ data: { ...dataProps, value: null }, edit: true }, localVue, store);
      await openDropdown(wrapper);

      const items = wrapper.findAll("li");
      const target = items.wrappers.find((li) => li.text() === "BBB");
      await target.trigger("mousedown");

      const emitted = wrapper.emitted("update");
      expect(emitted).toBeTruthy();
      expect(emitted[emitted.length - 1][0]).toMatchObject({ value: 2, name: dataProps.name });
    });

    it("после выбора текст ошибки исчезает", async () => {
      const wrapper = mountComponent({ data: { ...dataProps, value: null }, edit: true }, localVue, store);
      wrapper.vm.isTouch = true;
      wrapper.vm.closeDropdown();
      await wrapper.vm.$nextTick();
      await wrapper.setProps({ data: { ...dataProps, state: false } });
      expect(wrapper.find(".invalid-feedback").text()).toContain("Обязательно для заполнения");
      await openDropdown(wrapper);
      await wrapper.vm.$nextTick();
      const items = wrapper.findAll("li");
      const target = items.wrappers.find((li) => li.text() === "ААА");
      await target.trigger("mousedown");
      expect(wrapper.vm.validationErrorText).toBeNull();
    });
  });

  describe("валидация", () => {
    it("закрытие дропдауна без выбора (required) показывает ошибку после isTouch", async () => {
      const wrapper = mountComponent({ data: { ...dataProps, value: null }, edit: true }, localVue, store);
      await openDropdown(wrapper);
      wrapper.vm.isTouch = true;
      wrapper.vm.closeDropdown();
      await wrapper.vm.$nextTick();
      await wrapper.setProps({ data: { state: false } });
      expect(wrapper.find(".invalid-feedback").text()).toContain("Обязательно для заполнения");
    });

    it("закрытие дропдауна без выбора (not required) НЕ показывает ошибку", async () => {
      const wrapper = mountComponent(
        { data: { ...dataProps, value: null, required: false }, edit: true },
        localVue,
        store
      );
      await openDropdown(wrapper);
      wrapper.vm.isTouch = true;
      wrapper.vm.closeDropdown();
      await wrapper.vm.$nextTick();
      await wrapper.setProps({ data: { state: false } });
      expect(wrapper.find(".invalid-feedback").text()).not.toContain("Обязательно для заполнения");
    });

    it("disabled компонент не открывает дропдаун", async () => {
      const wrapper = mountComponent({ data: dataProps, edit: false }, localVue, store);
      wrapper.vm.handleToggleBtn();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isOpen).toBe(false);
    });
  });

  describe("регистронезависимый поиск", () => {
    it("поиск строчными находит элемент в верхнем регистре", async () => {
      const wrapper = mountComponent({ data: dataProps, edit: true }, localVue, store);
      await openDropdown(wrapper);
      const searchInput = wrapper.find(".search-input");
      await searchInput.setValue("ааа");
      await searchInput.trigger("input");
      expect(wrapper.html()).toContain("ААА");
      expect(wrapper.html()).not.toContain("BBB");
    });
  });
});
