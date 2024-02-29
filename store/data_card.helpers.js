import { isArray } from "lodash";

export function getFieldsValueTypeIsNotUploader(fieldsValues) {
  const notUploaderTypeFieldsValues = fieldsValues.filter(
    (field) => field.type !== "Uploader"
  );
  return notUploaderTypeFieldsValues;
}

export function getFieldsValueTypeUploader(fieldsValues) {
  const notUploaderTypeFieldsValues = fieldsValues.filter(
    (field) => field.type === "Uploader"
  );
  return notUploaderTypeFieldsValues;
}

export function rebuildObject(fieldsValues) {
  const copyArrayOfObjects = getFieldsValueTypeIsNotUploader(fieldsValues).map(
    (item) => ({ ...item })
  );

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
  const splicedObjects = rebuildObject(fieldsValues).map((i) =>
    deleteRedundantProperty(i)
  );
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
      mergedFormData.set(
        "JSON",
        JSON.stringify({ ...Object.fromEntries(noBlobs), ...JSON_DATA })
      );
      return mergedFormData;
    } catch (e) {
      throw new Error("Ошибка подготовки файлов для отправки");
    }
  }

  formData.append("JSON", JSON.stringify(Object.fromEntries(noBlobs)));

  return formData;
}
