import { detectUniquePropertyName } from "./detectUniquePropertyName";

const res = [
  {
    SPOLICY: "4937513-13/23",
    IDPOLICYFR: 0,
    SSTOMATOL: "Y",
    LSHOWGLSERV: "Y",
    SNAME: "4937513-13/23: Кравцова Юлия Витальевна",
    VLBLOCKPND: "N",
    LSHOWMEDSWISS: "Y",
    LSHOWMCALLCENTER: "N",
    LDEFAULT: true,
    SPHONE: "8-958-801-22-50",
    SCLINIC: "Y",
    IDPOLICY: 2384084350,
    LSTOMATOL: true,
    MSBLOCK1: "N",
    LSHOWGL: "Y",
    SCHILD: "N",
    IDMEDPARTNER: 56190,
  },
  {
    SPOLICY: "4937513-13/23-ИС319",
    IDPOLICYFR: 0,
    SSTOMATOL: "Y",
    LSHOWGLSERV: "Y",
    SNAME: "4937513-13/23-ИС319: Кравцова Юлия Витальевна",
    VLBLOCKPND: "N",
    LSHOWMEDSWISS: "Y",
    LSHOWMCALLCENTER: "N",
    LDEFAULT: true,
    SPHONE: "8-958-801-22-50",
    SCLINIC: "Y",
    IDPOLICY: 2391318304,
    LSTOMATOL: true,
    MSBLOCK1: "N",
    LSHOWGL: "Y",
    SCHILD: "N",
    IDMEDPARTNER: 56190,
  },
];

const result = [
  {
    SSPECIALIST: "Аллерголог-иммунолог",
    SNAME: "Аллерголог-иммунолог",
    IDSPECIALIST: 126,
    ID: 126,
  },
  {
    SSPECIALIST: "Гастроэнтеролог",
    SNAME: "Гастроэнтеролог",
    IDSPECIALIST: 176,
    ID: 176,
  },
  {
    SSPECIALIST: "Гинеколог-взрослый",
    SNAME: "Гинеколог-взрослый",
    IDSPECIALIST: 342,
    ID: 342,
  },
  { SSPECIALIST: "Гинеколог", SNAME: "Гинеколог", IDSPECIALIST: 80, ID: 80 },
  {
    SSPECIALIST: "Дерматолог",
    SNAME: "Дерматолог",
    IDSPECIALIST: 127,
    ID: 127,
  },
  { SSPECIALIST: "Кардиолог", SNAME: "Кардиолог", IDSPECIALIST: 155, ID: 155 },
  { SSPECIALIST: "Маммолог", SNAME: "Маммолог", IDSPECIALIST: 128, ID: 128 },
  { SSPECIALIST: "Невролог", SNAME: "Невролог", IDSPECIALIST: 83, ID: 83 },
  {
    SSPECIALIST: "Оториноларинголог",
    SNAME: "Оториноларинголог",
    IDSPECIALIST: 94,
    ID: 94,
  },
  {
    SSPECIALIST: "Офтальмолог",
    SNAME: "Офтальмолог",
    IDSPECIALIST: 85,
    ID: 85,
  },
  { SSPECIALIST: "Проктолог", SNAME: "Проктолог", IDSPECIALIST: 81, ID: 81 },
  {
    SSPECIALIST: "Пульмонолог",
    SNAME: "Пульмонолог",
    IDSPECIALIST: 170,
    ID: 170,
  },
  {
    SSPECIALIST: "Стоматолог (платно!!)",
    SNAME: "Стоматолог (платно!!)",
    IDSPECIALIST: 90,
    ID: 90,
  },
  { SSPECIALIST: "Терапевт", SNAME: "Терапевт", IDSPECIALIST: 79, ID: 79 },
  {
    SSPECIALIST: "Травматолог",
    SNAME: "Травматолог",
    IDSPECIALIST: 96,
    ID: 96,
  },
  { SSPECIALIST: "Уролог", SNAME: "Уролог", IDSPECIALIST: 82, ID: 82 },
  { SSPECIALIST: "Флеболог", SNAME: "Флеболог", IDSPECIALIST: 171, ID: 171 },
  { SSPECIALIST: "Хирург", SNAME: "Хирург", IDSPECIALIST: 55, ID: 55 },
  {
    SSPECIALIST: "Эндокринолог",
    SNAME: "Эндокринолог",
    IDSPECIALIST: 149,
    ID: 149,
  },
];

describe("Возвращаем уникальное свойство из массива объектов", () => {
  it("Возвращаем ключ,который есть в каждом объекте с уникальным значением ", () => {
    const uniquePropertyName = detectUniquePropertyName(res);
    expect(uniquePropertyName).toBe("IDPOLICY");
  });

  it("Возвращаем ключ,который есть в каждом объекте с уникальным значением (другие вводные) ", () => {
    const uniquePropertyName = detectUniquePropertyName(result);
    expect(uniquePropertyName).toBe("ID");
  });

  it("Возвращаем ключ,который есть в каждом объекте с уникальным значением (есть объекты с уникальными ключами)", () => {
    const uniquePropertyName = detectUniquePropertyName([
      {
        SSTOMATOL: "Y",
        IDPOLICYFR: 55,
      },
      {
        SPOLICY: "4937513-13/23-ИС319",
        IDPOLICYFR: 0,
      },
    ]);
    expect(uniquePropertyName).toBe("IDPOLICYFR");
  });
});
