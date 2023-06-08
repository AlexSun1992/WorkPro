import {
  isBlackListOfRoute,
  generateRedirectURLWithRef,
} from "./router.helper";

describe("router.helper.js isBlackListOfAddresses", () => {
  it("Сложный url", () => {
    const redirectUrl = "https://reso.ru/login";
    const ref = "/cabinet/55/0/701?utm_slava=true&utm_kiril=false";
    const result = generateRedirectURLWithRef(redirectUrl, ref);
    expect(result).toBe(
      "https://reso.ru/login?ref=%2Fcabinet%2F55%2F0%2F701%3Futm_slava%3Dtrue%26utm_kiril%3Dfalse"
    );
  });

  it("Должен вернуть абсолютный url при наличии хоста", () => {
    const redirectUrl = "https://reso.ru/shop";
    const ref = "/osago";
    const result = generateRedirectURLWithRef(redirectUrl, ref);
    expect(result).toBe("https://reso.ru/shop?ref=%2Fosago");
  });

  it("Должен передавать адрес без фейкового хоста при url=''", () => {
    const redirectUrl = "/login";
    const ref = "";
    const result = generateRedirectURLWithRef(redirectUrl, ref);
    expect(result).toBe("/login");
  });

  it("Должен передавать адрес при отсутствии url(отсутствие аргумента)", () => {
    const redirectUrl = "/login";
    const result = generateRedirectURLWithRef(redirectUrl);
    expect(result).toBe("/login");
  });

  it("Должен передавать адрес без фейкового хоста при наличии url", () => {
    const redirectUrl = "/login";
    const ref =
      "/cabinet/wizard/741/55/0/742/0/0/?utm_source=email&utm_medium=but&utm_campaign=prolong";
    const result = generateRedirectURLWithRef(redirectUrl, ref);
    expect(result).toBe(
      "/login?ref=%2Fcabinet%2Fwizard%2F741%2F55%2F0%2F742%2F0%2F0%2F%3Futm_source%3Demail%26utm_medium%3Dbut%26utm_campaign%3Dprolong"
    );
  });

  it("Должен передавать адрес при url=/", () => {
    const redirectUrl = "/login";
    const ref = "/";
    const result = generateRedirectURLWithRef(redirectUrl, ref);
    expect(result).toBe("/login?ref=%2F");
  });

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
});
