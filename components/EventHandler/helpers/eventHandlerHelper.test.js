import {
  getBoolean,
  getCopyData,
  getDataFieldsAsArr,
  getDataFieldsAsObj, isValidValue,
  setProperty,
} from "@/components/EventHandler/helpers/eventHandlerHelpers";

describe("eventHandlerHelpers", () => {
  describe("getCopyData", () => {
    test("Должна вернуться копия переданного объекта", () => {
      const data = { a: 1, b: 2 };
      const result = getCopyData(data);

      expect(result).toEqual(data);
      expect(result).not.toBe(data);
    });

    test("Возвращается null если ничего не передать", () => {
      expect(getCopyData()).toBe(null);
    });

    test("Возвращается null если передать не объект", () => {
      expect(getCopyData("")).toBe(null);
      expect(getCopyData(true)).toBe(null);
      expect(getCopyData(1)).toBe(null);
    });
  });

  describe("getDataFieldsAsObj", () => {
    const data = [
      { name: "a", value: 1 },
      { name: "b", value: 0 },
    ];

    test("Должен вернуться объект при передачи массива формы и списка филдов", () => {
      const result = getDataFieldsAsObj(data, ["a"]);

      expect(result).toHaveProperty("a", data[0]);
    });

    test("Должен вернуться объект только с ключом и значением которые есть в форме", () => {
      const result = getDataFieldsAsObj(data, ["a", "c"]);

      expect(result).toHaveProperty("a", data[0]);
      expect(result).not.toHaveProperty("c", data[0]);
    });

    test("Должен вернуться пустой объект если в форме нет переданных филдов", () => {
      const result = getDataFieldsAsObj(data, ["c"]);

      expect(result).toEqual({});
    });

    test("Должен вернуться null если переданные параметры не массивы", () => {
      expect(getDataFieldsAsObj(null, null)).toBe(null);
      expect(getDataFieldsAsObj(1, "asd")).toBe(null);
      expect(getDataFieldsAsObj([], {})).toBe(null);
      expect(getDataFieldsAsObj()).toBe(null);
    });
  });

  describe("getDataFieldsAsArr", () => {
    const data = [
      { name: "a", value: 1 },
      { name: "b", value: 0 },
    ];

    test("Должен вернуться не пустой массив при передачи валидных массивов", () => {
      const result = getDataFieldsAsArr(data, ["a"]);

      expect(result).toEqual([data[0]]);
    });

    test("Должен вернуться массив только с подходящими филдами", () => {
      const result = getDataFieldsAsArr(data, ["a", "с"]);

      expect(result).toEqual([data[0]]);
    });

    test("Должен вернуться null если переданные параметры не массивы", () => {
      expect(getDataFieldsAsArr(null, null)).toBe(null);
      expect(getDataFieldsAsArr(1, "asd")).toBe(null);
      expect(getDataFieldsAsArr([], {})).toBe(null);
      expect(getDataFieldsAsArr()).toBe(null);
    });
  });

  describe("getBoolean", () => {
    test("Должен вернуть true если это так", () => {
      expect(getBoolean(true)).toBe(true);
      expect(getBoolean("true")).toBe(true);
      expect(getBoolean("д")).toBe(true);
      expect(getBoolean("Y")).toBe(true);
    });

    test("Должен вернуть false если это так", () => {
      expect(getBoolean(false)).toBe(false);
      expect(getBoolean("false")).toBe(false);
      expect(getBoolean("н")).toBe(false);
      expect(getBoolean("N")).toBe(false);
    });

    test("Должен вернуть null если пришло не обрабатываемое значение", () => {
      expect(getBoolean("")).toBe(null);
      expect(getBoolean(null)).toBe(null);
      expect(getBoolean([])).toBe(null);
      expect(getBoolean(1)).toBe(null);
    });
  });

  describe("setProperty", () => {
    test("Должен установить значение true для visible при передачи true для существующего поля", () => {
      const data = { visible: false };

      setProperty(data, "visible", true);

      expect(data.visible).toBeTruthy();
    });

    test("Не должен установить аттрибут visible для не существующего свойства visible", () => {
      const data = { name: "Alena" };

      setProperty(data, "visible", true);

      expect(Object.hasOwn(data, "visible")).toBeFalsy();
    });

    test("Должено быть установлено значение true для visible при передачи true для полей из массива", () => {
      const data = [{ visible: false }, { visible: false }];

      setProperty(data, "visible", true);

      expect(data.every((item) => item.visible)).toBeTruthy();
    });

    test("Должено быть установлено значение true для visible при передачи true и наличии свойства visible для полей из массива", () => {
      const data = [{ visible: false }, { name: "Vi" }];

      setProperty(data, "visible", true);

      expect(data[0].visible).toBeTruthy();
      expect(Object.hasOwn(data[1], "visible")).toBeFalsy();
    });

    test("При невалидных параметрах данных функция не падает", () => {
      expect(() => setProperty({ name: "Dasha" })).not.toThrow();
      expect(() => setProperty(null, "", 1)).not.toThrow();
      expect(() => setProperty()).not.toThrow();
    });
  });

  describe("isValidValue", () => {
    test("Должен вернуть true при получении НЕ null undefined и пустой строки", () => {
      expect(isValidValue(true)).toBeTruthy();
      expect(isValidValue(false)).toBeTruthy();
      expect(isValidValue(0)).toBeTruthy();
      expect(isValidValue('a')).toBeTruthy();
      expect(isValidValue({})).toBeTruthy();
    });

    test("Должен вернуть false при получении null undefined и пустой строки", () => {
      expect(isValidValue(null)).toBeFalsy();
      expect(isValidValue(undefined)).toBeFalsy();
      expect(isValidValue('')).toBeFalsy();
    });
  });
});
