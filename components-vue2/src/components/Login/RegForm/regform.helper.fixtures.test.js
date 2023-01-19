import { passwordValidation } from "./regform.helper.fixtures";

describe("regform.helper.fixtures.js", () => {
  it("Если поле пароля пустое, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("");
    expect(passwordValidationMessage).toContain({
      errorText: "Пароль должен содержать от 6 до 20 символов.",
    });
  });
});
