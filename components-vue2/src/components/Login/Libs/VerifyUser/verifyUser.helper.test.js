import { response } from "./verifyUser.helper.fixtures";
import {
  getResponseEntries,
  getArrayWithObjectContainMessage,
  getArrayContainMessage,
  getRestructuredArrayContainMessage,
  getObjWithTextMessage,
  getMessageFromSuccessResponse,
  getMessageFromMessageCode,
  isAlertShouldBeShown,
} from "./verifyUser.helper";

describe("Модуль получения данных, необходимых для отображения (в случае удачной отправке смс))", () => {
  it("Получение глубокой копии объекта", () => {
    const getResponseCopy = JSON.parse(JSON.stringify(response));
    expect(getResponseCopy).toEqual(response);
  });

  it("Преобразование структуры к массиву массивов ", () => {
    const getResponseCopy = JSON.parse(JSON.stringify(response));
    const getEntries = getResponseEntries(getResponseCopy);
    expect(getEntries.length).toBeGreaterThanOrEqual(1);
  });

  it("Получение отфильтрованного массива", () => {
    const getResponseCopy = JSON.parse(JSON.stringify(response));
    const getEntries = getResponseEntries(getResponseCopy);
    const getFilteredEntries = getArrayContainMessage(getResponseCopy);
    expect(getEntries.length).toBeGreaterThanOrEqual(getFilteredEntries.length);
  });

  it("Перестроение структуры массива", () => {
    const getResponseCopy = JSON.parse(JSON.stringify(response));
    const onlyObj = getRestructuredArrayContainMessage(getResponseCopy);
    expect(typeof onlyObj === "object").toBe(true);
  });

  it("Получение массива с нужными данными", () => {
    const getResponseCopy = JSON.parse(JSON.stringify(response));
    const getArrWithMessage = getArrayWithObjectContainMessage(getResponseCopy);
    const onlyObj = getRestructuredArrayContainMessage(getResponseCopy);
    expect(getArrWithMessage.length).toBeGreaterThanOrEqual(onlyObj.length);
  });

  it("Получение объекта с сообщением", () => {
    const getResponseCopy = JSON.parse(JSON.stringify(response));
    const objWithMessage = getObjWithTextMessage(getResponseCopy);
    expect(objWithMessage).toHaveProperty("MESSAGE");
  });

  it("получение сообщения", () => {
    const getResponseCopy = JSON.parse(JSON.stringify(response));
    const message = getMessageFromSuccessResponse(getResponseCopy);
    expect(typeof message === "string").toBe(true);
  });

  it("получение сообщения об ''", () => {
    const message = getMessageFromSuccessResponse({ data: [{ MESSAGE: "" }] });
    expect(message).toBe("");
  });

  it("получение сообщени об undefined", () => {
    const message = getMessageFromSuccessResponse({ data: [{ MESSAG: "" }] });
    expect(message).toBe(undefined);
  });

  it("не является  axiosResponse", () => {
    expect(() => {
      getMessageFromSuccessResponse({ dat: [{ MESSAGE: "" }] });
    }).toThrow();
  });
  it("проверяем возвращаемое сообщение при коде ошибки 201", () => {
    const message = getMessageFromMessageCode(201);
    expect(message).toBe("В Личном кабинете уже есть профиль с данным номером телефона");
  });
  it("проверяем возвращаемое сообщение при коде ошибки 202", () => {
    const message = getMessageFromMessageCode(202);
    expect(message).toBe("В Личном кабинете уже есть профиль с данным номером телефона");
  });
  it("проверяем возвращаемое сообщение при коде ошибки 203", () => {
    const message = getMessageFromMessageCode(203);
    expect(message).toBe("В Личном кабинете отсутствует профиль с данным номером телефона");
  });
  it("проверяем возвращаемое сообщение при коде ошибки 204", () => {
    const message = getMessageFromMessageCode(204);
    expect(message).toBe("В Личном кабинете уже есть профиль с данным номером телефона");
  });
  it("проверяем возвращаемое сообщение при отсутствии кода ошибки", () => {
    const message = getMessageFromMessageCode(250);
    expect(message).toBe("");
  });
  it("Проверяем нужно ли показывать алерт", () => {
    const isAlert = isAlertShouldBeShown("RECOVERY", "phone", 203);
    expect(isAlert).toBe(true);
  });
  it("Не должен показывать alert", () => {
    const isAlert = isAlertShouldBeShown("RECOVERY", "email", 203);
    expect(isAlert).toBe(false);
  });
});
