import { getErrorMessage } from "./toast.helper";

describe("Модуль вывода сообщения об ошибке", () => {
  it("Тестирование сообщения с ORA в тексте без скобок", () => {
    const errorMessageText =
      'ORA-20105: Некорректный номер телефона\nORA-06512: на  "MOBILE.CLIENTUTILS", line 934\nORA-06512: на  line 1\nORA-06512: на  "SYS.DBMS_SQL", line 1721\nORA-06512: на  "MOBILE.AMUTILSREST", line 3018\nORA-06512: на  line 1\n';
    const errorMessageWithoutORA = getErrorMessage(errorMessageText);

    expect(errorMessageWithoutORA).toBe("Некорректный номер телефона");
  });

  it("Тестирование сообщения с ORA в тексте с квадратными скобками", () => {
    const errorMessageText =
      'ORA-20105: [Данный номер уже использован в другом личном кабинете]\nORA-06512: на  "MOBILE.CLIENTUTILS", line 954\nORA-06512: на  line 1\nORA-06512: на  "SYS.DBMS_SQL", line 1721\nORA-06512: на  "MOBILE.AMUTILSREST", line 3018\nORA-06512: на  line 1\n';
    const errorMessageBrackets = getErrorMessage(errorMessageText);
    expect(errorMessageBrackets).toBe(
      "Данный номер уже использован в другом личном кабинете"
    );
  });

  it("Тестирование сообщения об ошибке без ORA в тексте", () => {
    const errorMessageText = "Некорректный номер телефона";
    const errorMessageWithoutORA = getErrorMessage(errorMessageText);
    expect(errorMessageWithoutORA).toBe("Некорректный номер телефона");
  });
});
