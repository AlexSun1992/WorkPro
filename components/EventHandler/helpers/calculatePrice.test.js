import { calculatePrice, getAdditionalOptions } from "./calculatePrice";
import { findField } from "./findField"; // общий импорт

jest.mock("./findField"); // автоматический мок findField

describe("getAdditionalOptions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("возвращает пустой объект при отсутствии IMSOPTIONS", () => {
    findField.mockReturnValueOnce(null);

    const res = getAdditionalOptions({}, "IMSOPTIONS");
    expect(res).toEqual({ price: 0, options: [] });
  });

  it("корректно суммирует цены по выбранным опциям", () => {
    findField.mockReturnValueOnce({
      value: ["1", "2"],
      options: [
        { ID: 1, NPRICE: 10, DYNAMICTEXT: "Опция 1" },
        { ID: 2, NPRICE: 20, DYNAMICTEXT: "Опция 2" },
      ],
    });

    const res = getAdditionalOptions({}, "IMSOPTIONS");
    expect(res).toEqual({
      price: 30,
      options: ["Опция 1", "Опция 2"],
    });
  });

  it("парсит value как JSON-строку", () => {
    findField.mockReturnValueOnce({
      value: JSON.stringify(["1"]),
      options: [{ ID: "1", NPRICE: 15, DYNAMICTEXT: "Опция 1" }],
    });

    const res = getAdditionalOptions({}, "IMSOPTIONS");
    expect(res).toEqual({ price: 15, options: ["Опция 1"] });
  });

  it("игнорирует опции, которых нет в списке", () => {
    findField.mockReturnValueOnce({
      value: ["99"],
      options: [{ ID: "1", NPRICE: 15, DYNAMICTEXT: "Опция 1" }],
    });

    const res = getAdditionalOptions({}, "IMSOPTIONS");
    expect(res).toEqual({ price: 0, options: [] });
  });
});

describe("calculatePrice", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("возвращает сумму basePrice и доп. опций", () => {
    findField
      .mockReturnValueOnce({ options: [{ value: "100" }] }) // NCOST
      .mockReturnValueOnce({
        value: ["1"],
        options: [{ ID: "1", NPRICE: 50, DYNAMICTEXT: "Опция 1" }],
      }); // IMSOPTIONS

    const res = calculatePrice({}, "NCOST", "IMSOPTIONS");
    expect(res).toEqual({
      fullPrice: 150,
      additional: ["Опция 1"],
    });
  });

  it("корректно обрабатывает отсутствующую цену", () => {
    findField
      .mockReturnValueOnce(null) // NCOST
      .mockReturnValueOnce({ value: [], options: [] }); // IMSOPTIONS

    const res = calculatePrice({}, "NCOST", "IMSOPTIONS");
    expect(res).toEqual({
      fullPrice: 0,
      additional: [],
    });
  });

  it("подставляет 0 при NaN в цене", () => {
    findField
      .mockReturnValueOnce({ options: [{ value: "abc" }] }) // NCOST
      .mockReturnValueOnce({ value: [], options: [] }); // IMSOPTIONS

    const res = calculatePrice({}, "NCOST", "IMSOPTIONS");
    expect(res).toEqual({ fullPrice: 0, additional: [] });
  });
});
