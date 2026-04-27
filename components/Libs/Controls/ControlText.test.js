import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import ControlText from "./ControlText";

describe("ControlText", () => {
  let localVue;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(BootstrapVue);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const createWrapper = (propsData = {}) =>
    mount(ControlText, {
      localVue,
      propsData: {
        data: {
          fieldId: 1,
          name: "textarea",
          value: "",
          label: "Текстовое поле",
          readonly: false,
          state: propsData.state,
          helpText: "",
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

  it("shows label from data.label", () => {
    const wrapper = createWrapper({ data: { label: "test-label" } });
    expect(wrapper.text()).toContain("test-label");
  });

  it("shows helpText and tooltip", () => {
    const wrapper = createWrapper({ data: { helpText: "help" } });
    expect(wrapper.html()).toContain("help");
  });

  it("v-model getter", () => {
    const wrapper = createWrapper({ data: { value: "Hello" } });
    expect(wrapper.vm.fieldValue).toBe("Hello");
  });

  it("v-model setter with trim", async () => {
    const wrapper = createWrapper();
    const textarea = wrapper.findComponent({ name: "BFormTextarea" });

    textarea.element.value = "  текст  ";
    textarea.trigger("input");
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().update).toBeTruthy();
    expect(wrapper.emitted().update[0][0]).toEqual({
      fieldId: 1,
      name: "textarea",
      value: "текст",
    });
  });

  it("disabled when edit=false", () => {
    const wrapper = createWrapper({ edit: false });
    const textarea = wrapper.findComponent({ name: "BFormTextarea" });
    expect(textarea.props("disabled")).toBe(true);
  });

  it("readonly when edit=true", () => {
    const wrapper = createWrapper({ data: { readonly: true } });
    const textarea = wrapper.findComponent({ name: "BFormTextarea" });
    expect(textarea.props("disabled")).toBe(true);
  });

  it("data.state works correctly", () => {
    const wrapper = createWrapper({ data: { state: false } });
    const textarea = wrapper.findComponent({ name: "BFormTextarea" });
    expect(textarea.props("state")).toBe(false);
  });

  it("shows b-form-invalid-feedback default error", async () => {
    const wrapper = createWrapper({ data: { state: true } });
    expect(wrapper.find(".invalid-feedback").exists()).toBe(false);
    await wrapper.setProps({ data: { state: false } });
    expect(wrapper.find(".invalid-feedback").exists()).toBe(true);
    expect(wrapper.find(".invalid-feedback").text()).toContain("Обязательно для заполнения");
  });
});
