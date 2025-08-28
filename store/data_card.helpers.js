export function getVisibleStatus(visibleEl, hidedEl, value) {
  if (visibleEl.some((el) => el.name === value)) {
    return false;
  }
  if (hidedEl.some((el) => el.name === value)) {
    return true;
  }
  return false;
}

export function getFieldsValueTypeIsNotUploader(fieldsValues) {
  const notUploaderTypeFieldsValues = fieldsValues.filter((field) => field.type !== "Uploader");
  return notUploaderTypeFieldsValues;
}

export function getFieldsValueTypeUploader(fieldsValues) {
  const notUploaderTypeFieldsValues = fieldsValues.filter((field) => field.type === "Uploader");
  return notUploaderTypeFieldsValues;
}

export function rebuildObject(fieldsValues) {
  const copyArrayOfObjects = getFieldsValueTypeIsNotUploader(fieldsValues).map((item) => ({ ...item }));

  return copyArrayOfObjects;
}

export function deleteRedundantProperty(currentObject) {
  Object.keys(currentObject).forEach((property) => {
    if (property !== "name" && property !== "value") {
      delete currentObject[property];
    }
  });

  return currentObject;
}

export function getSplicedObjects(fieldsValues) {
  const splicedObjects = rebuildObject(fieldsValues).map((i) => deleteRedundantProperty(i));
  return splicedObjects;
}

export function reSet(object) {
  const collection = [];
  const group = [];
  Object.keys(object).forEach((i) => group.push(object[i]));
  collection.push(group);
  return Object.fromEntries(collection);
}

export function changeObj(arrayObjects) {
  const filterArrayObjects = arrayObjects.map((i) => reSet(i));
  const resultData = Object.assign({}, ...filterArrayObjects);
  return JSON.stringify(resultData);
}

export function copyObject(obj) {
  return { ...obj };
}

export function isArrayOfBlobs(obj) {
  return !!Array.isArray(obj);
}

export function isTypeBlob(array) {
  return array.every((item) => item.type === "field/blob");
}

function getFilesFormData(obj) {
  const valueFormData = Object.entries(obj).find(([key, value]) => {
    if (key === "FILES" && value instanceof FormData) {
      return true;
    }
    return false;
  });
  if (valueFormData) {
    if (Object.fromEntries([valueFormData])?.FILES) {
      return Object.fromEntries([valueFormData]).FILES;
    }
  }
  return null;
}

export function mergeFormData(formData1, formData2) {
  const mergedFormData = new FormData();

  for (const [key, value] of formData1.entries()) {
    mergedFormData.append(key, value);
  }

  for (const [key, value] of formData2.entries()) {
    if (mergedFormData.has(key)) {
      mergedFormData.append(key, value);
    } else {
      mergedFormData.set(key, value);
    }
  }

  return mergedFormData;
}

export function convertUploaderFilesToFormData(obj) {
  const formData = new FormData();

  const noBlobs = Object.entries(obj).filter(([key, value]) => {
    if (isArrayOfBlobs(value) && isTypeBlob && !(value instanceof FormData)) {
      value.forEach((item) => formData.append(key, item));
      return false;
    }
    return true;
  });

  const filesFormData = getFilesFormData(obj);
  if (filesFormData) {
    try {
      const mergedFormData = mergeFormData(formData, filesFormData);
      const JSON_DATA = JSON.parse(filesFormData.get("JSON"));
      mergedFormData.set("JSON", JSON.stringify({ ...Object.fromEntries(noBlobs), ...JSON_DATA }));
      return mergedFormData;
    } catch (e) {
      throw new Error("Ошибка подготовки файлов для отправки");
    }
  }

  formData.append("JSON", JSON.stringify(Object.fromEntries(noBlobs)));

  return formData;
}

/**
 * Универсальная валидация для vue-the-mask
 * @param {string} value - Введенное значение
 * @param {string} mask - Маска в формате vue-the-mask
 * @returns {boolean|null} - При наличии маски возвращаем boolean, при отсутствии возвращаем null
 */

export function validateWithMask(value, mask) {
  const masksNames = ["EMAIL"];
  const masks = {
    EMAIL:
      /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i,
  };

  if (!masksNames.includes(mask)) {
    if (!value || !mask) return false;

    const lengthMask = mask.replace(/[^a-z#!]/gi, "")?.length;
    const lengthValue = value.replace(/^\+7/, "").replace(/[^а-яюa-z0-9#!]/gi, "")?.length;

    return lengthMask === lengthValue;
  }

  const currentMask = masksNames.find((item) => item === mask);
  return currentMask ? masks[currentMask].test(value) : null;
}
/**
 * Устанавливаем ошибки при для vue-the-mask
 * @param {string} mask - Маска в формате vue-the-mask
 * @returns {boolean|string} - при отсутствии текста ошибки возвращаем null, а при наличии-строку
 */
export function setErrorMask(mask) {
  const errorsText = {
    EMAIL: "Пожалуйста, введите корректный e-mail",
  };
  const isErrorExist = Object.keys(errorsText).find((el) => mask === el);
  return isErrorExist ? errorsText[isErrorExist] : null;
}

/**
 *
 * @param params {Object}
 * @param [params.timeout] {Number}
 * @param params.url {String}
 * @param params.fieldId {Number}
 * @param params.commit {Function}
 * @param params.fetchOptionsByJSONTimeout {Object}
 * @param params.resolve {Function}
 * @param params.reject {Function}
 * @param params.fetchOptionsByJSONController {Object}
 * @param params.axios {Object}
 * @return {Promise<*>}
 */
export async function doGetOptions(params) {
  try {
    params.fetchOptionsByJSONTimeout[params.fieldId] = await setTimeout(async () => {
      const response = await params.axios.$get(params.url, {
        signal: params.fetchOptionsByJSONController[params.fieldId].signal,
      });
      const options = response[0]?._data ?? [];

      params.commit("setFieldOptionsByFieldId", { options, fieldId: params.fieldId });

      return params.resolve();
    }, params.timeout ?? 500);
  } catch (err) {
    console.error(`fetchOptionsByJSON ERROR: ${err}`);

    params.commit("setFieldOptionsByFieldId", { options: [], fieldId: params.fieldId });

    return params.reject();
  }
}

export function getFetchValue(acc = {}, item) {
  const { value } = item;
  const jsonValue = value?.value ?? { [item.name]: value };

  return { ...acc, ...jsonValue };
}
