import { findUnSensitiveCaseCoincidence } from "./ControlCustomCombobox.helper";
import { data } from "./ControlCustomCombobox.helper.fixtures";

describe("formattedNumber", () => {
  it("Находим соответствие со строкой вне зависимости от регистра", async () => {
    let coincidence = data.options.find((i) => findUnSensitiveCaseCoincidence(i.text, "А"));

    expect(coincidence).toEqual({
      SNAME: "АБХАЗИЯ",
      ID: 239,
      value: 239,
      text: "АБХАЗИЯ",
    });
    coincidence = data.options.find((i) => findUnSensitiveCaseCoincidence(i.text, "р"));

    expect(coincidence).toEqual({
      SNAME: "РОССИЯ",
      ID: 179,
      value: 179,
      text: "РОССИЯ",
    });

    coincidence = data.options.find((i) => findUnSensitiveCaseCoincidence(i.text, "Р"));
    expect(coincidence).toEqual({
      SNAME: "РОССИЯ",
      ID: 179,
      value: 179,
      text: "РОССИЯ",
    });
  });

  it("фильтруем массив, отыскивая совпадения", () => {
    let coincidence = data.options.filter((item) => findUnSensitiveCaseCoincidence(item.text, "рос"));
    expect(coincidence).toEqual([{ SNAME: "РОССИЯ", ID: 179, value: 179, text: "РОССИЯ" }]);

    coincidence = data.options.filter((item) => findUnSensitiveCaseCoincidence(item.text, "ан"));

    expect(coincidence).toEqual([
      { SNAME: "АЗЕРБАЙДЖАН", ID: 9, value: 9, text: "АЗЕРБАЙДЖАН" },
      { SNAME: "АЛБАНИЯ", ID: 2, value: 2, text: "АЛБАНИЯ" },
      { SNAME: "АНГИЛЬЯ", ID: 183, value: 183, text: "АНГИЛЬЯ" },
      { SNAME: "АНГОЛА", ID: 7, value: 7, text: "АНГОЛА" },
      { SNAME: "АНДОРРА", ID: 6, value: 6, text: "АНДОРРА" },
      { SNAME: "АНТАРКТИДА", ID: 3, value: 3, text: "АНТАРКТИДА" },
      { SNAME: "АФГАНИСТАН", ID: 1, value: 1, text: "АФГАНИСТАН" },
      { SNAME: "БАНГЛАДЕШ", ID: 15, value: 15, text: "БАНГЛАДЕШ" },
    ]);
  });
});
