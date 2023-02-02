import { isBlackListOfRoute } from "./router.helper";

describe("router.helper.js isBlackListOfAddresses", () => {
  it("Если idModule равен 55, то не показывать ошибку", () => {
    expect(isBlackListOfRoute("55", "0")).toBeFalsy();
  });
  it("Если idModule равен 55, то не показывать ошибку", () => {
    expect(isBlackListOfRoute("55", "900")).toBeFalsy();
  });
  it("Если idModule равен 55, а idParent равен 913 то показать ошибку", () => {
    expect(isBlackListOfRoute("55", "913")).toBeTruthy();
  });
  it("Если idModule не равен 55, а idParent равен 915 то показать ошибку", () => {
    expect(isBlackListOfRoute("56", "915")).toBeTruthy();
  });
  it("Если idModule не равен 55,  а idParent равен 91 то показать ошибку", () => {
    expect(isBlackListOfRoute("65", "912")).toBeTruthy();
  });
  it("Если idModule равен строке, то не показать ошибку", () => {
    expect(isBlackListOfRoute("telemed")).toBeFalsy();
  });
  it("Если idModule равен строке, то не показать ошибку", () => {
    expect(isBlackListOfRoute("sgfjhfskjsksfgjk")).toBeFalsy();
  });
});
