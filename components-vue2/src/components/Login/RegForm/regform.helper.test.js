import { passwordValidation } from "./regform.helper";

describe("Валидация компонента PasswordRecoveryForm", () => {
  it("Успешный пароль", () => {
    const passwordValidationMessage = passwordValidation("reso1991");
    expect(passwordValidationMessage).toEqual([]);
  });

  it("Если поле пустое выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("");
    expect(passwordValidationMessage).toEqual([
      { errorText: "Пароль должен содержать от 6 до 20 символов." },
    ]);
  });

  it("Если поле содержит меньше 6 символов , то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("1p");
    expect(passwordValidationMessage).toEqual([
      { errorText: "Пароль должен содержать от 6 до 20 символов." },
    ]);
  });

  it("Если поле содержит больше 20 символов , то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation(
      "1kkkkkkkkkkkkkkkkkkkk"
    );
    expect(passwordValidationMessage).toEqual([
      { errorText: "Пароль должен содержать от 6 до 20 символов." },
    ]);
  });

  it("Если поле содержит русский символ , то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("1kkkkkkkkkkkkkkз");
    expect(passwordValidationMessage).toEqual([
      {
        errorText:
          "Пароль не должен содержать русских букв в специальных символов.",
      },
    ]);
  });

  it("Если поле содержит специальный символ , то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("1kkkkkkkkkkkkkk!");
    expect(passwordValidationMessage).toEqual([
      {
        errorText:
          "Пароль не должен содержать русских букв в специальных символов.",
      },
    ]);
  });

  it("Если поле содержит русские буквы и специальный символ , то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("1kkkkkkkkkkkkзk!");
    expect(passwordValidationMessage).toEqual([
      {
        errorText:
          "Пароль не должен содержать русских букв в специальных символов.",
      },
    ]);
  });

  it("Если поле содержит русские буквы, специальный символ и содержит меньше 6 символов, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("1kз!");
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
      "1kппппhhhhhhhhhhhhhhhhhз!"
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
    const passwordValidationMessage = passwordValidation("kппппhhhhhhз!");
    expect(passwordValidationMessage).toEqual([
      {
        errorText:
          "Новый пароль должен содержать, как минимум, одну цифру и одну букву.",
      },
      {
        errorText:
          "Пароль не должен содержать русских букв в специальных символов.",
      },
    ]);
  });

  it("Если поле содержит русские буквы, специальный символ и нет латинских букв, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("1111111ппппз!");
    expect(passwordValidationMessage).toEqual([
      {
        errorText:
          "Новый пароль должен содержать, как минимум, одну цифру и одну букву.",
      },
      {
        errorText:
          "Пароль не должен содержать русских букв в специальных символов.",
      },
    ]);
  });

  it.only("Если поле содержит русские буквы, специальный символ и нет латинских букв, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidation("g");
    expect(passwordValidationMessage).toEqual([
      {
        errorText: "Пароль должен содержать от 6 до 20 символов.",
      },
      {
        errorText:
          "Новый пароль должен содержать, как минимум, одну цифру и одну букву.",
      },
    ]);
  });
});
