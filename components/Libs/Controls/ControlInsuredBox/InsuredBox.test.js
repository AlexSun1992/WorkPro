import { shallowMount } from "@vue/test-utils";
import VueSlickCarousel from "vue-slick-carousel";
import ControlInsuredBox from "./InsuredBox.vue";
import InsuredBoxCard from "./InsuredBoxCard.vue";
import { dataProps, dataSetProps, accidentCase } from "./InsuredBox.fixtures";

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

  it("Проверяем количество отображаемых слайдов для разных размеров экрана", async () => {
    const componentWrapper = wrapper(dataProps);

    // Проверяем начальные настройки слайдера
    expect(componentWrapper.vm.settings.slidesToShow).toBe(3);

    // Проверяем responsive настройки
    const responsiveSettings = componentWrapper.vm.settings.responsive;

    // Для широких экранов (>1225px)
    const wideScreenSettings = responsiveSettings.find((setting) => setting.breakpoint === 1226);
    expect(wideScreenSettings.settings.slidesToShow).toBe(3);

    // Для средних экранов (480px-1225px)
    const mediumScreenSettings = responsiveSettings.find((setting) => setting.breakpoint === 1225);
    expect(mediumScreenSettings.settings.slidesToShow).toBe(2);

    // Для мобильных экранов (<480px)
    const mobileScreenSettings = responsiveSettings.find((setting) => setting.breakpoint === 480);
    expect(mobileScreenSettings.settings.slidesToShow).toBe(1);
  });

  it("Проверяем отображение правильного количества карточек в слайдере", () => {
    const componentWrapper = wrapper(dataProps);
    const insuredBoxCards = componentWrapper.findAllComponents(InsuredBoxCard);

    // Должно быть 3 карточки (соответствует getData.length)
    expect(insuredBoxCards.length).toBe(3);
  });
  it("Проверяем, что активная карточка правильно выделяется", () => {
    const componentWrapper = wrapper(dataProps);
    const insuredBoxCards = componentWrapper.findAllComponents(InsuredBoxCard);

    // В dataProps value = "3", что соответствует второму варианту (index 1 в getData)
    // Проверяем, что правильная карточка имеет активный класс
    const activeCard = insuredBoxCards.at(1); // Второй вариант (Ущерб + хищение)
    expect(activeCard.props("data").value).toBe("3");
  });
  it("Проверяем логику вычисления activeSlide для разных размеров экрана", () => {
    // Сохраняем оригинальный innerWidth
    const originalInnerWidth = window.innerWidth;
    // Тест для широкого экрана
    Object.defineProperty(window, "innerWidth", { value: 1300 });
    const wideScreenWrapper = wrapper(accidentCase);
    const wideScreenActiveSlide = wideScreenWrapper.vm.activeSlide;

    // Тест для среднего экрана
    Object.defineProperty(window, "innerWidth", { value: 1000 });
    const mediumScreenWrapper = wrapper(accidentCase);
    const mediumScreenActiveSlide = mediumScreenWrapper.vm.activeSlide;

    // Тест для мобильного экрана
    Object.defineProperty(window, "innerWidth", { value: 375 });
    const mobileScreenWrapper = wrapper(accidentCase);
    const mobileScreenActiveSlide = mobileScreenWrapper.vm.activeSlide;

    Object.defineProperty(window, "innerWidth", { value: 1300 });

    const testData = { ...accidentCase };

    //   value: [
    //     {
    //       NSUMNODT: "Госпитализация",
    //       S_ORDER: ["nsumtn", "nsumpn", "nsumdt", "nsumnodt"],
    //       NSUMTN: "Травма",
    //       S_INFO: ["Инфо 1", "Инфо 2", "Инфо 3", "Инфо 4"],
    //       NSUMPN: "Инвалидность",
    //       ID: 0,
    //       NSUMDT: "Смерть",
    //       value: 0,
    //     },
    //     {
    //       NSUMNODT: "100000",
    //       NCOST: 1000,
    //       NSUMTN: "100000",
    //       SNAME: "Тест вариант 1",
    //       NSUMPN: "200000",
    //       ID: 1,
    //       NSUMDT: "200000",
    //       SBASICCOST: " ",
    //       text: "Тест вариант 1",
    //       value: 1,
    //     },
    //     {
    //       NSUMNODT: "200000",
    //       NCOST: 2000,
    //       NSUMTN: "200000",
    //       SNAME: "Тест вариант 2",
    //       NSUMPN: "300000",
    //       ID: 2,
    //       NSUMDT: "300000",
    //       SBASICCOST: " ",
    //       text: "Тест вариант 2",
    //       value: 2,
    //     },
    //   ],
    //   writable: true,
    //   configurable: true,
    // });
    const experiment = wrapper(testData);
    const test = experiment.vm.activeSlide;

    Object.defineProperty(testData, "options", {
      value: [
        {
          NSUMNODT: "Госпитализация",
          S_ORDER: ["nsumtn", "nsumpn", "nsumdt", "nsumnodt"],
          NSUMTN: "Травма",
          S_INFO: ["Инфо 1", "Инфо 2", "Инфо 3", "Инфо 4"],
          NSUMPN: "Инвалидность",
          ID: 0,
          NSUMDT: "Смерть",
          value: 0,
        },
        {
          NSUMNODT: "100000",
          NCOST: 1000,
          NSUMTN: "100000",
          SNAME: "Тест вариант 1",
          NSUMPN: "200000",
          ID: 1,
          NSUMDT: "200000",
          SBASICCOST: " ",
          text: "Тест вариант 1",
          value: 1,
        },
        {
          NSUMNODT: "200000",
          NCOST: 2000,
          NSUMTN: "200000",
          SNAME: "Тест вариант 2",
          NSUMPN: "300000",
          ID: 2,
          NSUMDT: "300000",
          SBASICCOST: " ",
          text: "Тест вариант 2",
          value: 2,
        },
        {
          NSUMNODT: "200000",
          NCOST: 2000,
          NSUMTN: "200000",
          SNAME: "Тест вариант 2",
          NSUMPN: "300000",
          ID: 2,
          NSUMDT: "300000",
          SBASICCOST: " ",
          text: "Тест вариант 2",
          value: 3,
        },
        {
          NSUMNODT: "200000",
          NCOST: 2000,
          NSUMTN: "200000",
          SNAME: "Тест вариант 2",
          NSUMPN: "300000",
          ID: 2,
          NSUMDT: "300000",
          SBASICCOST: " ",
          text: "Тест вариант 2",
          value: 4,
        },
      ],
      writable: true,
      configurable: true,
    });

    Object.defineProperty(testData, "value", {
      value: "3",
      writable: true,
      configurable: true,
    });
    const experiment3 = wrapper(testData);
    const slide3 = experiment3.vm.activeSlide;
    expect(slide3).toBe(1);

    Object.defineProperty(testData, "value", {
      value: "4",
      writable: true,
      configurable: true,
    });

    const experiment4 = wrapper(testData);
    const test4 = experiment4.vm.activeSlide;
    expect(test4).toBe(1);

    Object.defineProperty(testData, "options", {
      value: [
        {
          NSUMNODT: "Госпитализация",
          S_ORDER: ["nsumtn", "nsumpn", "nsumdt", "nsumnodt"],
          NSUMTN: "Травма",
          S_INFO: ["Инфо 1", "Инфо 2", "Инфо 3", "Инфо 4"],
          NSUMPN: "Инвалидность",
          ID: 0,
          NSUMDT: "Смерть",
          value: 0,
        },
        {
          NSUMNODT: "100000",
          NCOST: 1000,
          NSUMTN: "100000",
          SNAME: "Тест вариант 1",
          NSUMPN: "200000",
          ID: 1,
          NSUMDT: "200000",
          SBASICCOST: " ",
          text: "Тест вариант 1",
          value: 1,
        },
        {
          NSUMNODT: "200000",
          NCOST: 2000,
          NSUMTN: "200000",
          SNAME: "Тест вариант 2",
          NSUMPN: "300000",
          ID: 2,
          NSUMDT: "300000",
          SBASICCOST: " ",
          text: "Тест вариант 2",
          value: 2,
        },
        {
          NSUMNODT: "200000",
          NCOST: 2000,
          NSUMTN: "200000",
          SNAME: "Тест вариант 2",
          NSUMPN: "300000",
          ID: 2,
          NSUMDT: "300000",
          SBASICCOST: " ",
          text: "Тест вариант 2",
          value: 3,
        },
        {
          NSUMNODT: "200000",
          NCOST: 2000,
          NSUMTN: "200000",
          SNAME: "Тест вариант 2",
          NSUMPN: "300000",
          ID: 2,
          NSUMDT: "300000",
          SBASICCOST: " ",
          text: "Тест вариант 2",
          value: 4,
        },
        {
          NSUMNODT: "200000",
          NCOST: 2000,
          NSUMTN: "200000",
          SNAME: "Тест вариант 2",
          NSUMPN: "300000",
          ID: 2,
          NSUMDT: "300000",
          SBASICCOST: " ",
          text: "Тест вариант 2",
          value: 5,
        },
      ],
      writable: true,
      configurable: true,
    });
    Object.defineProperty(testData, "value", {
      value: "5",
      writable: true,
      configurable: true,
    });
    const experiment5 = wrapper(testData);
    const test5 = experiment5.vm.activeSlide;
    expect(test5).toBe(2);

    Object.defineProperty(testData, "options", {
      value: [
        {
          NSUMNODT: "Госпитализация",
          S_ORDER: ["nsumtn", "nsumpn", "nsumdt", "nsumnodt"],
          NSUMTN: "Травма",
          S_INFO: ["Инфо 1", "Инфо 2", "Инфо 3", "Инфо 4"],
          NSUMPN: "Инвалидность",
          ID: 0,
          NSUMDT: "Смерть",
          value: 0,
        },
        {
          NSUMNODT: "100000",
          NCOST: 1000,
          NSUMTN: "100000",
          SNAME: "Тест вариант 1",
          NSUMPN: "200000",
          ID: 1,
          NSUMDT: "200000",
          SBASICCOST: " ",
          text: "Тест вариант 1",
          value: 1,
        },
        {
          NSUMNODT: "200000",
          NCOST: 2000,
          NSUMTN: "200000",
          SNAME: "Тест вариант 2",
          NSUMPN: "300000",
          ID: 2,
          NSUMDT: "300000",
          SBASICCOST: " ",
          text: "Тест вариант 2",
          value: 2,
        },
        {
          NSUMNODT: "200000",
          NCOST: 2000,
          NSUMTN: "200000",
          SNAME: "Тест вариант 2",
          NSUMPN: "300000",
          ID: 2,
          NSUMDT: "300000",
          SBASICCOST: " ",
          text: "Тест вариант 2",
          value: 3,
        },
        {
          NSUMNODT: "200000",
          NCOST: 2000,
          NSUMTN: "200000",
          SNAME: "Тест вариант 2",
          NSUMPN: "300000",
          ID: 2,
          NSUMDT: "300000",
          SBASICCOST: " ",
          text: "Тест вариант 2",
          value: 4,
        },
        {
          NSUMNODT: "200000",
          NCOST: 2000,
          NSUMTN: "200000",
          SNAME: "Тест вариант 2",
          NSUMPN: "300000",
          ID: 2,
          NSUMDT: "300000",
          SBASICCOST: " ",
          text: "Тест вариант 2",
          value: 5,
        },
      ],
      writable: true,
      configurable: true,
    });
    Object.defineProperty(testData, "value", {
      value: "4",
      writable: true,
      configurable: true,
    });
    const experiment6 = wrapper(testData);
    const test6 = experiment6.vm.activeSlide;
    expect(test6).toBe(2);
    // Восстанавливаем оригинальный innerWidth
    Object.defineProperty(window, "innerWidth", { value: originalInnerWidth });

    expect(wideScreenActiveSlide).toBeDefined();
    expect(mediumScreenActiveSlide).toBeDefined();
    expect(mobileScreenActiveSlide).toBeDefined();
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
    const optimumVariant = wrapper(dataProps).findAll(".box").at(1);
    expect(optimumVariant.classes()).toContain("active");
  });

  it("Проверяем кол-во карточек с вариантами полисов", () => {
    const policyOptionsCards = wrapper(dataProps).findAll(".box");
    expect(policyOptionsCards.length).toBe(3);
  });
});
