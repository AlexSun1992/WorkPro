import { mount } from "@vue/test-utils";

import ControlMultiSelect from "./ControlMultiSelect.vue";
import { data } from "./CardDoctorShedule.helper.fixtures";

describe("CardDoctorShedule", () => {
  test("Загрузились все элементы на странице", async () => {
    const copyData = JSON.parse(JSON.stringify(data));
    copyData.value = "[]";
    const wrapper = mount(ControlMultiSelect, {
      propsData: {
        data: copyData,
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("РЕСОавто-GAP");
    expect(wrapper.text()).toContain("Защита от несчастного случая");
    expect(wrapper.text()).toContain("РЕСОавто ПОМОЩЬ эконом");
    expect(wrapper.text()).toContain("РЕСОавто ПОМОЩЬ комфорт");
  });

  test("Загрузились все элементы на странице и все они не активные, если value не существует", async () => {
    const copyData = JSON.parse(JSON.stringify(data));
    delete copyData.value;
    const wrapper = mount(ControlMultiSelect, {
      propsData: {
        data: copyData,
      },
    });
    await wrapper.vm.$nextTick();

    const allChecbox = wrapper.findAll("input[type='checkbox']");

    expect(allChecbox.at(0).is(":checked")).toBe(false);
    expect(allChecbox.at(1).is(":checked")).toBe(false);
    expect(allChecbox.at(2).is(":checked")).toBe(false);
    expect(allChecbox.at(3).is(":checked")).toBe(false);
  });

  test("Загрузились все элементы на странице и все они не активные, если value не имеет значений", async () => {
    const copyData = JSON.parse(JSON.stringify(data));
    copyData.value = "[]";
    const wrapper = mount(ControlMultiSelect, {
      propsData: {
        data: copyData,
      },
    });
    await wrapper.vm.$nextTick();

    const allChecbox = wrapper.findAll("input[type='checkbox']");

    expect(allChecbox.at(0).is(":checked")).toBe(false);
    expect(allChecbox.at(1).is(":checked")).toBe(false);
    expect(allChecbox.at(2).is(":checked")).toBe(false);
    expect(allChecbox.at(3).is(":checked")).toBe(false);
  });

  test("Загрузились все элементы на странице и 2 из них активные, если value имеет значения", async () => {
    const copyData = JSON.parse(JSON.stringify(data));
    copyData.value = "[1,4]";
    const wrapper = mount(ControlMultiSelect, {
      propsData: {
        data: copyData,
      },
    });
    await wrapper.vm.$nextTick();

    const allChecbox = wrapper.findAll("input[type='checkbox']");
    expect(allChecbox.at(0).is(":checked")).toBe(true);
    expect(allChecbox.at(1).is(":checked")).toBe(false);
    expect(allChecbox.at(2).is(":checked")).toBe(false);
    expect(allChecbox.at(3).is(":checked")).toBe(true);
  });

  test("Загрузились все элементы на странице и 2 из них активные,если value имеет значения и еще 2 элемента были выбраны ", async () => {
    const copyData = JSON.parse(JSON.stringify(data));
    copyData.value = "[1,4]";
    const wrapper = mount(ControlMultiSelect, {
      propsData: {
        data: copyData,
      },
    });
    await wrapper.vm.$nextTick();

    const allChecbox = wrapper.findAll("input[type='checkbox']");
    await allChecbox.at(1).trigger("click");
    await allChecbox.at(2).trigger("click");

    expect(allChecbox.at(0).is(":checked")).toBe(true);
    expect(allChecbox.at(1).is(":checked")).toBe(true);
    expect(allChecbox.at(2).is(":checked")).toBe(true);
    expect(allChecbox.at(3).is(":checked")).toBe(true);
  });

  test("Кликнули на 1 input и он же стал активным", async () => {
    const copyData = JSON.parse(JSON.stringify(data));
    copyData.value = "[]";
    const wrapper = mount(ControlMultiSelect, {
      propsData: {
        data: copyData,
      },
    });
    const allChecbox = wrapper.findAll("input[type='checkbox']");
    await allChecbox.at(0).trigger("click");

    expect(allChecbox.at(0).is(":checked")).toBe(true);
    expect(allChecbox.at(1).is(":checked")).toBe(false);
    expect(allChecbox.at(2).is(":checked")).toBe(false);
    expect(allChecbox.at(3).is(":checked")).toBe(false);
  });

  test("Кликнули на 2-а input и они же стали активными", async () => {
    const copyData = JSON.parse(JSON.stringify(data));
    copyData.value = "[]";
    const wrapper = mount(ControlMultiSelect, {
      propsData: {
        data: copyData,
      },
    });
    const allChecbox = wrapper.findAll("input[type='checkbox']");
    await allChecbox.at(0).trigger("click");
    await allChecbox.at(2).trigger("click");

    expect(allChecbox.at(0).is(":checked")).toBe(true);
    expect(allChecbox.at(1).is(":checked")).toBe(false);
    expect(allChecbox.at(2).is(":checked")).toBe(true);
    expect(allChecbox.at(3).is(":checked")).toBe(false);
  });
});
