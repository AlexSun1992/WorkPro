import { isBlackListOfRoute } from "./router.helper";

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
});
