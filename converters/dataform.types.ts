export type Lk2Webfield = {
  /** Название поля */
  label: "Распечатать проект";
  /** Тип */
  type: "button";
  /** ID пункта меню (строка!!!) */
  id: string;
  /** ID поля */
  fieldId: number;
  /** Количество колонок */
  cols: number;
  /** Количество колонок sm */
  colSm: number;
  /** Количество колонок md */
  colMd: number;
  /** Количество колонок lg */
  colLg: number;
  /** Признак поля с маской */
  isMask: boolean;
  /**
   * Ширина
   * @example "60%"
   */
  width: string;
  /** Наименование поля */
  name: string | `Item${number}`;
  /** CSS классы */
  cssClass: string;
  webId: string;
  /** Признак видимости */
  visible: boolean;
  /** Признак обязательности */
  required: boolean;
  /** ID страницы */
  page: number;
  /** Признак disable */
  readonly: false;
  control: null;
  state: null;
  checked: null;
  error: null;
  isRelation: false;
  fieldRelation: null;
  isTab: true;
  /** Значение поля */
  value?: any;
};
