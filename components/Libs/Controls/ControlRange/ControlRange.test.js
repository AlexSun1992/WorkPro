import { mount } from "@vue/test-utils";
import ControlRange from "./ControlRange.vue";

describe("ControlRange", () => {
  let wrapper;
  const createComponent = (boolean) => {
    wrapper = mount(ControlRange, {
      computed: {
        isMobileModeActivated() {
          return boolean;
        },
      },

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
        edit: true,
      },
    });
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("Изменение input[type='range'] при заполнении input[type='number']", async () => {
    createComponent(false);
    const inputTypeNumberValue = wrapper.find("[type='tel']");
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
    createComponent(false);
    const inputTypeRangeValue = wrapper.find("[type='range']");
    const inputTypeNumberValue = wrapper.find("[type='tel']");
    inputTypeRangeValue.setValue("0");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value === "1500000").toBe(true);
    //
    inputTypeRangeValue.setValue("1");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value === "1800000").toBe(true);
    //
    inputTypeRangeValue.setValue("2");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value === "2000000").toBe(true);
    //
    inputTypeRangeValue.setValue("3");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value === "2500000").toBe(true);
    //
    inputTypeRangeValue.setValue("4");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value === "3000000").toBe(true);
    inputTypeRangeValue.setValue("5");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value === "4100000").toBe(true);
  });

  it("Плавающий ползунок изменение в компоненте", async () => {
    createComponent(false);
    const inputTypeRangeValue = wrapper.find("[type='range']");
    const inputTypeNumberValue = wrapper.find("[type='tel']");

    inputTypeNumberValue.setValue("1400000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(inputTypeRangeValue.element.value === "0").toBe(true);
    //
    inputTypeNumberValue.setValue("1700000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    //

    expect(inputTypeRangeValue.element.value === "1").toBe(true);
    //
    inputTypeNumberValue.setValue("2000000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(inputTypeRangeValue.element.value === "2").toBe(true);
    //
    inputTypeNumberValue.setValue("2300000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(inputTypeRangeValue.element.value === "3").toBe(true);
    //
    inputTypeNumberValue.setValue("2900000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(inputTypeRangeValue.element.value === "4").toBe(true);
    //
    inputTypeNumberValue.setValue("4000000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(inputTypeRangeValue.element.value === "5").toBe(true);
  });

  it("Отображение ползунка для мобильной версии", async () => {
    createComponent(true);
    const btnAdd = wrapper.find("#add");
    const btnSubstr = wrapper.find("#subtract");
    const inputTypeNumberValue = wrapper.find("[type='tel']");

    expect(inputTypeNumberValue.element.value === "1500000");
    expect(btnSubstr.attributes().disabled).toBe("disabled");
    btnAdd.trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value === "1800000");
    btnAdd.trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value === "2000000");
    btnAdd.trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value === "2500000");
    btnAdd.trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value === "3000000");
    btnAdd.trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value === "4100000");
    expect(btnAdd.attributes().disabled).toBe("disabled");
    btnSubstr.trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value === "3000000");
    btnSubstr.trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value === "2500000");
    btnSubstr.trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value === "2000000");
    btnSubstr.trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value === "1800000");
    btnSubstr.trigger("click");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(btnSubstr.attributes().disabled).toBe("disabled");
  });
});
