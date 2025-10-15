import { mount } from "@vue/test-utils";
import ControlDropdown from "./ControlDropdown.vue";
import { controlDropdownDataTest, dataSet } from "./ControlDropdownTestData";

describe("ControlDropdown", () => {
  test("тестируем emit 'update'", async () => {
    const wrapper = mount(ControlDropdown, {
      propsData: {
        data: dataSet,
      },
      computed: {
        selectedValue() {
          return "госномер автомобиля";
        },
        dataOptionsComputed() {
          return [
            {
              SNAME: "госномер автомобиля",
              ID: 1,
              value: 1,
              text: "госномер автомобиля",
            },
            {
              SNAME: "госномер мотоцикла",
              ID: 2,
              value: 2,
              text: "госномер мотоцикла",
            },
            {
              SNAME: "госномер другого формата",
              ID: 3,
              value: 3,
              text: "госномер другого формата",
            },
          ];
        },
      },
    });

    // Открываем и выбираем элемент

    await wrapper.find(".header span").trigger("click");

    const wr = wrapper.findAll("li");

    await wr.at(0).trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wr.length).toBeGreaterThan(0);
    expect(wrapper.emitted()).toBeTruthy();

    wrapper.element.querySelectorAll("li")[0].click();

    expect(wrapper.emitted()).toBeTruthy();

    const val = {
      SNAME: "госномер мотоцикла",
      ID: 2,
      value: 2,
      text: "госномер мотоцикла",
    };
    // Вызываем метод selectItem напрямую
    wrapper.vm.selectItem(val);
    await wrapper.vm.$nextTick();

    expect(...wrapper.emitted().update[1]).toEqual({ fieldId: 73884, name: "IDREGNUMBER", type: "Dropdown", value: 1 });
  });

  test("Visible menu items", async () => {
    const wrapper = mount(ControlDropdown, {
      propsData: controlDropdownDataTest.options,
      computed: {
        dataOptionsComputed() {
          return [];
        },
        selectedItem() {
          return { textValue: "Мопед" };
        },
      },
    });
    // Mock данных компонента
    wrapper.vm.choosenValue = null;

    expect(wrapper.element.querySelectorAll("li").length).toBe(wrapper.vm.options.length);
  });

  test("Visible menu items with invisible option", () => {
    const props = { ...controlDropdownDataTest.props };
    props.options.push({
      invisible: true,
      name: "Тип расчета",
      id: 4312,
    });
    const wrapper = mount(ControlDropdown, {
      propsData: props,
      computed: {
        dataOptionsComputed() {
          return [];
        },
        selectedValue() {
          return null;
        },
      },
    });

    wrapper.vm.choosenValue = null;
    expect(wrapper.element.querySelectorAll("li").length).toBe(wrapper.vm.options.length - 1);
  });

  test("Emit clear item", async () => {
    const props = { ...controlDropdownDataTest.props };
    props.showClear = true;
    props.value = props.options[0].id;
    const wrapper = mount(ControlDropdown, {
      propsData: props,
      computed: {
        dataOptionsComputed() {
          return [];
        },
        selectedValue() {
          return null;
        },
      },
    });
    wrapper.vm.choosenValue = null;
    const firstOption = wrapper.vm.options[0];

    expect(wrapper.vm.value).toBe(firstOption.id);
    expect(wrapper.element.querySelector(".clear-btn")).toBeTruthy();

    await wrapper.element.querySelector(".clear-btn").click();
    expect(...wrapper.emitted().input[0]).toEqual(null);
  });

  test("Emit selected item", () => {
    const wrapper = mount(ControlDropdown, {
      propsData: controlDropdownDataTest.props,
      computed: {
        dataOptionsComputed() {
          return [];
        },
        selectedValue() {
          return null;
        },
        optionsComputed() {
          return [
            {
              invisible: false,
              name: "Тип расчета",
              id: 4312,
            },
            {
              invisible: false,
              name: "Данные об авто",
              id: 4314,
            },
            {
              invisible: false,
              name: "Данные о Водителе",
              id: 4315,
            },
          ];
        },
      },
    });
    const firstOption = wrapper.vm.options[0];
    wrapper.element.querySelectorAll("li")[0].click();

    expect(...wrapper.emitted().input[0]).toEqual(firstOption.id);
  });
});
