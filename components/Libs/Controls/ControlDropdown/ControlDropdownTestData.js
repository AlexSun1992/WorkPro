export const controlDropdownDataTest = {
  props: {
    options: [
      {
        invisible: false,
        name: "Тип расчета",
        id: 4312,
      },
      {
        invisible: false,
        name: "Данные об авто",
        id: 4314,
      },
      {
        invisible: false,
        name: "Данные о Водителе",
        id: 4315,
      },
    ],
    textKey: "name",
    valueKey: "id",
  },
};

export const dataSet = {
  label: "Укажите",
  value: 1,
  type: "Dropdown",
  structType: "double",
  id: "1105",
  fieldId: 73884,
  cols: 6,
  colSm: 12,
  colMd: 12,
  isMask: false,
  colLg: 12,
  width: "100%",
  name: "IDREGNUMBER",
  cssClass: "type-gos-number",
  webId: "",
  visible: true,
  required: false,
  page: 2,
  readonly: false,
  control: null,
  state: null,
  checked: null,
  error: null,
  isRelation: false,
  fieldRelation: null,
  isTab: true,
  options: [
    {
      SNAME: "госномер автомобиля",
      ID: 1,
      value: 1,
      text: "госномер автомобиля",
    },
    {
      SNAME: "госномер мотоцикла",
      ID: 2,
      value: 2,
      text: "госномер мотоцикла",
    },
    {
      SNAME: "госномер другого формата",
      ID: 3,
      value: 3,
      text: "госномер другого формата",
    },
  ],
};
