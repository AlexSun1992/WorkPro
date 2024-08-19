import { mount } from "@vue/test-utils";

import CardDoctorShedule from "./CardDoctorSchedule.vue";

import { propsData } from "./CardDoctorShedule.helper.fixtures";

describe("CardDoctorShedule", () => {
  it("Показывается 4 календарных дня", async () => {
    const wrapper = mount(CardDoctorShedule, {
      propsData,
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("17 июля");
    expect(wrapper.text()).toContain("18 июля");
    expect(wrapper.text()).toContain("19 июля");
    expect(wrapper.text()).toContain("22 июля");

    expect(wrapper.text()).not.toContain("13 июля");
  });

  it("Показывается 1 активный каледарный день", async () => {
    const wrapper = mount(CardDoctorShedule, {
      propsData,
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.find("div.doc-date.active").text()).toBe("17 июля");

    expect(wrapper.find("div.doc-date.active").text()).not.toBe("18 июля");
    expect(wrapper.find("div.doc-date.active").text()).not.toBe("19 июля");
    expect(wrapper.find("div.doc-date.active").text()).not.toBe("22 июля");
  });

  it("При клике на кнопку '>' даты сдвигаются на 4 элемент, если всего лементов 8", async () => {
    const wrapper = mount(CardDoctorShedule, {
      propsData,
    });
    await wrapper.vm.$nextTick();

    await wrapper.find(".next-date-recording").trigger("click");

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).not.toContain("17 июля");
    expect(wrapper.text()).not.toContain("18 июля");
    expect(wrapper.text()).not.toContain("19 июля");
    expect(wrapper.text()).not.toContain("22 июля");

    expect(wrapper.text()).toContain("25 июля");
    expect(wrapper.text()).toContain("26 июля");
    expect(wrapper.text()).toContain("27 июля");
    expect(wrapper.text()).toContain("28 июля");
  });

  it("При клике на кнопку '>' даты сдвигаются на 4 элемент, если всего лементов 8 и активный первый элемент", async () => {
    const wrapper = mount(CardDoctorShedule, {
      propsData,
    });
    await wrapper.vm.$nextTick();

    await wrapper.find(".next-date-recording").trigger("click");

    await wrapper.vm.$nextTick();

    expect(wrapper.find("div.doc-date.active").text()).toBe("25 июля");

    expect(wrapper.find("div.doc-date.active").text()).not.toBe("17 июля");
    expect(wrapper.find("div.doc-date.active").text()).not.toBe("26 июля");
    expect(wrapper.find("div.doc-date.active").text()).not.toBe("27 июля");
    expect(wrapper.find("div.doc-date.active").text()).not.toBe("28 июля");
  });

  it("При клике на кнопку '<' даты сдвигаются на 4 элемент, если всего лементов 8 и активный первый элемент", async () => {
    const wrapper = mount(CardDoctorShedule, {
      propsData,
    });
    await wrapper.vm.$nextTick();

    await wrapper.find(".prev-date-recording").trigger("click");

    await wrapper.vm.$nextTick();

    expect(wrapper.find("div.doc-date.active").text()).toBe("17 июля");

    expect(wrapper.find("div.doc-date.active").text()).not.toBe("25 июля");
    expect(wrapper.find("div.doc-date.active").text()).not.toBe("26 июля");
    expect(wrapper.find("div.doc-date.active").text()).not.toBe("27 июля");
    expect(wrapper.find("div.doc-date.active").text()).not.toBe("28 июля");
  });

  it("Если общее количество дней больше 4, то активная кнопка только '>'", async () => {
    const wrapper = mount(CardDoctorShedule, {
      propsData,
    });
    await wrapper.vm.$nextTick();

    await wrapper.find(".prev-date-recording").trigger("click");

    await wrapper.vm.$nextTick();

    expect(wrapper.find("button.prev-date-recording.active").exists()).toBe(
      false
    );
    expect(wrapper.find("button.prev-date-recording").exists()).toBe(true);

    expect(wrapper.find("button.next-date-recording.active").exists()).toBe(
      true
    );
    expect(wrapper.find("button.next-date-recording").exists()).toBe(true);
  });

  it("Если общее количество дней меньше 5, то кнопки '<' и '>' не активные", async () => {
    const clonePropsData = JSON.parse(JSON.stringify(propsData));
    delete clonePropsData.options.SDATETIMELIST;
    clonePropsData.options.SDATETIMELIST = [
      {
        DDATE: "2024-07-17",
        STIMELIST: [
          { DFROM: "18:00", DTO: "18:30" },
          { DFROM: "19:00", DTO: "19:30" },
          { DFROM: "20:00", DTO: "20:30" },
        ],
      },
      {
        DDATE: "2024-07-18",
        STIMELIST: [
          { DFROM: "16:00", DTO: "16:30" },
          { DFROM: "17:00", DTO: "17:30" },
          { DFROM: "18:00", DTO: "18:30" },
          { DFROM: "19:00", DTO: "19:30" },
          { DFROM: "20:00", DTO: "20:30" },
        ],
      },
      {
        DDATE: "2024-07-19",
        STIMELIST: [
          { DFROM: "16:00", DTO: "16:30" },
          { DFROM: "17:00", DTO: "17:30" },
          { DFROM: "18:00", DTO: "18:30" },
          { DFROM: "19:00", DTO: "19:30" },
          { DFROM: "20:00", DTO: "20:30" },
        ],
      },
    ];

    const wrapper = mount(CardDoctorShedule, {
      propsData: clonePropsData,
    });
    await wrapper.vm.$nextTick();

    await wrapper.find(".prev-date-recording").trigger("click");
    await wrapper.vm.$nextTick();

    expect(wrapper.find("button.prev-date-recording.active").exists()).toBe(
      false
    );
    expect(wrapper.find("button.prev-date-recording").exists()).toBe(true);

    expect(wrapper.find("button.next-date-recording.active").exists()).toBe(
      false
    );
    expect(wrapper.find("button.next-date-recording").exists()).toBe(true);
  });
});
