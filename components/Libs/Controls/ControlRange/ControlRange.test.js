import { mount } from "@vue/test-utils";
import {
  dataMockSeveralItems,
  dataMockTwolItems,
} from "./ControlRange.fixtures";
import ControlRange from "./ControlRange.vue";

describe("ControlRange", () => {
  let wrapper;

  const createComponent = (elements) => {
    wrapper = mount(ControlRange, elements);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("Изменение input[type='range'] при заполнении input[type='number']", async () => {
    createComponent(dataMockSeveralItems);
    const inputTypeNumberValue = wrapper.find("[type='tel']");
    inputTypeNumberValue.setValue("1800000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find("[type='range']").element.value).toBe("1");
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

  it("Изменение input[type='range'] при заполнении input[type='number']", async () => {
    createComponent(dataMockTwolItems);
    const inputTypeNumberValue = wrapper.find("[type='tel']");
    inputTypeNumberValue.setValue("1800000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find("[type='range']").element.value).toBe("1800000");

    inputTypeNumberValue.setValue("1600000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find("[type='range']").element.value).toBe("1600000");

    inputTypeNumberValue.setValue("2300000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find("[type='range']").element.value).toBe("2300000");

    inputTypeNumberValue.setValue("1700000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find("[type='range']").element.value).toBe("1700000");

    inputTypeNumberValue.setValue("1798761");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find("[type='range']").element.value).toBe("1798761");

    inputTypeNumberValue.setValue("3600000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find("[type='range']").element.value).toBe("3000000");
  });

  it("Изменение страховой суммы при изменении input[type='range']", async () => {
    createComponent(dataMockSeveralItems);
    const inputTypeRangeValue = wrapper.find("[type='range']");
    const inputTypeNumberValue = wrapper.find("[type='tel']");
    inputTypeRangeValue.setValue("0");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value).toBe("1 500 000₽");

    inputTypeRangeValue.setValue("1");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value).toBe("1 800 000₽");

    inputTypeRangeValue.setValue("2");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value).toBe("2 000 000₽");

    inputTypeRangeValue.setValue("3");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value).toBe("2 500 000₽");

    inputTypeRangeValue.setValue("4");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value).toBe("3 000 000₽");
    inputTypeRangeValue.setValue("5");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeNumberValue.element.value).toBe("4 100 000₽");
  });

  it("Плавающий ползунок изменение в компоненте", async () => {
    createComponent(dataMockSeveralItems);
    const inputTypeRangeValue = wrapper.find("[type='range']");
    const inputTypeNumberValue = wrapper.find("[type='tel']");

    inputTypeNumberValue.setValue("1400000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(inputTypeRangeValue.element.value).toBe("0");

    inputTypeNumberValue.setValue("1700000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeRangeValue.element.value).toBe("1");

    inputTypeNumberValue.setValue("2000000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeRangeValue.element.value).toBe("2");

    inputTypeNumberValue.setValue("2300000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(inputTypeRangeValue.element.value).toBe("3");

    inputTypeNumberValue.setValue("2900000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(inputTypeRangeValue.element.value).toBe("4");
    inputTypeNumberValue.setValue("4000000");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(inputTypeRangeValue.element.value).toBe("5");
  });

  it("Плавающий ползунок не измененяет значение, потому что disabled", async () => {
    const dataMock = JSON.parse(JSON.stringify(dataMockSeveralItems));
    dataMock.propsData.data.readonly = true;
    createComponent(dataMock);

    const inputTypeNumberValue = wrapper.find("[type='tel']");

    expect(inputTypeNumberValue.element.disabled).toBe(true);
  });

  it("Не работает кнопка +, потому что disabled", async () => {
    const dataMock = JSON.parse(JSON.stringify(dataMockSeveralItems));
    dataMock.propsData.data.readonly = true;
    createComponent(dataMock);

    const addButton = wrapper.find("#add");

    expect(addButton.element.disabled).toBe(true);
  });

  it("Не работает кнопка -, потому что disabled", async () => {
    const dataMock = JSON.parse(JSON.stringify(dataMockSeveralItems));
    dataMock.propsData.data.readonly = true;

    createComponent(dataMock);
    const subtractButton = wrapper.find("#subtract");

    expect(subtractButton.element.disabled).toBe(true);
  });

  it("При клике на элемент списка, значение [type='tel'] не изменится, потому что disabled", async () => {
    const dataMock = JSON.parse(JSON.stringify(dataMockTwolItems));
    dataMock.propsData.data.readonly = true;
    createComponent(dataMock);
    const inputTypeNumberValue = wrapper.find("[type='tel']");
    expect(inputTypeNumberValue.element.value).toBe("");

    const list = wrapper.find("li");
    await list.trigger("click");

    expect(inputTypeNumberValue.element.value).toBe("");
  });

  it("При клике на элемент списка, значение [type='tel']  изменится", async () => {
    const dataMock = JSON.parse(JSON.stringify(dataMockTwolItems));
    dataMock.propsData.data.readonly = false;
    createComponent(dataMock);
    const inputTypeNumberValue = wrapper.find("[type='tel']");
    expect(inputTypeNumberValue.element.value).toBe("");

    const list = wrapper.find("li");
    await list.trigger("click");

    expect(inputTypeNumberValue.element.value).toBe("100 000₽");
  });
});
