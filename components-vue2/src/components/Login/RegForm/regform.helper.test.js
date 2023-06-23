import {
  passwordValidation,
  passwordValidationDetail,
  passwordValidationWindow,
  passwordValidator,
} from "./regform.helper";

describe("Валидация passwordValidator in regform.helper", () => {
  it("", () => {
    const passwordValidatorArray = Object.entries(passwordValidator).map(
      ([, item]) => item.errorText
    );
    expect(passwordValidatorArray).toEqual([
      "без пробела и недопустимых спецсимволов",
      "минимум одна цифра",
      "минимум одна заглавная буква",
      "минимум одна строчная буква",
      "только латинские буквы",
      "от 8 до 20 символов",
    ]);
  });
});

describe("Валидация passwordValidation in regform.helper", () => {
  it("Успешный пароль", () => {
    const passwordValidationMessage = passwordValidation("Reso19910");

    expect(passwordValidationMessage).toEqual([]);
  });

  it("Не успешный пароль", () => {
    const passwordValidationMessage = passwordValidation("Reso");

    expect(passwordValidationMessage).toEqual([
      {
        errorText: `Требования к паролю: от 8 до 20 символов. Пароль должен состоять из латинских букв, содержать минимум одну цифру, одну заглавную и одну строчную буквы; также можно использовать спецсимволы: !#$%^*()-=+[]{};,.|/? (пробел исключён)`,
      },
    ]);
  });
});

describe("Валидация компонента passwordValidationDetail in RegForm.vue", () => {
  it("Успешный пароль", () => {
    const passwordValidationMessage = passwordValidationDetail("Reso19910*y");

    expect(passwordValidationMessage).toEqual([]);
  });

  it("Если поле пустое выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail("");

    expect(passwordValidationMessage).toEqual([
      {
        errorText: `без пробела и недопустимых спецсимволов`,
      },
      {
        errorText: "минимум одна цифра",
      },
      {
        errorText: "минимум одна заглавная буква",
      },
      {
        errorText: "минимум одна строчная буква",
      },
      {
        errorText: "только латинские буквы",
      },
      {
        errorText: "от 8 до 20 символов",
      },
      {
        errorText:
          "Новый пароль должен содержать, как минимум, одну цифру, одну прописную и строчную букву.",
      },
    ]);
  });

  it("Если поле содержит меньше 8 символов , то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail("1pR");

    expect(passwordValidationMessage).toEqual([
      {
        errorText: `от 8 до 20 символов`,
      },
    ]);
  });

  it("Если поле содержит больше 20 символов , то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail(
      "1kkkkkkkkkkkkkRkkkkkk"
    );

    expect(passwordValidationMessage).toEqual([
      {
        errorText: `от 8 до 20 символов`,
      },
    ]);
  });

  it("Если поле содержит русский символ , то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationDetail("1kkkkkRkkkkkkkkз");

    expect(passwordValidationMessage).toEqual([
      {
        errorText: "только латинские буквы",
      },
    ]);
  });

  it("Если поле содержит разрешенный специальный символ , то не выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationDetail("1kkkkkRkkkkkkkk)");

    expect(passwordValidationMessage).toEqual([]);
  });

  it("Если поле содержит запрещенный специальный символ , то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationDetail("1kkkkkRkkkkkkkk:");

    expect(passwordValidationMessage).toEqual([
      {
        errorText: "без пробела и недопустимых спецсимволов",
      },
    ]);
  });

  it("Если поле содержит запрещенный специальный символ , то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationDetail(":1kkkkkRkkkkkkkk:");

    expect(passwordValidationMessage).toEqual([
      {
        errorText: "без пробела и недопустимых спецсимволов",
      },
    ]);
  });

  it("Если поле содержит запрещенный специальный символ и пробел, то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationDetail("1kkkkkRkkkkkkkk  ");

    expect(passwordValidationMessage).toEqual([
      {
        errorText: "без пробела и недопустимых спецсимволов",
      },
    ]);
  });

  it("Если поле содержит пробел, то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationDetail(" 1kkkkkRkkkkkkkk");

    expect(passwordValidationMessage).toEqual([
      {
        errorText: "без пробела и недопустимых спецсимволов",
      },
    ]);
  });

  it("Если поле содержит русские буквы и разрешенный специальный символ , то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationDetail("1kkkkRkkkkkkkзk!");

    expect(passwordValidationMessage).toEqual([
      {
        errorText: "только латинские буквы",
      },
    ]);
  });

  it("Если поле содержит русские буквы, разрешенный специальный символ и содержит меньше 8 символов, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail("1Rkз!");

    expect(passwordValidationMessage).toEqual([
      {
        errorText: `только латинские буквы`,
      },
      {
        errorText: "от 8 до 20 символов",
      },
    ]);
  });

  it("Если поле содержит русские буквы, разрешенный специальный символ и содержит больше 20 символов, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail(
      "1kппппhhhhhhhhRhhhhhhhhhз!"
    );

    expect(passwordValidationMessage).toEqual([
      {
        errorText: `только латинские буквы`,
      },
      {
        errorText: "от 8 до 20 символов",
      },
    ]);
  });

  it("Если поле содержит русские буквы, разрешенный специальный символ и нет цифр, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail("kппппhhhRhhз!");

    expect(passwordValidationMessage).toEqual([
      {
        errorText: "минимум одна цифра",
      },
      {
        errorText: "только латинские буквы",
      },
    ]);
  });

  it("Если поле содержит русские буквы, разрешенный специальный символ и нет латинских букв, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail("1111111пfппз!");
    expect(passwordValidationMessage).toEqual([
      {
        errorText: "минимум одна заглавная буква",
      },
      {
        errorText: "только латинские буквы",
      },
    ]);
  });

  it("Если в поле меньше 8 символов и ннт цифры, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail("gR");

    expect(passwordValidationMessage).toEqual([
      {
        errorText: `минимум одна цифра`,
      },
      {
        errorText: "от 8 до 20 символов",
      },
    ]);
  });

  it("Если поле не содержит заглавную латинскую букву, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail("reso1991w");

    expect(passwordValidationMessage).toEqual([
      {
        errorText: "минимум одна заглавная буква",
      },
    ]);
  });

  it("Если поле содержит только заглавные латинские буквы, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationDetail("RRRRRRRR1");

    expect(passwordValidationMessage).toEqual([
      {
        errorText: "минимум одна строчная буква",
      },
    ]);
  });
});

describe("Валидация компонента passwordValidationWindow in RegForm.vue", () => {
  it("Успешный пароль", () => {
    const passwordValidationMessage = passwordValidationWindow("Reso19910*y");

    expect(passwordValidationMessage.lengthValidation.isError).toBe(false);
    expect(
      passwordValidationMessage.spaceAndForbiddeCharactersValidation.isError
    ).toBe(false);
  });

  it("Если поле пустое выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationWindow("");

    expect(passwordValidationMessage.lengthValidation.isError).toBe(true);
    expect(passwordValidationMessage.lengthValidation.isError).toBe(true);
  });

  it("Если поле содержит меньше 8 символов , то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationWindow("1pR");

    expect(passwordValidationMessage.lengthValidation.isError).toBe(true);
  });

  it("Если поле содержит больше 20 символов , то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationWindow(
      "1kkkkkkkkkkkkkRkkkkkk"
    );

    expect(passwordValidationMessage.lengthValidation.isError).toBe(true);
  });

  it("Если поле содержит русский символ , то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationWindow("1kkkkkRkkkkkkkkз");

    expect(passwordValidationMessage.russianSignValidation.isError).toBe(true);
  });

  it("Если поле содержит запрещенный специальный символ , то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationWindow("1kkkkkRkkkkkkkk:");

    expect(
      passwordValidationMessage.spaceAndForbiddeCharactersValidation.isError
    ).toBe(true);
  });

  it("Если поле содержит запрещенный специальный символ, то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationWindow(":1kkkkkRkkkkkkkk:");

    expect(
      passwordValidationMessage.spaceAndForbiddeCharactersValidation.isError
    ).toBe(true);
  });

  it("Если поле содержит запрещенный специальный символ и пробел, то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationWindow("1kkkkkRkkkkkkkk  ");

    expect(
      passwordValidationMessage.spaceAndForbiddeCharactersValidation.isError
    ).toBe(true);
  });

  it("Если поле содержит пробел, то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationWindow(" 1kkkkkRkkkkkkkk");

    expect(
      passwordValidationMessage.spaceAndForbiddeCharactersValidation.isError
    ).toBe(true);
  });

  it("Если поле содержит русские буквы и разрешенный специальный символ , то выводит ошибку", () => {
    const passwordValidationMessage =
      passwordValidationWindow("1kkkkRkkkkkkkзk!");

    expect(passwordValidationMessage.russianSignValidation.isError).toBe(true);
  });

  it("Если поле содержит русские буквы, разрешенный специальный символ и содержит меньше 8 символов, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationWindow("1Rkз!");

    expect(passwordValidationMessage.russianSignValidation.isError).toBe(true);
    expect(passwordValidationMessage.lengthValidation.isError).toBe(true);
  });

  it("Если поле содержит русские буквы, разрешенный специальный символ и содержит больше 20 символов, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationWindow(
      "1kппппhhhhhhhhRhhhhhhhhhз!"
    );

    expect(passwordValidationMessage.russianSignValidation.isError).toBe(true);
    expect(passwordValidationMessage.lengthValidation.isError).toBe(true);
  });

  it("Если поле содержит русские буквы, разрешенный специальный символ и нет цифр, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationWindow("kппппhhhRhhз!");

    expect(passwordValidationMessage.russianSignValidation.isError).toBe(true);
    expect(passwordValidationMessage.numberValidation.isError).toBe(true);
  });

  it("Если поле содержит русские буквы, разрешенный специальный символ и нет латинских букв, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationWindow("1111111пfппз!");

    expect(passwordValidationMessage.russianSignValidation.isError).toBe(true);
    expect(passwordValidationMessage.russianSignValidation.isError).toBe(true);
  });

  it("Если в поле меньше 8 символов и ннт цифры, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationWindow("gR");

    expect(passwordValidationMessage.lengthValidation.isError).toBe(true);
    expect(passwordValidationMessage.numberValidation.isError).toBe(true);
  });

  it("Если поле не содержит заглавную латинскую букву, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationWindow("reso1991w");

    expect(passwordValidationMessage.uppercaseLetterValidation.isError).toBe(
      true
    );
  });

  it("Если поле содержит только заглавные латинские буквы b цифру, то выводит ошибку", () => {
    const passwordValidationMessage = passwordValidationWindow("RRRRRRRR1");

    expect(passwordValidationMessage.lowercaseLetterValidation.isError).toBe(
      true
    );
  });
});
