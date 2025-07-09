export const propsWizardProgressBar = {
  currentTab: {
    name: "Расчет",
    idItem: 1040,
    id: 4346,
    list: false,
    order: 3,
  },
  loading: null,
  qty: 13,
  tabs: [
    {
      name: "Тип расчета",
      idItem: 1037,
      id: 4287,
      list: false,
      order: 1,
    },
    {
      name: "Данные об авто",
      idItem: 1039,
      id: 4332,
      list: false,
      order: 2,
    },
    {
      name: "Расчет",
      idItem: 1040,
      id: 4346,
      list: false,
      order: 3,
    },
    {
      name: "Личные данные",
      idItem: 1041,
      id: 4357,
      list: false,
      order: 4,
    },
    {
      name: "Сведения о ТС",
      idItem: 1064,
      id: 4369,
      list: false,
      order: 5,
    },
    {
      name: "Доп сведения о ТС",
      idItem: 1065,
      id: 4370,
      list: false,
      order: 6,
    },
    {
      name: "Документы ТС",
      idItem: 1066,
      id: 4360,
      list: false,
      order: 7,
    },
    {
      name: "Водители",
      idItem: 1068,
      id: 4361,
      list: false,
      order: 8,
    },
    {
      name: "Параметры полиса",
      idItem: 1069,
      id: 4362,
      list: false,
      order: 9,
    },
    {
      name: "Точный расчет",
      idItem: 1070,
      id: 4363,
      list: false,
      order: 10,
    },
    {
      name: "Сканы документов",
      idItem: 1048,
      id: 4364,
      list: false,
      order: 11,
    },
    {
      name: "Осмотр",
      idItem: 1049,
      id: 4365,
      list: false,
      order: 12,
    },
    {
      name: "Оплата",
      idItem: 1072,
      id: 4366,
      list: false,
      order: 13,
    },
  ],
};

export const routeWizardProgressBar = {
  path: "/cabinet/wizard/1036/55/0/1039/192/B6DE4837B7A46666637CF1CD2B163C69",
  query: {},
  params: {
    idWizard: "1036",
    idModule: "55",
    idParent: "0",
    idItem: "1039",
    idCard: "192",
    idRel: "B6DE4837B7A46666637CF1CD2B163C69",
  },
  fullPath: "/cabinet/wizard/1036/55/0/1039/192/B6DE4837B7A46666637CF1CD2B163C69",
  meta: "Cabinet",
};

export const storeWizardProgressBar = {
  getters: {
    "wizard/getWizardPages": function () {
      return "1037;1039;1040;1041;1042;1064;1065;1066;1068;1069;1070;1048;1049;1072";
    },
    "wizard/getWizardData": function () {
      return {
        REL: "888AFE4BF23FF514FF719997087428BF|05F91C609FC13367FE963AE026A4BE76|94239416A0658988F40DB2729A90065E|58E835A10193E871D48141D388ECFD08|B31AA9BABE38F7749E48AF464C3B3E98|60C817C93233E8F79A7CA8D35E845041|87F59924529CFA536BD85FEC7DE21A44|A4481C0CF3F29BE0FAC4817ECA00985F|37DBDFC60C2BEA2CA9F8E2ACDFA56B49|6929912BE13C4B1F60F17924E17D0E16|5E02125D50664ADE2545BC002646C264|EA9656CD15A4C8C686AFB02EA67BBE8F|2D4C1A2EA57B8295469283384B7BDD98",
        ID: 303,
      };
    },
  },
};
