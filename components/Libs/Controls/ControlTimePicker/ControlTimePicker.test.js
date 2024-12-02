import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import VueMask from "v-mask";
import vueEasyTooltipEsm from "vue-easy-tooltip";
import ControlTimePicker from "./ControlTimePicker.vue";
import { wait } from "../../../../utils/delayUtils";

describe("ControlTimePicker", () => {
  let wrapper;
  const mockData = {
    label: "Время происшествия",
    name: "time",
    value: "12:30",
    required: true,
    fieldId: "ControlTimePicker",
  };

  beforeEach(async () => {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    localVue.use(VueMask);

    wrapper = await mount(ControlTimePicker, {
      stubs: { vueEasyTooltip: vueEasyTooltipEsm },
      localVue,
      propsData: {
        data: mockData,
        edit: true,
      },
    });
  });

  it("renders the component correctly", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("label").text()).toContain(mockData.label);
  });

  it("initializes value from props", () => {
    expect(wrapper.vm.value).toBe(mockData.value);
  });

  it("validates input correctly", async () => {
    const input = wrapper.find("input");

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
    const input = wrapper.find("input");
    await input.setValue("123");
    expect(wrapper.vm.value).toBe("12:3");

    input.trigger("blur");
    await wait(250);

    expect(wrapper.vm.status).toBe(false);
    expect(input.classes()).toContain("is-invalid");
    expect(wrapper.find(".invalid-feedback").text()).toContain(
      "Обязательно для заполнения"
    );

    await input.setValue("test");
    expect(wrapper.vm.value).toBe("");

    input.trigger("blur");
    await wait(250);

    expect(wrapper.vm.status).toBe(false);
    expect(input.classes()).toContain("is-invalid");
    expect(wrapper.find(".invalid-feedback").text()).toContain(
      "Обязательно для заполнения"
    );
  });

  it("emits update event with correct payload", async () => {
    const input = wrapper.find("input");
    await input.setValue("14:20");
    await wait(250);

    expect(wrapper.emitted().update).toBeTruthy();
    expect(wrapper.emitted().update[0][0]).toEqual({
      value: "1420",
      name: mockData.name,
      fieldId: mockData.fieldId,
    });
  });
});
