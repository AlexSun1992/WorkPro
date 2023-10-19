import { redirectSuccess } from "./PasswordRecoveryForm.helper";

describe("проверяем редирект", () => {
  it("проверяем redirect", () => {
    const address = redirectSuccess("/login");
    expect(address).toBe("/login");
  });

  it("проверяем на неверный формат переменной", () => {
    const wrongFormatFunction = () => redirectSuccess({});
    expect(wrongFormatFunction).toThrow("Неправильный формат redirectUrl");
  });

  it("проверяем на неверный формат переменной", () => {
    Object.defineProperty(window, "location", {
      value: {
        href: "test/testus?ref='js'",
      },
    });

    const addressEmptyString = redirectSuccess("/login");
    expect(addressEmptyString).toBe("'js'");
  });
});
