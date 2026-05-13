// shortLink.test.js

import redirectShortLink from "./shortLink";

// ─────────────────────────────────────────────────────────────
// Константы и селекторы (единый стиль со смежными тестами)
// ─────────────────────────────────────────────────────────────
const API_URL = "/lk/free/v2/redirectShortLink";
const COOKIES = {
  token: "auth._token.local",
  refresh: "auth._refresh_token.local",
  sms: "sms_hash",
};
const PATHS = {
  expired: "/tech/link-expired/",
  smsConfirm: "/login/sms-confirm",
  defaultRedirect: "/",
};

describe("redirectShortLink middleware", () => {
  let redirect;
  let $axios;
  let $cookiz;
  let consoleErrorSpy;

  // ─────────────────────────────────────────────────────────────
  // Подготовка окружения
  // ─────────────────────────────────────────────────────────────
  beforeEach(() => {
    redirect = jest.fn();
    $axios = { post: jest.fn() };
    $cookiz = {
      set: jest.fn(),
      getAll: jest.fn().mockReturnValue({}),
    };
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // ─────────────────────────────────────────────────────────────
  // 1) Нет hash → сразу expired
  // ─────────────────────────────────────────────────────────────
  test("если hash отсутствует → редирект на /tech/link-expired/", async () => {
    // Arrange
    const context = {
      route: { params: {} },
      redirect,
      $axios,
      $cookiz,
    };

    // Act
    await redirectShortLink(context);

    // Assert
    expect(redirect).toHaveBeenCalledWith(PATHS.expired);
    expect($axios.post).not.toHaveBeenCalled();
    expect($cookiz.set).not.toHaveBeenCalled();
  });

  // ─────────────────────────────────────────────────────────────
  // 2) Токены получены → кладём куки и редиректим на REDIRECT_URL
  // ─────────────────────────────────────────────────────────────
  test("если пришли токены → сохраняем токены в куки и редиректим на REDIRECT_URL", async () => {
    // Arrange
    const context = {
      route: { params: { hash: "AbCdE1" } },
      redirect,
      $axios,
      $cookiz,
    };

    $axios.post.mockResolvedValueOnce({
      data: [
        {
          ACCESS_TOKEN: "ACCESS",
          REFRESH_TOKEN: "REFRESH",
          REDIRECT_URL: "/cabinet/wizard/1/2/3",
        },
      ],
    });

    // Act
    await redirectShortLink(context);

    // Assert
    expect($axios.post).toHaveBeenCalledWith(API_URL, { hash: "AbCdE1", accessToken: "" });
    expect($cookiz.set).toHaveBeenCalledWith(COOKIES.token, "Bearer ACCESS");
    expect($cookiz.set).toHaveBeenCalledWith(COOKIES.refresh, "REFRESH");
    expect(redirect).toHaveBeenCalledWith("/cabinet/wizard/1/2/3");
  });

  // ─────────────────────────────────────────────────────────────
  // 3) Токены получены, но REDIRECT_URL не пришёл → редиректим на /
  // ─────────────────────────────────────────────────────────────
  test("если пришли токены без REDIRECT_URL → редиректим на '/'", async () => {
    // Arrange
    const context = {
      route: { params: { hash: "AbCdE1" } },
      redirect,
      $axios,
      $cookiz,
    };

    $axios.post.mockResolvedValueOnce({
      data: [
        {
          ACCESS_TOKEN: "ACCESS",
          REFRESH_TOKEN: "REFRESH",
          // REDIRECT_URL отсутствует
        },
      ],
    });

    // Act
    await redirectShortLink(context);

    // Assert
    expect($axios.post).toHaveBeenCalledWith(API_URL, { hash: "AbCdE1", accessToken: "" });
    expect($cookiz.set).toHaveBeenCalledWith(COOKIES.token, "Bearer ACCESS");
    expect($cookiz.set).toHaveBeenCalledWith(COOKIES.refresh, "REFRESH");
    expect(redirect).toHaveBeenCalledWith(PATHS.defaultRedirect);
  });

  // ─────────────────────────────────────────────────────────────
  // 4) Токенов нет → начинаем SMS-флоу: кладём sms_hash и редиректим на /login/sms-confirm
  // ─────────────────────────────────────────────────────────────
  test("если токенов нет → начинаем SMS-флоу: кладём sms_hash и редиректим на /login/sms-confirm", async () => {
    // Arrange
    const context = {
      route: { params: { hash: "AbCdE1" } },
      redirect,
      $axios,
      $cookiz,
    };

    // Бэк вернул «ветку SMS»: без ACCESS/REFRESH
    $axios.post.mockResolvedValueOnce({
      data: [
        {
          PHONE: "(***) - *** - ** - 11",
          MESSAGE:
            "На номер (***) - *** - ** - 11 был выслан код подтверждения, пожалуйста введите его в соответствующее поле.",
          REDIRECT_URL: PATHS.smsConfirm,
        },
      ],
    });

    // Act
    await redirectShortLink(context);

    // Assert
    expect($axios.post).toHaveBeenCalledWith(API_URL, { hash: "AbCdE1", accessToken: "" });

    // Проверяем, что записали sms_hash (опции могут отличаться — проверяем минимум ключ/значение)
    const [name, value] = $cookiz.set.mock.calls[0];
    expect(name).toBe(COOKIES.sms);
    expect(value).toBe("AbCdE1");

    expect(redirect).toHaveBeenCalledWith(PATHS.smsConfirm);
  });

  // ─────────────────────────────────────────────────────────────
  // 5) Бизнес-ошибка от бэка (error.response.data.INFO) → лог и expired
  // ─────────────────────────────────────────────────────────────
  test("если INFO в ошибке бэка → логируем INFO и редиректим на /tech/link-expired/", async () => {
    // Arrange
    const context = {
      route: { params: { hash: "bad" } },
      redirect,
      $axios,
      $cookiz,
    };

    $axios.post.mockRejectedValueOnce({
      response: { data: { INFO: "link expired" } },
    });

    // Act
    await redirectShortLink(context);

    // Assert
    expect(consoleErrorSpy).toHaveBeenCalledWith("Ошибка shortLink: link expired");
    expect(redirect).toHaveBeenCalledWith(PATHS.expired);
  });

  // ─────────────────────────────────────────────────────────────
  // 6) Сетевая/иная ошибка без INFO → общий лог и expired
  // ─────────────────────────────────────────────────────────────
  test("если ошибка без INFO → логируем как 'Ошибка shortLink:' и редиректим на /tech/link-expired/", async () => {
    // Arrange
    const context = {
      route: { params: { hash: "AbCdE1" } },
      redirect,
      $axios,
      $cookiz,
    };

    const err = new Error("Network error");
    $axios.post.mockRejectedValueOnce(err);

    // Act
    await redirectShortLink(context);

    // Assert
    expect(consoleErrorSpy).toHaveBeenCalledWith("Ошибка shortLink:", err);
    expect(redirect).toHaveBeenCalledWith(PATHS.expired);
  });
});
