import { getErrorMessage } from "./toast.helper";

describe("Модуль вывода сообщения об ошибке", () => {
  it("Должен обрабатывать сообщения с ORA в тексте без скобок", () => {
    const errorMessageText =
      'ORA-20105: Некорректный номер телефона\nORA-06512: на  "MOBILE.CLIENTUTILS", line 934\nORA-06512: на  line 1\nORA-06512: на  "SYS.DBMS_SQL", line 1721\nORA-06512: на  "MOBILE.AMUTILSREST", line 3018\nORA-06512: на  line 1\n';
    const errorMessageWithoutORA = getErrorMessage(errorMessageText);
    expect(errorMessageWithoutORA).toBe("Некорректный номер телефона");
  });
  it("Должен обрабатывать сообщения с ORA в тексте с квадратными скобками", () => {
    const errorMessageText =
      'ORA-20105: [Данный номер уже использован в другом личном кабинете]\nORA-06512: на  "MOBILE.CLIENTUTILS", line 954\nORA-06512: на  line 1\nORA-06512: на  "SYS.DBMS_SQL", line 1721\nORA-06512: на  "MOBILE.AMUTILSREST", line 3018\nORA-06512: на  line 1\n';
    const errorMessageBrackets = getErrorMessage(errorMessageText);
    expect(errorMessageBrackets).toBe(
      "Данный номер уже использован в другом личном кабинете"
    );
  });

  it("Должен обрабатывать сообщения об ошибке без ORA в тексте", () => {
    const errorMessageText = "Некорректный номер телефона";
    const errorMessageWithoutORA = getErrorMessage(errorMessageText);
    expect(errorMessageWithoutORA).toBe("Некорректный номер телефона");
  });

  it("Должен обрабатывать сообщения с двоеточием в тексте ошибки", () => {
    const errorMessageText =
      'ORA-20105: Перечень полей с ошибками: имя, фамилия\nORA-06512: на  "MOBILE.CLIENTUTILS", line 954\nORA-06512: на  line 1\nORA-06512: на  "SYS.DBMS_SQL", line 1721\nORA-06512: на  "MOBILE.AMUTILSREST", line 3018\nORA-06512: на  line 1\n';
    const errorMessage = getErrorMessage(errorMessageText);
    expect(errorMessage).toBe("Перечень полей с ошибками: имя, фамилия");
  });

  it("Должен обрабатывать сообщения со словом ORACLE в начале", () => {
    const errorMessageText = "ORACLE-скрипт не валидный";
    const errorMessage = getErrorMessage(errorMessageText);
    expect(errorMessage).toBe("ORACLE-скрипт не валидный");
  });

  it("Должен обрабатывать сообщения с цифрой в начале", () => {
    const errorMessageText = "15 ошибок не обработано";
    const errorMessage = getErrorMessage(errorMessageText);
    expect(errorMessage).toBe("15 ошибок не обработано");
  });
});
