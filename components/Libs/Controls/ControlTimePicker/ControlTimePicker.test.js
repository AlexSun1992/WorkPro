import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import VueMask from "v-mask";
import vueEasyTooltipEsm from "vue-easy-tooltip";
import ControlTimePicker from "./ControlTimePicker.vue";
import { wait } from "@/utils/delayUtils";

const createWrapper = (mockData) => {
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  localVue.use(VueMask);

  return mount(ControlTimePicker, {
    stubs: { vueEasyTooltip: vueEasyTooltipEsm },
    localVue,
    propsData: {
      data: mockData,
      edit: true,
    },
  });
};

describe("ControlTimePicker", () => {
  let wrapper;
  const mockData = {
    label: "Время происшествия",
    name: "time",
    value: "12:30",
    required: true,
    fieldId: "ControlTimePicker",
  };
  const emptyMockData = {
    name: "time",
    required: true,
    fieldId: "ControlTimePicker",
  };

  afterEach(() => {
    wrapper.destroy();
    jest.resetAllMocks();
    jest.resetModules();
  });

  it("renders the component correctly", () => {
    wrapper = createWrapper(mockData);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.value).toBe(mockData.value);
    expect(wrapper.find("label").text()).toContain(mockData.label);
  });

  it("validates input correctly", async () => {
    wrapper = createWrapper(emptyMockData);
    const input = wrapper.find("input");

    expect(wrapper.vm.value).toBe("");
    expect(wrapper.vm.status).toBe(null);

    await input.setValue("25:00");
    expect(wrapper.vm.value).toBe("23:00");

    await input.setValue("99:99");
    expect(wrapper.vm.value).toBe("23:59");

    await input.setValue("9999");
    expect(wrapper.vm.value).toBe("23:59");

    await input.setValue("1212");
    expect(wrapper.vm.value).toBe("12:12");

    expect(wrapper.vm.status).toBe(true);
    expect(input.classes()).toContain("is-valid");
  });

  it("shows error message when input is invalid", async () => {
    wrapper = createWrapper(mockData);
    const input = wrapper.find("input");
    await input.setValue("123");
    expect(wrapper.vm.value).toBe("12:3");

    input.trigger("blur");
    await wait(250);

    expect(wrapper.vm.status).toBe(false);
    expect(input.classes()).toContain("is-invalid");
    expect(wrapper.find(".invalid-feedback").text()).toContain("Обязательно для заполнения");

    await input.setValue("test");
    expect(wrapper.vm.value).toBe("");

    input.trigger("blur");
    await wait(250);

    expect(wrapper.vm.status).toBe(false);
    expect(input.classes()).toContain("is-invalid");
    expect(wrapper.find(".invalid-feedback").text()).toContain("Обязательно для заполнения");
  });

  it("emits update event with correct payload", async () => {
    wrapper = createWrapper(mockData);
    const input = wrapper.find("input");

    await input.setValue("14:20");
    expect(wrapper.vm.value).toBe("14:20");

    await wait(250);
    expect(wrapper.emitted().update).toBeTruthy();
    expect(wrapper.emitted().update[1][0]).toEqual({
      value: "1420",
      name: mockData.name,
      fieldId: mockData.fieldId,
    });
  });
});
