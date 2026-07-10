import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import StringSimple from "./StringSimple";

describe("StringSimple", () => {
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(BootstrapVue);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const createWrapper = (propsData = {}) =>
    mount(StringSimple, {
      localVue,
      propsData: {
        data: {
          fieldId: 1,
          name: "test-input",
          value: "",
          readonly: false,
          required: false,
          placeholder: "Введите текст",
          state: null,
          error: "",
          ...propsData.data,
        },
        edit: true,
        ...propsData,
      },
    });

  it("init", () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  it("props to input", () => {
    const wrapper = createWrapper({
      data: {
        name: "simple-string",
        placeholder: "placeholder text",
        required: true,
      },
    });

    const input = wrapper.find("input");
    expect(input.exists()).toBe(true);

    expect(input.element.placeholder).toBe("placeholder text");
    expect(input.element.required).toBe(true);
  });

  it("returns a value data.value from getter", () => {
    const wrapper = createWrapper({
      data: { value: "hello" },
    });

    expect(wrapper.vm.dataValue).toBe("hello");
  });

  it("emits update on value update setter", async () => {
    const wrapper = createWrapper();

    wrapper.vm.dataValue = "  test  ";

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().update).toBeTruthy();
    expect(wrapper.emitted().update[0][0]).toEqual({
      fieldId: 1,
      name: "test-input",
      value: "test",
    });
  });

  it("is disabled when edit=false", () => {
    const wrapper = createWrapper({
      edit: false,
      data: { readonly: false },
    });

    const input = wrapper.find("input");
    expect(input.exists()).toBe(true);
    expect(input.element.disabled).toBe(true);
  });

  it("is readonly when edit=true", () => {
    const wrapper = createWrapper({
      edit: true,
      data: { readonly: true },
    });

    const input = wrapper.find("input");
    expect(input.exists()).toBe(true);
    expect(input.element.disabled).toBe(true);
  });

  it("state correctly validates", () => {
    const wrapper = createWrapper({
      data: { state: false },
    });

    const input = wrapper.findComponent({ name: "input" });
    const feedback = wrapper.find(".invalid-feedback");

    expect(feedback.text()).toContain("Обязательно для заполнения");
  });

  it("shows custom error message", () => {
    const wrapper = createWrapper({
      data: { error: "Ошибка", state: false },
    });

    expect(wrapper.text()).toContain("Ошибка");
  });

  it("shows default error message", () => {
    const wrapper = createWrapper({
      data: { error: "", state: false },
    });

    expect(wrapper.text()).toContain("Обязательно для заполнения");
  });
});
