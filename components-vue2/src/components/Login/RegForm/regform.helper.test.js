import { passwordValidation } from "./regform.helper";

describe("Валидация компонента PasswordRecoveryForm", () => {
  it("Успешный пароль", () => {
    const passwordValidationMessage = passwordValidation("Reso1991");
    expect(passwordValidationMessage).toEqual([]);
  });

  it("Если поле пустое выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("");
    expect(passwordValidationMessage).toEqual([
      { errorText: "Пароль должен содержать от 6 до 20 символов." },
    ]);
  });

  it("Если поле содержит меньше 6 символов , то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("1pR");
    expect(passwordValidationMessage).toEqual([
      { errorText: "Пароль должен содержать от 6 до 20 символов." },
    ]);
  });

  it("Если поле содержит больше 20 символов , то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation(
      "1kkkkkkkkkkkkkRkkkkkk"
    );
    expect(passwordValidationMessage).toEqual([
      { errorText: "Пароль должен содержать от 6 до 20 символов." },
    ]);
  });

  it("Если поле содержит русский символ , то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("1kkkkkRkkkkkkkkз");
    expect(passwordValidationMessage).toEqual([
      {
        errorText:
          "Пароль не должен содержать русских букв в специальных символов.",
      },
    ]);
  });

  it("Если поле содержит специальный символ , то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("1kkkkkRkkkkkkkk!");
    expect(passwordValidationMessage).toEqual([
      {
        errorText:
          "Пароль не должен содержать русских букв в специальных символов.",
      },
    ]);
  });

  it("Если поле содержит русские буквы и специальный символ , то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("1kkkkRkkkkkkkзk!");
    expect(passwordValidationMessage).toEqual([
      {
        errorText:
          "Пароль не должен содержать русских букв в специальных символов.",
      },
    ]);
  });

  it("Если поле содержит русские буквы, специальный символ и содержит меньше 6 символов, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("1Rkз!");
    expect(passwordValidationMessage).toEqual([
      {
        errorText: "Пароль должен содержать от 6 до 20 символов.",
      },
      {
        errorText:
          "Пароль не должен содержать русских букв в специальных символов.",
      },
    ]);
  });

  it("Если поле содержит русские буквы, специальный символ и содержит больше 20 символов, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation(
      "1kппппhhhhhhhhRhhhhhhhhhз!"
    );
    expect(passwordValidationMessage).toEqual([
      {
        errorText: "Пароль должен содержать от 6 до 20 символов.",
      },
      {
        errorText:
          "Пароль не должен содержать русских букв в специальных символов.",
      },
    ]);
  });

  it("Если поле содержит русские буквы, специальный символ и нет цифр, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("kппппhhhRhhз!");
    expect(passwordValidationMessage).toEqual([
      {
        errorText:
          "Новый пароль должен содержать, как минимум, одну цифру и одну заглавную букву.",
      },
      {
        errorText:
          "Пароль не должен содержать русских букв в специальных символов.",
      },
    ]);
  });

  it("Если поле содержит русские буквы, специальный символ и нет латинских букв, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("1111111пfппз!");
    expect(passwordValidationMessage).toEqual([
      {
        errorText:
          "Новый пароль должен содержать, как минимум, одну цифру и одну заглавную букву.",
      },
      {
        errorText:
          "Пароль не должен содержать русских букв в специальных символов.",
      },
    ]);
  });

  it("Если поле содержит русские буквы, специальный символ и нет латинских букв, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("gR");
    expect(passwordValidationMessage).toEqual([
      {
        errorText: "Пароль должен содержать от 6 до 20 символов.",
      },
      {
        errorText:
          "Новый пароль должен содержать, как минимум, одну цифру и одну заглавную букву.",
      },
    ]);
  });
  it("Если поле не содержит заглавную латинскую букву, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("reso1991");
    expect(passwordValidationMessage).toEqual([
      {
        errorText:
          "Новый пароль должен содержать, как минимум, одну цифру и одну заглавную букву.",
      },
    ]);
  });
});
