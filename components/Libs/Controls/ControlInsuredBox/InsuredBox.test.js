import { shallowMount } from "@vue/test-utils";
import VueSlickCarousel from "vue-slick-carousel";
import ControlInsuredBox from "./InsuredBox.vue";
import InsuredBoxCard from "./InsuredBoxCard.vue";
import { dataProps, dataSetProps } from "./InsuredBox.fixtures";

global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

describe("ControlInsuredBox test", () => {
  const wrapper = (Props) =>
    shallowMount(ControlInsuredBox, {
      components: { VueSlickCarousel },
      stubs: { InsuredBoxCard },
      propsData: {
        data: Props,
      },
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("Тестируем оторбражение кнопок с ссылками", () => {
    const htmlContent = wrapper(dataSetProps);
    const insuredBoxCards = htmlContent.findAllComponents(InsuredBoxCard);

    insuredBoxCards.wrappers.forEach((cardWrapper, index) => {
      const downloadButton = cardWrapper.find("button");
      expect(downloadButton.exists()).toBe(true);
    });
  });
  it("Проверяем вызов метода downloadFile при клике на кнопку", async () => {
    const componentWrapper = wrapper(dataSetProps);
    const insuredBoxCard = componentWrapper.findComponent(InsuredBoxCard);
    // Мокаем метод downloadFile
    insuredBoxCard.vm.downloadFile = jest.fn();
    await insuredBoxCard.vm.$nextTick();

    const downloadButton = insuredBoxCard.find("button");
    await downloadButton.trigger("click");

    expect(insuredBoxCard.vm.downloadFile).toHaveBeenCalledWith(
      "https://reso.ru/export/sites/reso/individual/medicine/tick/docs/tick300_2023.pdf"
    );
  });
  it("Проверяем, что событие не всплывает при клике на кнопку скачивания", async () => {
    const componentWrapper = wrapper(dataSetProps);
    const insuredBoxCard = componentWrapper.findComponent(InsuredBoxCard);

    // Мокаем метод updateField родительского компонента
    const updateFieldMock = jest.fn();
    componentWrapper.vm.updateField = updateFieldMock;

    const downloadButton = insuredBoxCard.find("button");
    await downloadButton.trigger("click");

    // Проверяем, что родительский метод не был вызван
    expect(updateFieldMock).not.toHaveBeenCalled();
  });

  it("Проверяем успешное скачивание файла", async () => {
    const mockBlob = new Blob(["test content"], { type: "application/pdf" });
    const mockResponse = {
      ok: true,
      blob: jest.fn().mockResolvedValue(mockBlob),
    };

    fetch.mockResolvedValue(mockResponse);
    global.URL.createObjectURL.mockReturnValue("blob:test-url");

    const componentWrapper = wrapper(dataSetProps);
    const insuredBoxCard = componentWrapper.findComponent(InsuredBoxCard);

    await insuredBoxCard.vm.downloadFile(
      "https://reso.ru/export/sites/reso/individual/medicine/tick/docs/tick300_2023.pdf",
      "document.pdf"
    );

    expect(fetch).toHaveBeenCalledWith("/export/sites/reso/individual/medicine/tick/docs/tick300_2023.pdf");
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
  });

  it("Проверяем отображение компонента InsuredBox", () => {
    expect(wrapper(dataProps)).not.toBe(null);
  });

  it("Проверка на то что предвыбран оптимальный вариант", () => {
    const optimumVariant = wrapper(dataProps).findAll(".box-blue").at(0);
    expect(optimumVariant.classes()).toContain("active");
  });

  it("Проверяем кол-во карточек с вариантами полисов", () => {
    const policyOptionsCards = wrapper(dataProps).findAll(".box");
    expect(policyOptionsCards.length).toBe(3);
  });

  it("Проверяем кол-во синих карточек с вариантами полисов", () => {
    const policyOptionsCards = wrapper(dataProps).findAll(".box-blue");
    expect(policyOptionsCards.length).toBe(1);
  });

  it("Проверяем кол-во зеленых карточек с вариантами полисов", () => {
    const policyOptionsCards = wrapper(dataProps).findAll(".box-green");
    expect(policyOptionsCards.length).toBe(2);
  });
});
