import Vue from "vue";
import Vuex from "vuex";
import { mount, shallowMount } from "@vue/test-utils";
import axios from "axios";
import ControlNewVariantPolicy from "./ControlNewVariantPolicy";
import NewVariantPolicy from "./NewVariantPolicy";
import { dataSet } from "./ControlNewVariantPolicy.fixtures";

const mockAxios = {
  get: jest.fn(),
};

global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

describe("ControlNewVariantPolicy", () => {
  let wrapper;

  const createWrapper = (props = {}) => {
    return mount(ControlNewVariantPolicy, {
      propsData: {
        data: dataSet,
        ...props,
      },
      mocks: {
        $axios: mockAxios,
      },
    });
  };

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy();
    }
  });

  test("renders correctly with data prop", () => {
    wrapper = createWrapper();

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".variant-policy").exists()).toBe(true);
    expect(wrapper.html()).toContain("Вариант полиса NEW");
  });

  test("renders correct number of NewVariantPolicy components", () => {
    wrapper = createWrapper();

    const policyComponents = wrapper.findAllComponents(NewVariantPolicy);
    expect(policyComponents.length).toBe(dataSet.options.length);
  });

  test('finds optional item with SOPTIMAL: "Y"', () => {
    wrapper = createWrapper();

    const optionalItem = wrapper.vm.getOptionalItem;

    expect(optionalItem.SOPTIMAL).toBe("Y");
    expect(optionalItem.SNAME).toBe("Каско с франшизой");
  });

  test("computes firstValueFranchise for optional item", () => {
    wrapper = createWrapper();

    expect(wrapper.vm.getFirstValueFranschise).toBe(1); // Первый id из SFRANCHISE массива
  });

  test("computes defaultValueFranchise correctly", () => {
    wrapper = createWrapper();

    expect(wrapper.vm.defaultValueFranschise).toBe(5); // ID_DEFAULT_FRAN из optional item
  });

  test("isClass computed property works correctly", () => {
    wrapper = createWrapper();
    // Проверяем метод isClass
    const isClassFunc = wrapper.vm.isClass();

    expect(typeof isClassFunc).toBe("boolean");

    // Устанавливаем selectedPolice и проверяем
    wrapper.setData({ selectedPolice: 2 });
    expect(wrapper.vm.isClass(2)).toBe(true);
    expect(wrapper.vm.isClass(1)).toBe(false);
    expect(wrapper.html()).not.toBe(null);
  });

  test("emits update event on mount with optional values", async () => {
    wrapper = createWrapper();

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().update).toBeTruthy();
    const updateEvent = wrapper.emitted().update[0][0];

    expect(updateEvent.fieldId).toBe(dataSet.fieldId);
    expect(updateEvent.name).toBe(dataSet.name);
    expect(updateEvent.type).toBe(dataSet.type);

    const valueObj = JSON.parse(updateEvent.value);
    expect(valueObj.IDVARIANT).toBe(2); // ID optional item
    expect(valueObj.IDFRNANCHISE).toBe(5); // ID_DEFAULT_FRAN
  });

  test("getChoosenValue method handles tab click", async () => {
    wrapper = createWrapper();

    const mockTab = dataSet.options[0]; // Первая вкладка
    wrapper.vm.getChoosenValue(mockTab);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.selectedPolice).toBe(mockTab.ID);
    expect(wrapper.emitted().update).toHaveLength(2); // mounted + click

    const updateEvent = wrapper.emitted().update[1][0];
    const valueObj = JSON.parse(updateEvent.value);
    expect(valueObj.IDVARIANT).toBe(mockTab.ID);
  });

  test("getChoosenValue method handles franchise click", async () => {
    wrapper = createWrapper();

    const mockFranchiseEvent = {
      el: dataSet.options[1], // Optional item
      value: 10, // Выбранная франшиза
    };

    wrapper.vm.getChoosenValue(mockFranchiseEvent);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.selectedPolice).toBe(mockFranchiseEvent.el.ID);
    expect(wrapper.emitted().update).toHaveLength(2);

    const updateEvent = wrapper.emitted().update[1][0];
    const valueObj = JSON.parse(updateEvent.value);
    expect(valueObj.IDVARIANT).toBe(mockFranchiseEvent.el.ID);
    expect(valueObj.IDFRNANCHISE).toBe(mockFranchiseEvent.value);
  });

  test("getFranchiseId method works correctly", () => {
    wrapper = createWrapper();

    const tabWithFranchise = dataSet.options[1]; // Каско с франшизой
    const tabWithoutFranchise = dataSet.options[0]; // Только хищение
    const tabWithStringFranchise = dataSet.options[2]; // Полное каско

    expect(wrapper.vm.getFranchiseId(tabWithFranchise)).toBe(5); // ID_DEFAULT_FRAN
    expect(wrapper.vm.getFranchiseId(tabWithoutFranchise)).toBeNull();
    expect(wrapper.vm.getFranchiseId(tabWithStringFranchise)).toBeNull();
  });

  test("applies correct CSS classes based on selection", async () => {
    wrapper = createWrapper();

    const policyComponents = wrapper.findAllComponents(NewVariantPolicy);

    expect(policyComponents.at(0).classes()).not.toContain("active");
    expect(policyComponents.at(2).classes()).not.toContain("active");

    // Выбираем первую вкладку
    wrapper.setData({ selectedPolice: 1 });
    await wrapper.vm.$nextTick();

    expect(policyComponents.at(0).classes()).toContain("active");
    expect(policyComponents.at(1).classes()).not.toContain("active");
  });

  test("handles missing optional item gracefully", async () => {
    const dataWithoutOptional = {
      ...dataSet,
      options: dataSet.options.filter((opt) => opt.SOPTIMAL !== "Y"),
    };

    wrapper = mount(ControlNewVariantPolicy, {
      propsData: {
        data: dataWithoutOptional,
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.getOptionalItem).toBeUndefined();
    expect(wrapper.vm.defaultValueFranschise).toBe(false);
    expect(wrapper.vm.getFirstValueFranschise).toBeNull();
    expect(wrapper.vm.optionalId).toBe(false);
    expect(wrapper.vm.selectedFranchise).toBeNull();
  });

  test("watch on selectedPolice resets optionalId", async () => {
    wrapper = createWrapper();

    // Изначально optionalId = 2
    expect(wrapper.vm.optionalId).toBe(2);

    // Меняем selectedPolice
    wrapper.setData({ selectedPolice: 1 });
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.optionalId).toBe(false);
  });

  test("emitUpdate method formats value correctly", () => {
    wrapper = createWrapper();

    wrapper.vm.emitUpdate(123, 456);

    expect(wrapper.emitted().update).toBeTruthy();
    const updateEvent = wrapper.emitted().update[0][0];

    expect(updateEvent.fieldId).toBe(dataSet.fieldId);
    expect(updateEvent.name).toBe(dataSet.name);
    expect(updateEvent.type).toBe(dataSet.type);
  });

  test("Проверяем наличие 'Оптимальный' в тексте компонента", async () => {
    wrapper = createWrapper();

    await wrapper.setProps({
      data: {
        options: [
          {
            SOPTIMAL: "N",
            SNAME: "Только Хищение",
            SDETAILS:
              '[{"stitle":"Размер франшизы","sdescription":"Тест1"},{"stitle":"Хищение ТС","sdescription":"Тест2"}]',
            ID: 1,
            NPRICE: 13525,
            SPOLICYOPTIONS:
              '[{"sname":"Хищение ТС","stooltip":"Тест1"},{"sname":"Без ограничений по страховым событиям","stooltip":"Тест2"}]',
            text: "Только Хищение",
            value: 1,
          },
          {
            SOPTIMAL: "N",
            SNAME: "Каско с франшизой",
            ID_DEFAULT_FRAN: 5,
            SDETAILS:
              '[{"stitle":"Размер франшизы","sdescription":"Тест1"},{"stitle":"Хищение ТС","sdescription":"Тест2"},{"stitle":"Без ограничений по страховым событиям","sdescription":"Тест3"},{"stitle":"Падение или попадание инородных предметов","sdescription":"Тест4"},{"stitle":"Действия 3-х лиц","sdescription":"Тест5"}]',
            ID: 2,
            NPRICE: 35368,
            SFRANCHISE:
              '[{"id":1,"sname":3000},{"id":2,"sname":6000},{"id":3,"sname":9000},{"id":4,"sname":15000},{"id":5,"sname":30000},{"id":6,"sname":45000},{"id":7,"sname":60000},{"id":8,"sname":75000},{"id":9,"sname":90000}]',
            SPOLICYOPTIONS:
              '[{"sname":"Хищение ТС","stooltip":"Тест1"},{"sname":"Без ограничений по страховым событиям","stooltip":"Тест2"},{"sname":"Последствия ДТП","stooltip":"Тест3"},{"sname":"Падение или попадание инородных предметов","stooltip":"Тест4"},{"sname":"Действия 3-х лиц","stooltip":"Тест5"},{"sname":"Ремонт без справок","stooltip":"Тест6"}]',
            text: "Каско с франшизой",
            value: 2,
          },
          {
            SOPTIMAL: "N",
            SNAME: "Полное Каско",
            SDETAILS:
              '[{"stitle":"Размер франшизы","sdescription":"Тест1"},{"stitle":"Хищение ТС","sdescription":"Тест2"},{"stitle":"Без ограничений по страховым событиям","sdescription":"Тест3"},{"stitle":"Падение или попадание инородных предметов","sdescription":"Тест4"},{"stitle":"Действия 3-х лиц","sdescription":"Тест5"}]',
            ID: 3,
            NPRICE: 60061,
            SFRANCHISE: "Без франшизы",
            SPOLICYOPTIONS:
              '[{"sname":"Хищение ТС","stooltip":"Тест1"},{"sname":"Без ограничений по страховым событиям","stooltip":"Тест2"},{"sname":"Последствия ДТП","stooltip":"Тест3"},{"sname":"Падение или попадание инородных предметов","stooltip":"Тест4"},{"sname":"Действия 3-х лиц","stooltip":"Тест5"},{"sname":"Ремонт без справок","stooltip":"Тест6"}]',
            text: "Полное Каско",
            value: 3,
          },
        ],
      },
    });

    expect(wrapper.text()).not.toContain("Оптимальный");
  });

  test("Проверяем отсутствие 'Оптимальный' в тексте компонента", async () => {
    wrapper = createWrapper();

    expect(wrapper.text()).toContain("Оптимальный");
  });

  test("Проверяем наличие 'Подробнее о рисках'", () => {
    wrapper = createWrapper();
    expect(wrapper.text()).toContain("Подробнее о рисках");
  });

  test("Проверяем отсутствие 'Подробнее о рисках' когда нет SDETAILS", async () => {
    const dataWithoutDetails = {
      options: [
        {
          SLOADTEXT: "Подробнее",
          SOPTIMAL: "N",
          S_INFO: ["Тестовая подсказка 1", "Тестовая подсказка 2"],
          NDISCOUNT: 13425,
          SNAME: "Только Хищение",
          SDETAILSTEXT: "Подробнее о рисках",
          SDOWNLOAD: "https://reso.ru/export/sites/reso/individual/medicine/tick/docs/tick300_2023.pdf",
          SOPTIMALTEXT: "Оптимальный",
          ID: 1,
          SOPTIMAL: "N",
          NPRICE: 13525,
          SPOLICYOPTIONS:
            '[{"sname":"Хищение ТС","stooltip":"Тест1"},{"sname":"Без ограничений по страховым событиям","stooltip":"Тест2"}]',
          text: "Только Хищение",
          value: 1,
        },
        {
          SLOADTEXT: "Подробнее",
          SOPTIMAL: "Y",
          S_INFO: ["Тестовая подсказка 1", "Тестовая подсказка 2"],
          SNAME: "Каско с франшизой",
          SDETAILSTEXT: "Подробнее о рисках",
          ID_DEFAULT_FRAN: 5,
          SDOWNLOAD: "https://reso.ru/export/sites/reso/individual/medicine/tick/docs/tick300_2023.pdf",
          SFRANCHISE:
            '[{"id":1,"sname":3000},{"id":2,"sname":6000},{"id":3,"sname":9000},{"id":4,"sname":15000},{"id":5,"sname":30000},{"id":6,"sname":45000},{"id":7,"sname":60000},{"id":8,"sname":75000},{"id":9,"sname":90000}]',
          SOPTIMALTEXT: "Оптимальный",
          SFRANCHISETEXT: "Выбрать размер франшизы",
          ID: 2,
          SOPTIMAL: "Y",
          NPRICE: 34327,
          SPOLICYOPTIONS:
            '[{"sname":"Хищение ТС","stooltip":"Тест1"},{"sname":"Без ограничений по страховым событиям","stooltip":"Тест2"},{"sname":"Последствия ДТП","stooltip":"Тест3"},{"sname":"Падение или попадание инородных предметов","stooltip":"Тест4"},{"sname":"Действия 3-х лиц","stooltip":"Тест5"},{"sname":"Ремонт без справок","stooltip":"Тест6"}]',
          text: "Каско с франшизой",
          value: 2,
        },
        {
          SLOADTEXT: "Подробнее",
          SOPTIMAL: "N",
          S_INFO: ["Тестовая подсказка 1", "Тестовая подсказка 2"],
          NDISCOUNT: 56759,
          SNAME: "Полное Каско",
          SDETAILSTEXT: "Подробнее о рисках",
          SDOWNLOAD: "https://reso.ru/export/sites/reso/individual/medicine/tick/docs/tick300_2023.pdf",
          SFRANCHISE: "Без франшизы",
          SOPTIMALTEXT: "Оптимальный",
          ID: 3,
          SOPTIMAL: "N",
          NPRICE: 57759,
          SPOLICYOPTIONS:
            '[{"sname":"Хищение ТС","stooltip":"Тест1"},{"sname":"Без ограничений по страховым событиям","stooltip":"Тест2"},{"sname":"Последствия ДТП","stooltip":"Тест3"},{"sname":"Падение или попадание инородных предметов","stooltip":"Тест4"},{"sname":"Действия 3-х лиц","stooltip":"Тест5"},{"sname":"Ремонт без справок","stooltip":"Тест6"}]',
          text: "Полное Каско",
          value: 3,
        },
      ],
      fieldId: "test-field",
      name: "test-name",
      type: "test-type",
      label: "<div>Тестовая метка</div>",
    };

    wrapper = mount(ControlNewVariantPolicy, {
      propsData: {
        data: dataWithoutDetails,
      },
    });

    await wrapper.vm.$nextTick();

    // Проверяем отсутствие кнопки
    expect(wrapper.text()).not.toContain("Подробнее о рисках");
  });
  test("download button exists and has correct text when SDOWNLOAD is present", () => {
    wrapper = createWrapper();

    const policyComponents = wrapper.findAllComponents(NewVariantPolicy);

    let downloadButtonCount = 0;

    policyComponents.wrappers.forEach((component) => {
      if (component.props("police").SDOWNLOAD) {
        // Находим все кнопки в компоненте и фильтруем по тексту SLOADTEXT
        const buttons = component.findAll("button");
        const downloadButton = buttons.wrappers.find((button) => button.text() === component.props("police").SLOADTEXT);
        expect(downloadButton.exists()).toBe(true);
        expect(downloadButton.text()).toBe(component.props("police").SLOADTEXT);
        downloadButtonCount++;
      }
    });

    expect(downloadButtonCount).toBe(3);
  });
  test("download button calls downloadFile method with correct URL on click", async () => {
    wrapper = createWrapper();

    // Находим первый компонент с SDOWNLOAD
    const policyComponent = wrapper
      .findAllComponents(NewVariantPolicy)
      .wrappers.find((component) => component.props("police").SDOWNLOAD);

    expect(policyComponent).toBeDefined();

    // Мокаем метод downloadFile
    policyComponent.vm.downloadFile = jest.fn();
    await policyComponent.vm.$nextTick();

    // Находим кнопку скачивания по тексту SLOADTEXT
    const buttons = policyComponent.findAll("button");
    const downloadButton = buttons.wrappers.find(
      (button) => button.text() === policyComponent.props("police").SLOADTEXT
    );

    expect(downloadButton).toBeDefined();

    // Кликаем на кнопку
    await downloadButton.trigger("click");

    // Проверяем, что метод вызван с правильным URL
    expect(policyComponent.vm.downloadFile).toHaveBeenCalledWith(policyComponent.props("police").SDOWNLOAD);
  });
  test("Проверяем успешное скачивание файла", async () => {
    const mockBlob = new Blob(["test content"], { type: "application/pdf" });

    const mockAxiosResponse = {
      data: mockBlob,
      headers: {
        "content-disposition": 'attachment; filename="tick300_2023.pdf"',
        "content-type": "application/pdf",
      },
    };

    // Настраиваем мок для этого теста
    mockAxios.get.mockResolvedValue(mockAxiosResponse);

    wrapper = createWrapper();

    const policyComponent = wrapper
      .findAllComponents(NewVariantPolicy)
      .wrappers.find((component) => component.props("police").SDOWNLOAD);

    expect(policyComponent).toBeDefined();

    await policyComponent.vm.downloadFile(
      "https://reso.ru/export/sites/reso/individual/medicine/tick/docs/tick300_2023.pdf"
    );

    expect(mockAxios.get).toHaveBeenCalledWith("/export/sites/reso/individual/medicine/tick/docs/tick300_2023.pdf", {
      responseType: "blob",
      headers: {
        Accept: "application/octet-stream",
      },
    });

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
  });
});
