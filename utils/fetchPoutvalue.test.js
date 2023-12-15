import {
  extractPoutvalue,
  isCabinetUrl,
  fetchPoutvalue,
} from "./fetchPoutvalue";

jest.useFakeTimers();

describe("Модуль тестирования значения url, возвращаемого из PoutValue", () => {
  let mockRouter;
  let windowOpenFn;
  let bvToaster;

  beforeEach(() => {
    windowOpenFn = jest.spyOn(window, "open");
    mockRouter = {
      push: jest.fn(),
    };

    bvToaster = {
      toast: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Извлекаем poutValue из массива", () => {
    const getPoutvalue = extractPoutvalue({
      data: [
        {
          POUTVALUE: "/cabinet/55/0/946/683/557DFB9F7B1F9A03D794EF8D2DC5AF65",
          REL: "557DFB9F7B1F9A03D794EF8D2DC5AF65",
          ID: 683,
        },
      ],
    });
    expect(getPoutvalue).toBe(
      "/cabinet/55/0/946/683/557DFB9F7B1F9A03D794EF8D2DC5AF65"
    );
  });

  it("Извлекаем poutValue из объекта", () => {
    const getPoutvalue = extractPoutvalue({
      POUTVALUE: "/cabinet/55/0/946/555/19C680810AAB448B21097F61110FF21E",
    });

    expect(getPoutvalue).toBe(
      "/cabinet/55/0/946/555/19C680810AAB448B21097F61110FF21E"
    );
  });

  it("Проверяем начинается ли url с cabinet", () => {
    const getPoutvalue = extractPoutvalue({
      POUTVALUE: "/cabinet/55/0/946/555/19C680810AAB448B21097F61110FF21E",
    });
    const isCabinet = isCabinetUrl(getPoutvalue, "/cabinet");
    expect(isCabinet).toBe(true);
  });

  it("Переход по внутренней ссылке", () => {
    fetchPoutvalue(
      {
        POUTVALUE: "/cabinet/55/0/946/555/19C680810AAB448B21097F61110FF21E",
      },
      { router: mockRouter }
    );
    expect(mockRouter.push).toHaveBeenCalledWith(
      "/cabinet/55/0/946/555/19C680810AAB448B21097F61110FF21E"
    );
    expect(windowOpenFn).not.toHaveBeenCalled();
  });

  it("Переход по внешней ссылке isInNewWindow === true, новая вкладка", () => {
    fetchPoutvalue(
      {
        POUTVALUE: "https://cabinet.mts.ru",
      },

      {
        router: mockRouter,

        isInNewWindow: true,

        toaster: bvToaster,
      }
    );
    jest.runAllTimers();
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(windowOpenFn).toHaveBeenCalledWith(
      "https://cabinet.mts.ru",
      "_blank"
    );
  });

  it("Переход по внешней ссылке при isInNewWindow===false (текущая вкладка)", () => {
    fetchPoutvalue(
      {
        POUTVALUE: "https://cabinet.mts.ru",
      },
      {
        router: mockRouter,

        isInNewWindow: false,

        toaster: bvToaster,
      }
    );
    jest.runAllTimers();
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(windowOpenFn).toHaveBeenCalled();
    expect(windowOpenFn).toHaveBeenCalledWith(
      "https://cabinet.mts.ru",
      "_self"
    );
    expect(bvToaster.toast).not.toHaveBeenCalled();
  });

  it("Переход по внешней ссылке при отсутствии третьего параметра (текущая вкладка)", () => {
    fetchPoutvalue(
      {
        POUTVALUE: "https://cabinet.mts.ru",
      },
      {
        router: mockRouter,
        toaster: bvToaster,
      }
    );
    jest.runAllTimers();

    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(windowOpenFn).toHaveBeenCalledWith(
      "https://cabinet.mts.ru",
      "_self"
    );
  });

  it("Переход по внешней ссылке при отсутствии третьего параметра (текущая вкладка)", () => {
    fetchPoutvalue(
      {
        POUTVALUE: "sdfsdf://cabinet.mts.ru",
      },
      {
        router: mockRouter,
        toaster: bvToaster,
      }
    );
    jest.runAllTimers();
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(windowOpenFn).toHaveBeenCalledWith(
      "sdfsdf://cabinet.mts.ru",
      "_self"
    );
  });

  it("Выход из функции при отсутствии значения poutvalue", () => {
    fetchPoutvalue(
      {
        POUTVALUE: null,
      },

      {
        router: mockRouter,

        isInNewWindow: true,

        toaster: bvToaster,
      }
    );
    jest.runAllTimers();
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(windowOpenFn).not.toHaveBeenCalledWith(
      "https://cabinet.mts.ru",
      "_blank"
    );
  });
});
