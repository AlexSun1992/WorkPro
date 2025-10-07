import { isBoolean, isFalse, isTrue } from "./AMCBoolean.helper";

describe("AMCBoolean.helper", () => {
  describe("isTrue", () => {
    test("С val = true должно вернуть true", () => {
      expect(isTrue(true)).toBe(true);
    });

    test("С val = 'TRUE' должно вернуть true", () => {
      expect(isTrue("TRUE")).toBe(true);
    });

    test("С val = 1 должно вернуть true", () => {
      expect(isTrue(1)).toBe(true);
    });

    test("С val = 'Y' должно вернуть true", () => {
      expect(isTrue("Y")).toBe(true);
    });

    test("С val = 2 должно вернуть false", () => {
      expect(isTrue(2)).toBe(false);
    });

    test("С val = null должно вернуть false", () => {
      expect(isTrue(null)).toBe(false);
    });
  });

  describe("isFalse", () => {
    test("С val = false должно вернуть true", () => {
      expect(isFalse(false)).toBe(true);
    });

    test("С val = 'FALSE' должно вернуть true", () => {
      expect(isFalse("FALSE")).toBe(true);
    });

    test("С val = 0 должно вернуть true", () => {
      expect(isFalse(0)).toBe(true);
    });

    test("С val = 'Н' должно вернуть true", () => {
      expect(isFalse("Н")).toBe(true);
    });

    test("С val = null должно вернуть false", () => {
      expect(isFalse(null)).toBe(false);
    });

    test("С val = -1 должно вернуть false", () => {
      expect(isFalse(-1)).toBe(false);
    });
  });

  describe("isBoolean", () => {
    test("С val = true должен вернуть true", () => {
      expect(isBoolean(true)).toBe(true);
    });

    test("С val = 'FALSE' должен вернуть true", () => {
      expect(isBoolean("FALSE")).toBe(true);
    });

    test("С val = 'Y' должен вернуть true", () => {
      expect(isBoolean("Y")).toBe(true);
    });

    test("С val = 'Д' должен вернуть true", () => {
      expect(isBoolean('Д')).toBe(true);
    });

    test("С val = null должен вернуть false", () => {
      expect(isBoolean(null)).toBe(false);
    });

    test("С val = 10 должен вернуть false", () => {
      expect(isBoolean(null)).toBe(false);
    });

    test("С val = undefined должен вернуть false", () => {
      expect(isBoolean(undefined)).toBe(false);
    });
  });
});
