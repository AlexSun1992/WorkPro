import { shallowMount, createLocalVue } from "@vue/test-utils";
import FormBlock from "./FormBlock";

const localVue = createLocalVue();

function mountWithData(dataArr) {
  return shallowMount(FormBlock, {
    localVue,
    propsData: { data: dataArr },
    mocks: {
      $route: {
        params: {
          formId: "123",
          idRel: "SOMERELVALUE",
          idCard: "123456",
          idItem: "712",
          idModule: "55",
          idParent: "0",
        },
      },
      $store: {
        state: {},
        getters: {
          "data_card/getForm": [],
          "menu/flatmenu": [],
        },
      },
    },
  });
}

const namesFromForms = (forms) => forms.reduce((acc, pageArr) => acc.concat(pageArr.map((i) => i.name)), []);

describe("FormBlock.computed.forms", () => {
  test("группирует ТОЛЬКО видимые элементы по страницам и удаляет пустые", () => {
    const src = [
      { page: 1, type: "label", visible: true, name: "A" },
      { page: 1, type: "label", visible: false, name: "HIDDEN" },
      { page: 2, type: "label", visible: true, name: "B" },
    ];
    const w = mountWithData(src);
    const { forms } = w.vm;

    expect(forms.length).toBe(2);
    expect(forms[0].map((i) => i.name)).toEqual(["A"]);
    expect(forms[1].map((i) => i.name)).toEqual(["B"]);
  });

  test("переносит WizardButton с последней страницы, если там больше ничего нет, на последнюю страницу с другими элементами", () => {
    const src = [
      { page: 1, type: "label", visible: true, name: "A" },
      { page: 2, type: "WizardButton", visible: true, name: "WB2" },
    ];
    const snapshot = JSON.parse(JSON.stringify(src));
    const w = mountWithData(src);
    const { forms } = w.vm;

    expect(forms.length).toBe(1);
    const names = forms[0].map((i) => i.name).sort();
    expect(names).toEqual(["A", "WB2"].sort());

    expect(src).toEqual(snapshot);
  });

  test("переносит цепочку хвостовых страниц только с WizardButton и удаляет их", () => {
    const src = [
      { page: 1, type: "label", visible: true, name: "A" },
      { page: 2, type: "WizardButton", visible: true, name: "WB2" },
      { page: 3, type: "WizardButton", visible: true, name: "WB3" },
    ];
    const w = mountWithData(src);
    const { forms } = w.vm;

    expect(forms.length).toBe(1);
    const names = forms[0].map((i) => i.name).sort();
    expect(names).toEqual(["A", "WB2", "WB3"].sort());
  });

  test("если нет ни одной страницы с не-Wizard элементами — ничего не переносит", () => {
    const src = [
      { page: 1, type: "WizardButton", visible: true, name: "WB1" },
      { page: 2, type: "WizardButton", visible: true, name: "WB2" },
    ];
    const w = mountWithData(src);
    const { forms } = w.vm;

    expect(forms.length).toBe(2);
    expect(forms[0].map((i) => i.name)).toEqual(["WB1"]);
    expect(forms[1].map((i) => i.name)).toEqual(["WB2"]);
  });

  test("невидимые WizardButton на последней странице игнорируются → пустая страница вырезается", () => {
    const src = [
      { page: 1, type: "label", visible: true, name: "A" },
      { page: 2, type: "WizardButton", visible: false, name: "WB2" },
    ];
    const w = mountWithData(src);
    const { forms } = w.vm;

    expect(forms.length).toBe(1);
    expect(forms[0].map((i) => i.name)).toEqual(["A"]);
  });
});
describe("FormBlock.computed.forms — исключение WizardButton на page === 100", () => {
  test("WB на странице 100 полностью игнорируется (не рендерится и не переносится)", () => {
    const src = [
      { page: 1, type: "label", visible: true, name: "A" },
      { page: 2, type: "label", visible: true, name: "B" },
      { page: 100, type: "WizardButton", visible: true, name: "WB100" }, // должен быть исключён
    ];
    const w = mountWithData(src);
    const { forms } = w.vm;
    const names = namesFromForms(forms);

    expect(forms.length).toBe(2);
    expect(names).toContain("A");
    expect(names).toContain("B");
    expect(names).not.toContain("WB100");
  });

  test("хвостовые WB переносятся на последнюю «нормальную» страницу, WB на 100-й игнорируется", () => {
    const src = [
      { page: 1, type: "label", visible: true, name: "A" },
      { page: 3, type: "WizardButton", visible: true, name: "WB3" },
      { page: 100, type: "WizardButton", visible: true, name: "WB100" },
    ];
    const w = mountWithData(src);
    const { forms } = w.vm;
    const names = namesFromForms(forms).sort();

    expect(forms.length).toBe(1);
    expect(names).toEqual(["A", "WB3"].sort());
    expect(names).not.toContain("WB100");
  });
});
