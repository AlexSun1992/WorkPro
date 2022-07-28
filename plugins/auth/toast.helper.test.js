import { getErrorMessage } from "./toast.helper";

describe("Модуль вывода сообщения об ошибке", () => {
  it.only("Должен обрабатывать сообщения с ORA в тексте без скобок", () => {
    const errorMessageText =
      'ORA-20105: Некорректный номер телефона\nORA-06512: на  "MOBILE.CLIENTUTILS", line 934\nORA-06512: на  line 1\nORA-06512: на  "SYS.DBMS_SQL", line 1721\nORA-06512: на  "MOBILE.AMUTILSREST", line 3018\nORA-06512: на  line 1\n';
    const errorMessageWithoutORA = getErrorMessage(errorMessageText);
    expect(errorMessageWithoutORA).toBe("Некорректный номер телефона");
  });
  it.only("Должен обрабатывать сообщения с ORA в тексте с квадратными скобками", () => {
    const errorMessageText =
      'ORA-20105: [Данный номер уже использован в другом личном кабинете]\nORA-06512: на  "MOBILE.CLIENTUTILS", line 954\nORA-06512: на  line 1\nORA-06512: на  "SYS.DBMS_SQL", line 1721\nORA-06512: на  "MOBILE.AMUTILSREST", line 3018\nORA-06512: на  line 1\n';
    const errorMessageBrackets = getErrorMessage(errorMessageText);
    expect(errorMessageBrackets).toBe(
      "Данный номер уже использован в другом личном кабинете"
    );
  });

  it.only("Должен обрабатывать сообщения об ошибке без ORA в тексте", () => {
    const errorMessageText = "Некорректный номер телефона";
    const errorMessageWithoutORA = getErrorMessage(errorMessageText);
    expect(errorMessageWithoutORA).toBe("Некорректный номер телефона");
  });

  it.only("Должен обрабатывать сообщения с двоеточием в тексте ошибки", () => {
    const errorMessageText =
      'ORA-20105: Перечень полей с ошибками: имя, фамилия\nORA-06512: на  "MOBILE.CLIENTUTILS", line 954\nORA-06512: на  line 1\nORA-06512: на  "SYS.DBMS_SQL", line 1721\nORA-06512: на  "MOBILE.AMUTILSREST", line 3018\nORA-06512: на  line 1\n';
    const errorMessage = getErrorMessage(errorMessageText);
    expect(errorMessage).toBe("Перечень полей с ошибками: имя, фамилия");
  });

  it.only("Должен обрабатывать сообщения со словом ORACLE в начале", () => {
    const errorMessageText = "ORACLE-скрипт не валидный";
    const errorMessage = getErrorMessage(errorMessageText);
    expect(errorMessage).toBe("ORACLE-скрипт не валидный");
  });

  it.only("Должен обрабатывать сообщения с цифрой в начале", () => {
    const errorMessageText = "15 ошибок не обработано";
    const errorMessage = getErrorMessage(errorMessageText);
    expect(errorMessage).toBe("15 ошибок не обработано");
  });

  it.only("Должен обрабатывать сообщения с точкой", () => {
    const errorMessageText = "Произошла ошибка. Обратитесь в техподдержку";
    const errorMessage = getErrorMessage(errorMessageText);
    expect(errorMessage).toBe("Произошла ошибка. Обратитесь в техподдержку");
  });

  it.only("Должен обрабатывать сообщения с скобкой", () => {
    const errorMessageText =
      'ORA-20105: [Внимание! Пункт меню 55/712 настроен не правильно. Получен не корректный REL: rel. Сообщите в службу поддержки!]EF9BDD9E6747B6649C98E31474E81776   29574B9378471064EB970BE0CF864B95   55   712   2099850832     RMUSER       1347195\nORA-06512: на  "MOBILE.AMUTILS3", line 657\n';
    const errorMessage = getErrorMessage(errorMessageText);
    expect(errorMessage).toBe(
      "Внимание! Пункт меню 55/712 настроен не правильно. Получен не корректный REL: rel. Сообщите в службу поддержки!"
    );
  });

  it.only("Должен обрабатывать сообщения с скобкой и текстом перед ней (в конце)", () => {
    const errorMessageText =
      "далее ошибка[Внимание, текст заключенный в [скобки] должен корректно обрабатываться, независимо от расположения ] закрывающие и [ открывающей скобок]техническая информация не учитывается";
    const errorMessage = getErrorMessage(errorMessageText);
    expect(errorMessage).toBe(
      "Внимание, текст заключенный в [скобки] должен корректно обрабатываться, независимо от расположения ] закрывающие и [ открывающей скобок"
    );
  });
});
