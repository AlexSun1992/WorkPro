import { findField } from "@/components/EventHandler/helpers";

export function getCopyData(data) {
  if (typeof data !== "object" || data === null) {
    return null;
  }

  return JSON.parse(JSON.stringify(data));
}

export function getDataFieldsAsObj(data, fields) {
  if (!Array.isArray(data) || !Array.isArray(fields)) {
    console.error(`getDataFields. Невозможно произвести поиск. Параметры должны быть массивами.`);

    return null;
  }

  return fields.reduce((acc, fieldName) => {
    const item = findField(data, fieldName);

    if (item && Object.keys(item).length) {
      acc[fieldName] = findField(data, fieldName);
    }

    return acc;
  }, {});
}

export function getDataFieldsAsArr(data, fields) {
  const result = [];

  if (!Array.isArray(data) || !Array.isArray(fields)) {
    console.error(`getDataFields. Невозможно произвести поиск. Параметры должны быть массивами.`);

    return null;
  }

  fields.forEach((fieldName) => {
    const item = findField(data, fieldName) ?? null;

    if (item && Object.keys(item).length) {
      result.push(item);
    }
  });

  return result;
}

export function getBoolean(val) {
  const trueValues = ["y", "д", "true"];
  const falseValues = ["n", "н", "false"];

  if (typeof val === "boolean") {
    return val;
  }

  if (typeof val !== "string") {
    console.warn(`getBoolean. Получено неподдерживаемое значение ${val}`);

    return null;
  }

  if (val && trueValues.includes(val.toLowerCase())) {
    return true;
  }

  if (val && falseValues.includes(val.toLowerCase())) {
    return false;
  }

  console.warn(`getBoolean. Получено неподдерживаемое значение ${val}`);

  return null;
}

/**
 * @param {Array} fields
 * @param {Boolean} state
 */
export function setFieldsVisibleState(fields, state) {
  if (!Array.isArray(fields) || typeof state !== "boolean") {
    return console.warn(`setFieldsVisibleState. Параметры должны быть массивами`);
  }

  fields.forEach((item) => {
    item.visible = state;
  });
}

/**
 * @param {Array} fields - список объектов полей
 */
export function hideFields(fields) {
  setFieldsVisibleState(fields, false);
}

/**
 * @param {Array} fields - список объектов полей
 */
export function showFields(fields) {
  setFieldsVisibleState(fields, true);
}

/**
 *
 * @param {(Array | Object)} data
 * @param {String} prop
 * @param val
 */
export function setProperty(data, prop, val) {
  const action = (item) => {
    if (!Object.hasOwn(item, prop)) {
      return console.warn(`setProperty. Свойство ${prop} для поля ${item.name ?? "НЕ ОПРЕДЕЛЕНО"} не найдено`);
    }

    item[prop] = val;
  };

  if (!data || typeof prop !== "string" || typeof val !== "boolean") {
    return console.warn("setProperty. Переданы не корректные данные");
  }

  if (Array.isArray(data)) {
    data.forEach((field) => action(field));

    return;
  }

  action(data);
}

export function isValidValue(val) {
  return val !== null && val !== undefined && val !== "";
}
