import { countOffices, getUnderlineId, getTime, getGrafs } from "./helpers";

describe("countOffices from helpers module", () => {
  it("should return string '1 отделение' if offices countOffices is equal to 1", () => {
    const office = {
      info: [{}],
    };
    expect(countOffices(office)).toBe("1 отделение");
  });

  it("should return string '4 отделения' if offices countOffices is equal to 4", () => {
    const office = {
      info: [{}, {}, {}, {}],
    };
    expect(countOffices(office)).toBe("4 отделения");
  });

  it("should return string '5 отделений' if offices countOffices is equal to 5", () => {
    const office = {
      info: [{}, {}, {}, {}, {}],
    };
    expect(countOffices(office)).toBe("5 отделений");
  });
});

describe("getUnderlineId from helpers module", () => {
  it("should return id if station is written lowercase and sname is written uppercase", () => {
    const station = "тест";
    const office = {
      IDUNDERGROUND: [
        {
          SNAME: "ТЕСТ",
          IDUNDERLINE: 1,
        },
      ],
    };
    expect(getUnderlineId(station, office)).toBeDefined();
  });

  it("should return id if station is written uppercase and sname is written lowercase", () => {
    const station = "ТЕСТ";
    const office = {
      IDUNDERGROUND: [
        {
          SNAME: "тест",
          IDUNDERLINE: 1,
        },
      ],
    };
    expect(getUnderlineId(station, office)).toBeDefined();
  });
});

describe("getTime from helpers module", () => {
  it("should return distance to office in minutes", () => {
    const distance = 1;
    expect(getTime(distance)).toBe("20 мин");
  });

  it("should return distance to office in km", () => {
    const distance = 5.5;
    expect(getTime(distance)).toBe("5.5 км");
  });

  it("should return empty string if nothing passed", () => {
    expect(getTime());
  });
});

describe("getCorrectGrafs from helpers module", () => {
  it("should return the correct grafs (data includes wrong values)", () => {
    const testData =
      "Пн.-Пт.: 9.30-20.00\nСб.: 10.00-18.0\nВс.: 10.00-16.00 *** Прием документов по страховым случаям:\nПн.-Чт.: 9.30-18.00,\nПт.: 9.30-17.00";
    expect(getGrafs(testData).includes("***")).toBe(false);
  });
  it("should return the correct grafs (only correct data)", () => {
    const testData = "Пн.-Пт.: 9.30-20.00\nСб.: 10.00-18.00\nВс.: 10.00-16.00\n***";
    expect(getGrafs(testData).includes("***")).toBe(false);
  });
});
