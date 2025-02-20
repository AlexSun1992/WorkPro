import { mount } from "@vue/test-utils";
import ControlTokenBox from "./ControlTokenBox.vue";
import { TokenBoxTestData } from "./ControlTokenBoxTestData";
import SearchBox from "./SearchBox.vue";

describe("ControlTokenBox", () => {
  let wrapper;
  let initValue;

  beforeEach(() => {
    wrapper = mount(ControlTokenBox, {
      propsData: TokenBoxTestData.propsDataCorrect,
      stubs: { SearchBox }
    });
    initValue = TokenBoxTestData.propsDataCorrect.data.value;
  });

  it("Init component with placeholder", async () => {
    await wrapper.setProps({
      data: {
        options: [],
        value: [],
        placeholder: TokenBoxTestData.propsDataCorrect.data.placeholder,
      },
    });

    expect(wrapper.element.innerHTML).toContain(
      TokenBoxTestData.propsDataCorrect.data.placeholder
    );
  });

  it("Init component with props data", () => {
    const { value } = wrapper.vm;
    const props = TokenBoxTestData.propsDataCorrect.data.value;

    expect(value).toEqual(expect.arrayContaining(props));
  });

  it("Open/close dropdown menu", async () => {
    await wrapper.vm.toggleDropdown(true);
    expect(wrapper.element.querySelector(".selected-items.open")).toBeTruthy();

    await wrapper.vm.toggleDropdown(false);
    expect(wrapper.element.querySelector(".selected-items.open")).toBeFalsy();
  });

  it("Set value from dropdown", async () => {
    await wrapper.vm.toggleDropdown();
    expect(wrapper.emitted().update).toBeFalsy();

    await wrapper.findAll("li:not(.selected-option)").at(1).trigger("mousedown");
    expect(wrapper.emitted().update.length).toBe(1);
    expect(wrapper.emitted().update[0][0].value.length - initValue.length).toBe(
      1
    );
  });

  it("Clear selected item by clear button", async () => {
    expect(initValue.length === wrapper.vm.value.length).toBeTruthy();
    await wrapper.findAll(".clear-btn").at(0).trigger("click");
    expect(initValue.length - wrapper.emitted().update[0][0].value.length).toBe(
      1
    );
  });

  it("Clear selected item by click on dropdown selected item", async () => {
    expect(initValue.length === wrapper.vm.value.length).toBeTruthy();
    await wrapper.vm.toggleDropdown();
    await wrapper.findAll(".selected-option").at(0).trigger("mousedown");
    expect(initValue.length - wrapper.emitted().update[0][0].value.length).toBe(
      1
    );
  });

  it("Show search box", async () => {
    wrapper.setProps({
      searchable: true
    });

    await wrapper.vm.toggleDropdown(true);

    expect(wrapper.findAll("input").length).toBeTruthy();
  });
});
