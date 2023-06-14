import { passwordValidation, passwordValidationDetail } from "./regform.helper";

describe("Валидация passwordValidation in regform.helper", () => {
  it("Успешный пароль", () => {
    const passwordValidationMessage = passwordValidation("Reso19910");
    expect(passwordValidationMessage).toEqual([]);
  });

  it("Не успешный пароль", () => {
    const passwordValidationMessage = passwordValidation("Reso");
    expect(passwordValidationMessage).toEqual([
      {
        errorText:
          "Требования к паролю: от 8 до 20 символов. Пароль должен состоять из латинских букв, содержать минимум одну цифру, одну заглавную и одну строчную буквы; также можно использовать спецсимволы: !#$%^*()-=+[]{};,.|/? (пробел исключён)",
      },
    ]);
  });
});

describe("Валидация компонента passwordValidationDetail in RegForm.vue", () => {
  it("Успешный пароль", () => {
    const passwordValidationMessage = passwordValidationDetail("Reso19910*y");
    expect(
      passwordValidationMessage[0].isError &&
        passwordValidationMessage[0].isError &&
        passwordValidationMessage[1].isError &&
        passwordValidationMessage[2].isError &&
        passwordValidationMessage[3].isError
    ).toBe(false);
  });

  it("Если поле пустое выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail("");
    expect(
      passwordValidationMessage[0].isError &&
        passwordValidationMessage[1].isError
    ).toBe(true);
  });

  it("Если поле содержит меньше 8 символов , то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail("1pR");
    expect(passwordValidationMessage[0].isError).toBe(true);
  });

  it("Если поле содержит больше 20 символов , то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail(
      "1kkkkkkkkkkkkkRkkkkkk"
    );
    expect(passwordValidationMessage[0].isError).toBe(true);
  });

  it("Если поле содержит русский символ , то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationDetail("1kkkkkRkkkkkkkkз");
    expect(passwordValidationMessage[3].isError).toBe(true);
  });

  it("Если поле содержит специальный символ , то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationDetail("1kkkkkRkkkkkkkk)");
    expect(
      passwordValidationMessage[0].isError &&
        passwordValidationMessage[0].isError &&
        passwordValidationMessage[1].isError &&
        passwordValidationMessage[2].isError &&
        passwordValidationMessage[3].isError
    ).toBe(false);
  });

  it("Если поле содержит запрещенный специальный символ , то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationDetail("1kkkkkRkkkkkkkk:");
    expect(passwordValidationMessage[3].isError).toBe(true);
  });

  it("Если поле содержит запрещенный специальный символ , то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationDetail(":1kkkkkRkkkkkkkk:");
    expect(passwordValidationMessage[3].isError).toBe(true);
  });

  it("Если поле содержит запрещенный специальный символ , то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationDetail("1kkkkkRkkkkkkkk  ");
    expect(passwordValidationMessage[2].isError).toBe(true);
  });

  it("Если поле содержит запрещенный специальный символ , то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationDetail(" 1kkkkkRkkkkkkkk");
    expect(passwordValidationMessage[2].isError).toBe(true);
  });

  it("Если поле содержит русские буквы и специальный символ , то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationDetail("1kkkkRkkkkkkkзk!");
    expect(passwordValidationMessage[3].isError).toBe(true);
  });

  it("Если поле содержит русские буквы, специальный символ и содержит меньше 8 символов, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail("1Rkз!");
    expect(
      passwordValidationMessage[3].isError &&
        passwordValidationMessage[0].isError
    ).toBe(true);
  });

  it("Если поле содержит русские буквы, специальный символ и содержит больше 20 символов, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail(
      "1kппппhhhhhhhhRhhhhhhhhhз!"
    );
    expect(
      passwordValidationMessage[3].isError &&
        passwordValidationMessage[0].isError
    ).toBe(true);
  });

  it("Если поле содержит русские буквы, специальный символ и нет цифр, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail("kппппhhhRhhз!");
    expect(
      passwordValidationMessage[3].isError &&
        passwordValidationMessage[1].isError
    ).toBe(true);
  });

  it("Если поле содержит русские буквы, специальный символ и нет латинских букв, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail("1111111пfппз!");
    expect(
      passwordValidationMessage[3].isError &&
        passwordValidationMessage[1].isError
    ).toBe(true);
  });

  it("Если поле содержит русские буквы, специальный символ и нет латинских букв, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail("gR");
    expect(
      passwordValidationMessage[0].isError &&
        passwordValidationMessage[1].isError
    ).toBe(true);
  });

  it("Если поле не содержит заглавную латинскую букву, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail("reso1991w");
    expect(passwordValidationMessage[1].isError).toBe(true);
  });

  it("Если поле содержит только заглавные латинские буквы, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail("RRRRRRRR1");
    expect(passwordValidationMessage[1].isError).toBe(true);
  });
});
