import { isBlackListOfRoute, redirectTo } from "./router.helper";

describe("router.helper.js isBlackListOfAddresses", () => {
  it("Правильный маршрут", () => {
    expect(isBlackListOfRoute("55", "0", "912")).toBe(false);
  });

  it("Если не 0, то происходи редирект на 404", () => {
    expect(isBlackListOfRoute("55", "1", "701")).toBe(true);
  });

  it("Если маршрут в черном списке, то происходи редирект на 404", () => {
    expect(isBlackListOfRoute("55", "0", "913")).toBe(true);
    expect(isBlackListOfRoute("55", "0", "918")).toBe(true);
  });

  it("Если модуль не в белом списке и не строка, то происходи редирект на 404", () => {
    expect(isBlackListOfRoute("65", "0", "701")).toBe(true);
  });

  it("Если модуль строка, то не происходи редирект", () => {
    expect(isBlackListOfRoute("telemed")).toBe(false);
  });

  it("Если модуль строка, то не происходи редирект", () => {
    expect(isBlackListOfRoute("6jjjjjj6")).toBe(false);
  });

  describe("тестирование функции redirectTo", () => {
    it("функция добавляет новые utm метки, сохраняя предыдущие", () => {
      const fromUrl =
        "/cabinet/wizard/987/55/0/988/0/0?utm_source=app&utm_medium=free&utm_test=banner_go_away&utm_mve=forward";
      const toUrl =
        "/cabinet/wizard/987/55/0/988/0/0?utm_source=app&utm_medium=free&utm_test=banner_go&utm_campaign=banner_go";
      const newUrl = redirectTo(toUrl, fromUrl);
      expect(newUrl).toBe(
        "/cabinet/wizard/987/55/0/988/0/0?utm_source=app&utm_medium=free&utm_test=banner_go&utm_campaign=banner_go&utm_mve=forward"
      );
    });

    it("функция добавляет новые utm метки, сохраняя предыдущие отсутсвие host", () => {
      const fromUrl =
        "http://localhost:8000/cabinet/wizard/987/55/0/988/0/0?utm_source=app&utm_medium=free&utm_test=banner_go_away&utm_mve=forward";
      const toUrl = "/login?utm_to2=to2";
      const newUrl = redirectTo(toUrl, fromUrl);
      expect(newUrl).toBe(
        "/login?utm_to2=to2&utm_source=app&utm_medium=free&utm_test=banner_go_away&utm_mve=forward"
      );
    });

    it("При отсутсвии utm меток во fromURL возвращает исходный toUrl", () => {
      const fromUrl = "http://localhost:8000/cabinet/wizard/987/55/0/988/0/0";
      const toUrl =
        "http://local:8000/cabinet/wizard/987/55/0/988/0/0?utm_source=app&utm_medium=free&utm_test=banner_go_away&utm_mve=forward";
      const redirectUrl = redirectTo(toUrl, fromUrl);
      expect(redirectUrl).toBe(
        "/cabinet/wizard/987/55/0/988/0/0?utm_source=app&utm_medium=free&utm_test=banner_go_away&utm_mve=forward"
      );
    });

    it("Функция добавляет новые utm метки при полном их отсутствии у toURL ", () => {
      const from =
        "http://localhost:8000/cabinet/wizard/987/55/0/988/0/0?utm_source=app&utm_medium=free&utm_test=banner_go_away&utm_mve=forward";
      const toUrl = "http://localhost:8000/cabinet/wizard/987/55/0/988/0/0";
      const newUrl = redirectTo(from, toUrl);
      expect(newUrl).toBe(
        "/cabinet/wizard/987/55/0/988/0/0?utm_source=app&utm_medium=free&utm_test=banner_go_away&utm_mve=forward"
      );
    });

    it("Функция возвращает toUrl при отсутствии utm во fromUrl и в toUrl", () => {
      const fromUrl = "http://localhost:8000/cabinet/wizard";
      const toUrl = "http://localhost:8000/cabinet/wizard/987/55/0/988/0/0";
      const newUrl = redirectTo(toUrl, fromUrl);
      expect(newUrl).toBe("/cabinet/wizard/987/55/0/988/0/0");
    });

    it("Работа функции при отсутствии hostname в исходных url", () => {
      const fromUrl = "/cabinet/55/0/701";
      const toUrl = "/login";
      const newUrl = redirectTo(toUrl, fromUrl);
      expect(newUrl).toBe("/login");
    });

    it("Возвращаем содержащиеся метки при отсутствии hostname в toUrl", () => {
      const fromUrl =
        "/cabinet/wizard/987/55/0/988/0/0?utm_source=app&utm_medium=free&utm_campaign=banner_go";
      const toUrl = "/login";
      const newUrl = redirectTo(toUrl, fromUrl);
      expect(newUrl).toBe(
        "/login?utm_source=app&utm_medium=free&utm_campaign=banner_go"
      );
    });

    it("не копирует ненужную метку", () => {
      const fromUrl =
        "/cabinet/wizard/987/55/0/988/0/0?utmno=notcopy&notcopy=notcopy";
      const toUrl = "/login";
      const newUrl = redirectTo(toUrl, fromUrl);
      expect(newUrl).toBe("/login");
    });

    it("копирует utm-метки", () => {
      const fromUrl =
        "/cabinet/wizard/987/55/0/988/0/0?utm_correct=should_copy";
      const toUrl = "/login";
      const newUrl = redirectTo(toUrl, fromUrl);
      expect(newUrl).toBe("/login?utm_correct=should_copy");
    });

    it("перезаписывает utm-метки", () => {
      const fromUrl =
        "/cabinet/wizard/987/55/0/988/0/0?utm_correct=should_copy";
      const toUrl = "/login?utm_correct=first_priority";
      const newUrl = redirectTo(toUrl, fromUrl);
      expect(newUrl).toBe("/login?utm_correct=first_priority");
    });

    it("не должен ставить лишний вопрос", () => {
      const fromUrl =
        "/cabinet/wizard/987/55/0/988/0/0?utm_correct=should_copy&utm_no=notcopy";
      const toUrl = "/login?query";
      const newUrl = redirectTo(toUrl, fromUrl);
      expect(newUrl).toBe(
        "/login?query=&utm_correct=should_copy&utm_no=notcopy"
      );
    });

    it("можно вызвать с одним параметром", () => {
      Object.defineProperty(window, "location", {
        value: {
          href: "http://www.website.com?varName=foo&utm_no=test",
        },
        configurable: true,
      });
      const toUrl = "/login?query&second";
      const newUrl = redirectTo(toUrl);
      expect(newUrl).toBe("/login?query=&second=&utm_no=test");
    });

    it("игнорирует домен", () => {
      const fromUrl = "http://ya.ru/cabinet";
      const toUrl = "https://localhost:8080/login";
      const newUrl = redirectTo(toUrl, fromUrl);
      expect(newUrl).toBe("/login");
    });
  });
});
