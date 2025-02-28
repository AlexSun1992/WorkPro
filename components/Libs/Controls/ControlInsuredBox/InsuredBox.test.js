import { shallowMount } from "@vue/test-utils";
import VueSlickCarousel from "vue-slick-carousel";
import ControlInsuredBox from "./InsuredBox.vue";
import InsuredBoxCard from "./InsuredBoxCard.vue";

describe("ControlInsuredBox test", () => {
  const dataProps = {
    options: [
      {
        ID: 1,
        IDFRANCHISE: "NULL",
        NPRICE: 0,
        SACCIDENT: "Последствия ДТП",
        SACTIONS: "Действия 3-х лиц",
        SFOREIGNOBJECTS: "Падение или Попадание инородных предметов",
        SFRANCHISE: "Франшиза",
        SNAME: "scaption",
        S_INFO: ["Тест1", "Тест2", "", "Тест4"],
        S_ORDER: ["NSUMTN", "NSUMPN", "NSUMDT", "NSUMNODT"],
        SNOEVENTRESTRICTIONS: "Без ограничений по страховым событиям",
        SREPAIR: "Ремонт без справок",
        STHEFTVEH: "Хищение ТС",
        text: "scaption",
        value: 1,
      },
      {
        ID: 2,
        BDEFAULT: true,
        IDFRANCHISE: "NULL",
        NPRICE: 262797,
        SACCIDENT: "N",
        SACTIONS: "N",
        SFOREIGNOBJECTS: "N",
        SFRANCHISE: "N",
        SNAME: "Только Хищение",
        SNOEVENTRESTRICTIONS: "Y",
        SREPAIR: "N",
        STHEFTVEH: "Y",
        text: "Только Хищение",
        value: 2,
      },
      {
        ID: 3,
        BDEFAULT: false,
        IDFRANCHISE: "NULL",
        NPRICE: 437536,
        SACCIDENT: "Y",
        SACTIONS: "Y",
        SFOREIGNOBJECTS: "Y",
        SFRANCHISE: 100,
        SNAME: "Ущерб + хищение",
        SNOEVENTRESTRICTIONS: "Y",
        SREPAIR: "Y",
        STHEFTVEH: "Y",
        text: "Ущерб + хищение",
        value: 3,
      },
      {
        ID: 4,
        BDEFAULT: false,
        IDFRANCHISE: "NULL",
        NPRICE: 471752,
        SACCIDENT: "Y",
        SACTIONS: "Y",
        SFOREIGNOBJECTS: "Y",
        SFRANCHISE: "Без франшизы",
        SNAME: "Ущерб + хищение",
        SNOEVENTRESTRICTIONS: "Y",
        SREPAIR: "Y",
        STHEFTVEH: "Y",
        text: "Ущерб + хищение",
        value: 4,
      },
    ],
    name: "IDVARIANT_LIST",
    type: "InsuredBox",
    fieldId: 52790,
    value: "3",
  };
  const wrapper = shallowMount(ControlInsuredBox, {
    components: { VueSlickCarousel },
    stubs: { InsuredBoxCard },
    propsData: {
      data: dataProps,
    },
  });

  it("Проверяем отображение компонента InsuredBox", () => {
    expect(wrapper).not.toBe(null);
  });

  it("Проверка на то что предвыбран оптимальный вариант", () => {
    const optimumVariant = wrapper.findAll(".box-blue").at(0);
    expect(optimumVariant.classes()).toContain("active");
  });

  it("Проверяем кол-во карточек с вариантами полисов", () => {
    const policyOptionsCards = wrapper.findAll(".box");
    expect(policyOptionsCards.length).toBe(3);
  });

  it("Проверяем кол-во синих карточек с вариантами полисов", () => {
    const policyOptionsCards = wrapper.findAll(".box-blue");
    expect(policyOptionsCards.length).toBe(1);
  });

  it("Проверяем кол-во зеленых карточек с вариантами полисов", () => {
    const policyOptionsCards = wrapper.findAll(".box-green");
    expect(policyOptionsCards.length).toBe(2);
  });
});
