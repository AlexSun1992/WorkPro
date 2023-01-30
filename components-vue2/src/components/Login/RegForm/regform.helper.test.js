import { passwordValidation, passwordValidationDetail } from "./regform.helper";

describe("Валидация компонента PasswordRecoveryForm", () => {
  describe("Валидация passwordValidation", () => {
    it("Успешный пароль", () => {
      const passwordValidationMessage = passwordValidation("Reso1991");
      expect(passwordValidationMessage).toEqual([]);
    });

    it("Не успешный пароль", () => {
      const passwordValidationMessage = passwordValidation("Reso");
      expect(passwordValidationMessage).toEqual([
        {
          errorText: `Требования к паролю: от 6 до 20 символов, без кириллицы и специальных символов, содержит цифру, одну прописную и строчную буквы.`,
        },
      ]);
    });
  });

  describe("Валидация компонента passwordValidationDetail", () => {
    it("Успешный пароль", () => {
      const passwordValidationMessage = passwordValidationDetail("Reso1991");
      expect(passwordValidationMessage).toEqual([]);
    });

    it("Если поле пустое выводит ошибку", () => {
      const passwordValidationMessage = passwordValidationDetail("");
      expect(passwordValidationMessage).toEqual([
        {
          errorText: `Пароль должен содержать от 6 до 20 символов.`,
        },
      ]);
    });

    it("Если поле содержит меньше 6 символов , то выводит ошибку", () => {
      const passwordValidationMessage = passwordValidationDetail("1pR");
      expect(passwordValidationMessage).toEqual([
        {
          errorText: `Пароль должен содержать от 6 до 20 символов.`,
        },
      ]);
    });

    it("Если поле содержит больше 20 символов , то выводит ошибку", () => {
      const passwordValidationMessage = passwordValidationDetail(
        "1kkkkkkkkkkkkkRkkkkkk"
      );
      expect(passwordValidationMessage).toEqual([
        {
          errorText: `Пароль должен содержать от 6 до 20 символов.`,
        },
      ]);
    });

    it("Если поле содержит русский символ , то выводит ошибку", () => {
      const passwordValidationMessage =
        passwordValidationDetail("1kkkkkRkkkkkkkkз");
      expect(passwordValidationMessage).toEqual([
        {
          errorText:
            "Пароль не должен содержать русских букв в специальных символов.",
        },
      ]);
    });

    it("Если поле содержит специальный символ , то выводит ошибку", () => {
      const passwordValidationMessage =
        passwordValidationDetail("1kkkkkRkkkkkkkk!");
      expect(passwordValidationMessage).toEqual([
        {
          errorText:
            "Пароль не должен содержать русских букв в специальных символов.",
        },
      ]);
    });

    it("Если поле содержит русские буквы и специальный символ , то выводит ошибку", () => {
      const passwordValidationMessage =
        passwordValidationDetail("1kkkkRkkkkkkkзk!");
      expect(passwordValidationMessage).toEqual([
        {
          errorText:
            "Пароль не должен содержать русских букв в специальных символов.",
        },
      ]);
    });

    it("Если поле содержит русские буквы, специальный символ и содержит меньше 6 символов, то выводит ошибку", () => {
      const passwordValidationMessage = passwordValidationDetail("1Rkз!");
      expect(passwordValidationMessage).toEqual([
        {
          errorText: `Пароль должен содержать от 6 до 20 символов.`,
        },
        {
          errorText:
            "Пароль не должен содержать русских букв в специальных символов.",
        },
      ]);
    });

    it("Если поле содержит русские буквы, специальный символ и содержит больше 20 символов, то выводит ошибку", () => {
      const passwordValidationMessage = passwordValidationDetail(
        "1kппппhhhhhhhhRhhhhhhhhhз!"
      );
      expect(passwordValidationMessage).toEqual([
        {
          errorText: `Пароль должен содержать от 6 до 20 символов.`,
        },
        {
          errorText:
            "Пароль не должен содержать русских букв в специальных символов.",
        },
      ]);
    });

    it("Если поле содержит русские буквы, специальный символ и нет цифр, то выводит ошибку", () => {
      const passwordValidationMessage =
        passwordValidationDetail("kппппhhhRhhз!");
      expect(passwordValidationMessage).toEqual([
        {
          errorText:
            "Новый пароль должен содержать, как минимум, одну цифру, одну прописную и строчную букву.",
        },
        {
          errorText:
            "Пароль не должен содержать русских букв в специальных символов.",
        },
      ]);
    });

    it("Если поле содержит русские буквы, специальный символ и нет латинских букв, то выводит ошибку", () => {
      const passwordValidationMessage =
        passwordValidationDetail("1111111пfппз!");
      expect(passwordValidationMessage).toEqual([
        {
          errorText:
            "Новый пароль должен содержать, как минимум, одну цифру, одну прописную и строчную букву.",
        },
        {
          errorText:
            "Пароль не должен содержать русских букв в специальных символов.",
        },
      ]);
    });

    it("Если поле содержит русские буквы, специальный символ и нет латинских букв, то выводит ошибку", () => {
      const passwordValidationMessage = passwordValidationDetail("gR");
      expect(passwordValidationMessage).toEqual([
        {
          errorText: `Пароль должен содержать от 6 до 20 символов.`,
        },
        {
          errorText:
            "Новый пароль должен содержать, как минимум, одну цифру, одну прописную и строчную букву.",
        },
      ]);
    });

    it("Если поле не содержит заглавную латинскую букву, то выводит ошибку", () => {
      const passwordValidationMessage = passwordValidationDetail("reso1991");
      expect(passwordValidationMessage).toEqual([
        {
          errorText:
            "Новый пароль должен содержать, как минимум, одну цифру, одну прописную и строчную букву.",
        },
      ]);
    });

    it("Если поле содержит только заглавные латинские буквы, то выводит ошибку", () => {
      const passwordValidationMessage = passwordValidationDetail("RRRRRRRR1");
      expect(passwordValidationMessage).toEqual([
        {
          errorText:
            "Новый пароль должен содержать, как минимум, одну цифру, одну прописную и строчную букву.",
        },
      ]);
    });
  });
});
