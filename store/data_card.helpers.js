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
  return Object.assign({}, obj);
}

export function isArrayOfBlobs(obj) {
  return Array.isArray(obj) ? true : false;
}

export function isTypeBlob(array) {
  return array.every((item) => item.type === "field/blob");
}

export function convertUploaderFilesToFormData(obj) {
  const formData = new FormData();

  const noBlobs = Object.entries(obj).filter(([key, value]) => {
    if (isArrayOfBlobs(value) && isTypeBlob) {
      value.forEach((item) => formData.append(key, item));
      return false;
    }
    return true;
  });

  formData.append("JSON", JSON.stringify(Object.fromEntries(noBlobs)));

  return formData;
}
