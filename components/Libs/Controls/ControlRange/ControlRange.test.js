import { mount } from "@vue/test-utils";
import ControlRange from "./ControlRange.vue";

describe("ControlRange", () => {
  let wrapper;

  const createComponent = () => {
    wrapper = mount(ControlRange, {
      propsData: {
        data: {
          label: "Страховая сумма на каждого застрахованного",
          value: 1500000,
          type: "Range",
          structType: "double",
          id: "745",
          fieldId: 31739,
          cols: 4,
          colSm: 12,
          colMd: 12,
          colLg: 12,
          width: "100%",
          name: "IDNINSURED_SUM",
          labelCols: "",
          webId: "",
          visible: true,
          required: true,
          page: 4,
          readonly: false,
          control: null,
          state: true,
          checked: true,
          error: null,
          helpText:
            "Страховая сумма влияет на объем оказания медицинских услуг в стационаре и при амбулаторном лечении.",
          isRelation: false,
          fieldRelation: null,
          isTab: true,
          options: [
            {
              SNAME: "1 500 000 руб.",
              ID: 1500000,
              value: 1500000,
              text: "1 500 000 руб.",
            },
            {
              SNAME: "1 800 000 руб.",
              ID: 1800000,
              value: 1800000,
              text: "1 800 000 руб.",
            },
            {
              SNAME: "2 000 000 руб.",
              ID: 2000000,
              value: 2000000,
              text: "2 000 000 руб.",
            },
            {
              SNAME: "2 500 000 руб.",
              ID: 2500000,
              value: 2500000,
              text: "2 500 000 руб.",
            },
            {
              SNAME: "3 000 000 руб.",
              ID: 3000000,
              value: 3000000,
              text: "3 000 000 руб.",
            },
            {
              SNAME: "4 100 000 руб.",
              ID: 4100000,
              value: 4100000,
              text: "4 100 000 руб.",
            },
          ],
        },
      },
    });
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("Изменение input[type='range'] при заполнении input[type='number']", async () => {
    createComponent();

    const inputTypeNumberValue = wrapper.find("[type='number']");

    inputTypeNumberValue.setValue("1900000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find("[type='range']").element.value).toBe("2");

    inputTypeNumberValue.setValue("1600000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find("[type='range']").element.value).toBe("0");

    inputTypeNumberValue.setValue("2300000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find("[type='range']").element.value).toBe("3");

    inputTypeNumberValue.setValue("3500000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find("[type='range']").element.value).toBe("4");

    inputTypeNumberValue.setValue("1700000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find("[type='range']").element.value).toBe("1");

    inputTypeNumberValue.setValue("3600000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find("[type='range']").element.value).toBe("5");
  });

  it("Изменение страховой суммы при изменении input[type='range']", async () => {
    createComponent();
    const inputTypeRangeValue = wrapper.find("[type='range']");
    inputTypeRangeValue.setValue("0");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const isuredSum = wrapper.find("#isuredSum");
    expect(isuredSum.html().includes("1500000")).toBe(true);
    inputTypeRangeValue.setValue("1");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(isuredSum.html().includes("1800000")).toBe(true);
    inputTypeRangeValue.setValue("2");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(isuredSum.html().includes("2000000")).toBe(true);
    inputTypeRangeValue.setValue("3");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(isuredSum.html().includes("2500000")).toBe(true);
    inputTypeRangeValue.setValue("4");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(isuredSum.html().includes("3000000")).toBe(true);
    inputTypeRangeValue.setValue("5");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(isuredSum.html().includes("4100000")).toBe(true);
  });

  it("Плавающий ползунок", () => {});
});
