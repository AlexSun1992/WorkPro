import { mount } from "@vue/test-utils";
import Vue from "vue";
import { getErrorMessage, getMaxErrorNumber, isCriticalError } from "./toast.helper";

describe("Модуль вывода сообщения об ошибке", () => {
  it("Должен обрабатывать сообщения с ORA в тексте без скобок", () => {
    const errorMessageText =
      'ORA-20105: Некорректный номер телефона\nORA-06512: на  "MOBILE.CLIENTUTILS", line 934\nORA-06512: на  line 1\nORA-06512: на  "SYS.DBMS_SQL", line 1721\nORA-06512: на  "MOBILE.AMUTILSREST", line 3018\nORA-06512: на  line 1\n';
    const errorMessageWithoutORA = getErrorMessage(errorMessageText);
    expect(errorMessageWithoutORA).toBe("Некорректный номер телефона");
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

  it("Должен обрабатывать сообщения с точкой", () => {
    const errorMessageText = "Произошла ошибка. Обратитесь в техподдержку";
    const errorMessage = getErrorMessage(errorMessageText);
    expect(errorMessage).toBe("Произошла ошибка. Обратитесь в техподдержку");
  });

  it("Должен обрабатывать сообщения с скобкой", () => {
    const errorMessageText =
      'ORA-20105: [Внимание! Пункт меню 55/712 настроен не правильно. Получен не корректный REL: rel. Сообщите в службу поддержки!]EF9BDD9E6747B6649C98E31474E81776   29574B9378471064EB970BE0CF864B95   55   712   2099850832     RMUSER       1347195\nORA-06512: на  "MOBILE.AMUTILS3", line 657\n';
    const errorMessage = getErrorMessage(errorMessageText);
    expect(errorMessage).toBe(
      "Внимание! Пункт меню 55/712 настроен не правильно. Получен не корректный REL: rel. Сообщите в службу поддержки!"
    );
  });

  it("Должен обрабатывать сообщения с скобкой", () => {
    const errorMessageText = `ORA-20105: [
      Запрещено вводить полисы с датой начала действия превышающей дату полиса более чем на 45 дней.]
      ORA-06512: на  "I3.PKG_LK_UTILS", line 13655
      ORA-06512: на  "V4.TM_UTILS", line 369
      ORA-06512: на  "V4.TM_UTILS_WEB", line 1900
      ORA-06512: на  "I3.PKG_LK_UTILS", line 13635
      ORA-06512: на  line 1
      ORA-06512: на  "SYS.DBMS_SQL", line 1721
      ORA-06512: на  "MOBILE.AMUTILSREST", line 3132
      ORA-06512: на  line 1
      `;
    const errorMessage = getErrorMessage(errorMessageText);
    expect(errorMessage).toBe(
      "Запрещено вводить полисы с датой начала действия превышающей дату полиса более чем на 45 дней."
    );
  });

  it("Должен обрабатывать сообщения с скобкой и текстом перед ней (в конце)", () => {
    const errorMessageText =
      "далее ошибка[Внимание, текст заключенный в [скобки] должен корректно обрабатываться, независимо от расположения ] закрывающие и [ открывающей скобок]техническая информация не учитывается";
    const errorMessage = getErrorMessage(errorMessageText);
    expect(errorMessage).toBe(
      "Внимание, текст заключенный в [скобки] должен корректно обрабатываться, независимо от расположения ] закрывающие и [ открывающей скобок"
    );
  });

  it("Должен обрабатывать сообщения с ORA в тексте с квадратными скобками", () => {
    const errorMessageText =
      'ORA-20105: [Данный номер уже использован в другом личном кабинете]\nORA-06512: на  "MOBILE.CLIENTUTILS", line 954\nORA-06512: на  line 1\nORA-06512: на  "SYS.DBMS_SQL", line 1721\nORA-06512: на  "MOBILE.AMUTILSREST", line 3018\nORA-06512: на  line 1\n';
    const errorMessageBrackets = getErrorMessage(errorMessageText);
    expect(errorMessageBrackets).toBe("Данный номер уже использован в другом личном кабинете");
  });

  it("Должен использоваться ленивый квантификатор для корректного вычленения сообщения", () => {
    const ecpectMessage =
      "Внимание! Пункт меню 55/949 настроен не правильно. Получен не корректный REL: rel. Сообщите в службу поддержки!";
    const newErrText =
      'ORA-20105: [Внимание! Пункт меню 55/949 настроен не правильно. Получен не корректный REL: rel. Сообщите в службу поддержки!][REL=BD4372894085E8036D182D426035B0FE, X-Real-IP=172.17.4.65, X-OS=VueJS]    Rel: BD4372894085E8036D182D426035B0FE  NewRel: 4991FD91B59B6E4C4B4F139F245F8778   55   949   13554258     RMUSER       1094693\nORA-06512: на  "MOBILE.AMUTILS3", line 643\nORA-06512: на  "MOBILE.AMUTILSREST", line 1072\nORA-06512: на  line 1\n';
    const errorText = getErrorMessage(newErrText);
    expect(errorText).toBe(ecpectMessage);
  });

  it("Должен обрабатывать сообщения с одной скобкой", () => {
    const errorMessageText = "[Внимание! Пункт меню 55/712 настроен не правильно";
    const errorMessage = getErrorMessage(errorMessageText);
    expect(errorMessage).toBe("[Внимание! Пункт меню 55/712 настроен не правильно");
  });

  it("Возвращаем текст из квадратных скобок", () => {
    const errorMessageText =
      'ORA-20105: Ошибка [Текст ошибки]\nORA-06512: на "MOBILE.CLIENTUTILS", line 7\nORA-06512: на line 1\nORA-06512: на "SYS.DBMS_SQL", line 1721\nORA-06512: на "MOBILE.AMUTILSREST", line 1692\nORA-06512: на "MOBILE.AMUTILSREST", line 1321\nORA-06512: на line 1\n';
    const errorMessage = getErrorMessage(errorMessageText);
    expect(errorMessage).toBe("Текст ошибки");
  });

  it("Проверяем тип данных,возвращаемых функцией(должен возвращать объект)", () => {
    const errorMessageText =
      'ORA-06512: на  line 1\nORA-06512: на  "SYS.DBMS_SQL", line 1721\nORA-06512: на  "MOBILE.AMUTILSREST", line 1686\nORA-06512: на  "MOBILE.AMUTILSREST", line 1315\nORA-06512: на  line 1\n';
    const errorMessageWithOutORA = getErrorMessage(errorMessageText);
    expect(errorMessageWithOutORA).toBe("Приносим извинения, в Личном Кабинете что-то пошло не так.");
  });

  it("Ошибка критична", () => {
    const errorMessageText =
      'ORA-06512: на  line 1\nORA-06512: на  "SYS.DBMS_SQL", line 1721\nORA-06512: на  "MOBILE.AMUTILSREST", line 1686\nORA-06512: на  "MOBILE.AMUTILSREST", line 1315\nORA-06512: на  line 1\n';
    const errorMessageWithOutORA = isCriticalError(errorMessageText);
    expect(errorMessageWithOutORA).toBe(true);
  });

  it("Ошибка не критична", () => {
    const errorMessageText =
      'ORA-20105: [Данный номер уже использован в другом личном кабинете]\nORA-06512: на  "MOBILE.CLIENTUTILS", line 954\nORA-06512: на  line 1\nORA-06512: на  "SYS.DBMS_SQL", line 1721\nORA-06512: на  "MOBILE.AMUTILSREST", line 3018\nORA-06512: на  line 1\n';
    const errorMessageWithOutORA = isCriticalError(errorMessageText);
    expect(errorMessageWithOutORA).toBe(false);
  });

  it("Ошибка со сбоем распределённой операции не критична", () => {
    const errorMessageText =
      'ORA-02055: сбой распределенной операции обновления; требуется откат\nORA-20105: [Чтобы заключить договор и оформить полис онлайн просим заполнить <a href="/cabinet/55/0/979" target="_blank" style="color:darkgreen; font-weight:500; text-decoration:underline;">профиль пользователя</a> .]\nORA-06512: на  "V4.IFLUTILS_WEB", line 398\nORA-06512: на  line 1\nORA-06512: на  "MOBILE.AMUTILSREST", line 1381\nORA-06512: на  line 1\n';
    const errorMessageWithOutORA = isCriticalError(errorMessageText);
    expect(errorMessageWithOutORA).toBe(false);
  });

  it("Строка, содержащая два ORA", () => {
    const wrapper = mount(Vue.component("test-component", {}));

    const errorMessageText =
      'ORA-20105: ORA-00942: таблица или представление пользователя не существует \n[Метод: "select \'742;740\' as result from dual1"]\nORA-06512: на  "MOBILE.AMUTILS2", line 284\nORA-06512: на  "MOBILE.AMUTILS2", line 471\nORA-06512: на  line 1\n';

    const errorMessage = getErrorMessage(errorMessageText, wrapper.vm.$createElement);

    expect(typeof errorMessage[0]).toBe("object");
  });

  it("Строка, содержащая два ORA", () => {
    const errorMessageText =
      'ORA-20105: ORA-00942: таблица или представление пользователя не существует \n[Метод: "select \'742;740\' as result from dual1"]\nORA-06512: на  "MOBILE.AMUTILS2", line 284\nORA-06512: на  "MOBILE.AMUTILS2", line 471\nORA-06512: на  line 1\n';
    const errorMessage = getErrorMessage(errorMessageText, false);
    expect(errorMessage).toBe("Приносим извинения, в Личном Кабинете что-то пошло не так.");
  });

  it("Вернуть сообщение в скобках", () => {
    const errorMessageText =
      'ORA-20105: [Сохранение профиля невозможно, обратитесь в офис]\nORA-06512: на  "MOBILE.CLIENTUTILS", line 1409\nORA-06512: на  "MOBILE.CLIENTUTILS", line 921\nORA-06512: на  line 1\nORA-06512: на  "SYS.DBMS_SQL", line 1721\nORA-06512: на  "MOBILE.AMUTILSREST", line 1692\nORA-06512: на  "MOBILE.AMUTILSREST", line 1321\nORA-06512: на  line 1\n';
    const errorMessage = getErrorMessage(errorMessageText, false);
    expect(errorMessage).toBe("Сохранение профиля невозможно, обратитесь в офис");
  });

  it("корректно определяет ключевое ORA", () => {
    const errorNumber =
      getMaxErrorNumber(`ORA-20100: ORA-20199: Для отправления справки, внесите свой e-mail в Настройках профиля.
    ORA-06512: на  "I3.PKG_LK_UTILS", line 10867
    ORA-06512: на  line 1
    ORA-06512: на  "SYS.DBMS_SQL", line 1721
    ORA-06512: на  "MOBILE.AMUTILSREST", line 3183`);

    expect(errorNumber).toBe("ORA-20199");
  });

  it("получает максимальный номер ошибки ORA", () => {
    const errorNumber = getMaxErrorNumber(
      'ORA-02055: сбой распределенной операции обновления; требуется откат\nORA-20105: [Чтобы заключить договор и оформить полис онлайн просим заполнить <a href="/cabinet/55/0/979" target="_blank" style="color:darkgreen; font-weight:500; text-decoration:underline;">профиль пользователя</a> .]\nORA-06512: на  "V4.IFLUTILS_WEB", line 398\nORA-06512: на  line 1\nORA-06512: на  "MOBILE.AMUTILSREST", line 1381\nORA-06512: на  line 1\n'
    );

    expect(errorNumber).toBe("ORA-20105");
  });

  it("корректно определяет WAF", () => {
    const errorNumber = getErrorMessage(
      "<HTML>\n" +
        "\n" +
        "<HEAD>\n" +
        '\t<base href="/" />\n' +
        '\t<script type="text/javascript">\n' +
        "\t\tvar _event_transid='3051586736';\n" +
        "\t</script>\n" +
        "\n" +
        "\t<TITLE>Request Blocked</TITLE>\n" +
        '\t<META HTTP-EQUIV="Content-Type" Content="text/html; charset=UTF-8">\n' +
        '\t<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />\n' +
        '\t<meta http-equiv="Pragma" content="no-cache" />\n' +
        '\t<meta http-equiv="Expires" content="0" />\n' +
        "</HEAD>\n" +
        "\n" +
        "<BODY>\n" +
        "\t<BR>\n" +
        '\t<TABLE align=center cellpadding="0" cellspacing="0" border="0">\n' +
        "\t\t<TR>\n" +
        "\t\t</TR>\n" +
        "\t</TABLE>\n" +
        "\t<BR>\n" +
        '\t<TABLE width="700" align=center cellpadding="0" cellspacing="0" border="0">\n' +
        "\t\t<TR>\n" +
        '\t\t\t<TD width="60" align="left" valign="top" rowspan="3"></TD>\n' +
        '\t\t\t<TD id="mainTitleAlign" valign="middle" align="left" width="*">\n' +
        "\t\t\t\t<H1>Обнаружена аномальная активность</H1>\n" +
        "\t\t\t</TD>\n" +
        "\t\t</TR>\n" +
        "\t\t<TR>\n" +
        "\t\t\t<TD>&nbsp;</TD>\n" +
        "\t\t</TR>\n" +
        "\t\t<TR>\n" +
        "\t\t\t<TD>\n" +
        '\t\t\t\t<DIV class="divider"></DIV><BR><BR></TD>\n' +
        "\t\t</TR>\n" +
        "\t\t<TR>\n" +
        "\t\t\t<TD></TD>\n" +
        "\t\t\t<TD>\n" +
        "\t\t\t\t<H3>Вы видите эту страницу, потому что с вашего ip адреса обнаружена аномальная активность.\n" +
        "\n" +
        "\t\t\t\t\t<P>\n" +
        '\t\t\t\t\t\t<table border="0">\n' +
        "\t\t\t\t\t\t\t<tr>\n" +
        "\t\t\t\t\t\t\t\t<td>Событие:</td>\n" +
        "\t\t\t\t\t\t\t\t<td>\n" +
        '\t\t\t\t\t\t\t\t\t<script language="javascript">\n' +
        "\t\t\t\t\t\t\t\t\t\tif (window._event_transid !== undefined) document.write(window._event_transid);\n" +
        "\t\t\t\t\t\t\t\t\t</script>\n" +
        "\t\t\t\t\t\t\t\t</td>\n" +
        "\t\t\t\t\t\t\t</tr>\n" +
        "\t\t\t\t\t\t</table>\n" +
        "\t\t\t\t</H3><BR><BR>\n" +
        "\t\t</TD>\n" +
        "\t\t</TR>\n" +
        "\t</TABLE>\n" +
        "</BODY>\n" +
        "<STYLE>\n" +
        "\tbody {\n" +
        '\t\tfont-family: "Segoe UI", "verdana", "Arial";\n' +
        "\t\tbackground-repeat: repeat-x;\n" +
        "\t\tmargin-top: 20px;\n" +
        "\t\tmargin-left: 20px;\n" +
        "\t}\n" +
        "\n" +
        "\th1 {\n" +
        "\t\t< !-- color: #FF0000;\n" +
        "\t\tcolor2: #4465A2;\n" +
        "\t\t-->font-size: 1.8em;\n" +
        "\t\tfont-weight: normal;\n" +
        "\t\tvertical-align: bottom;\n" +
        "\t\tmargin-top: 7px;\n" +
        "\t\tmargin-bottom: 4px;\n" +
        "\t}\n" +
        "\n" +
        "\th2\n" +
        "\n" +
        "\t/* used for Heading in Main Body */\n" +
        "\t\t{\n" +
        "\t\tfont-size: 0.9em;\n" +
        "\t\tfont-weight: normal;\n" +
        "\t\tmargin-top: 20px;\n" +
        "\t\tmargin-bottom: 1px;\n" +
        "\t}\n" +
        "\n" +
        "\th3\n" +
        "\n" +
        "\t/* used for text in main body */\n" +
        "\t\t{\n" +
        "\t\tfont-size: 0.9em;\n" +
        "\t\tfont-weight: normal;\n" +
        "\t\tmargin-top: 10px;\n" +
        "\t\tmargin-bottom: 1px;\n" +
        "\t}\n" +
        "\n" +
        "\t.divider {\n" +
        "\t\tborder-bottom: #B6BCC6 1px solid;\n" +
        "\t}\n" +
        "</STYLE>\n" +
        "\n" +
        "</HTML>"
    );

    expect(errorNumber).toBe("Приносим извинения, в Личном Кабинете что-то пошло не так.");
  });

  it("определяет текст ошибки, обёрнутый в системную", () => {
    const errorMessageText =
      'ORA-02055: сбой распределенной операции обновления; требуется откат\nORA-20105:  [\r\nЗастрахованный не является страхователем.]\nORA-06512: на  "V4.TM_UTILS_WEB", line 2007\nORA-06512: на  "V4.TM_UTILS_WEB", line 2479\nORA-06512: на  "V4.TM_UTILS", line 799\nORA-06512: на  "V4.TM_UTILS_WEB", line 2476\nORA-06512: на  "V4.TM_UTILS_WEB", line 2004\nORA-06512: на  line 1\nORA-06512: на  "MOBILE.AMUTILSREST", line 1332\nORA-06512: на  line 1\n';
    const errorMessage = getErrorMessage(errorMessageText);

    expect(errorMessage).toBe("Застрахованный не является страхователем.");
  });

  it("определяет текст ошибки, обёрнутый в системную", () => {
    const errorMessageText =
      'ORA-20105: ORA-20105: [Ошибка] \n[Метод: "SELECT v4.osagoutils_client.OsagoCalcVisibleMethod(:pId, :psParams2) AS sResult FROM DUAL"]\nORA-06512: на "MOBILE.AMUTILS2", line 288\nORA-06512: на "MOBILE.AMUTILS2", line 544\nORA-06512: на "MOBILE.AMUTILS2", line 452\nORA-06512: на line 1\n';
    const errorMessage = getErrorMessage(errorMessageText);
    expect(errorMessage).toBe("Ошибка");
  });

  it("На случай получения непредусмотренного текста ошибки функция возвращает человекочитаемую строку", () => {
    const errMess = getErrorMessage(
      new Error("TypeError:Cannot read properties of undefined (reading 'status') at eval")
    );
    expect(errMess).toBe("Приносим извинения, в Личном Кабинете что-то пошло не так.");
  });
});
