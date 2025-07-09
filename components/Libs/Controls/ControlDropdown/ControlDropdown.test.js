import { mount } from "@vue/test-utils";
import ControlDropdown from "./ControlDropdown.vue";
import { controlDropdownDataTest } from "./ControlDropdownTestData";

describe("ControlDropdown", () => {
  test("Visible menu items", () => {
    const wrapper = mount(ControlDropdown, {
      propsData: controlDropdownDataTest.props,
    });

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
    });

    expect(wrapper.element.querySelectorAll("li").length).toBe(wrapper.vm.options.length - 1);
  });

  test("Emit selected item", () => {
    const wrapper = mount(ControlDropdown, {
      propsData: controlDropdownDataTest.props,
    });
    const firstOption = wrapper.vm.options[0];

    wrapper.element.querySelectorAll("li")[0].click();
    expect(...wrapper.emitted().input[0]).toEqual(firstOption.id);
  });

  test("Emit clear item", async () => {
    const props = { ...controlDropdownDataTest.props };
    props.showClear = true;
    props.value = props.options[0].id;
    const wrapper = mount(ControlDropdown, {
      propsData: props,
    });
    const firstOption = wrapper.vm.options[0];

    expect(wrapper.vm.value).toBe(firstOption.id);
    expect(wrapper.element.querySelector(".clear-btn")).toBeTruthy();

    await wrapper.element.querySelector(".clear-btn").click();
    expect(...wrapper.emitted().input[0]).toEqual(null);
  });
});
