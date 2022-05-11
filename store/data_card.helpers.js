//const FormData = require("form-data");

export function getFieldsValueTypeIsNotUploader(fieldsValues) {
  const notUploaderTypeFieldsValues = fieldsValues.filter(
    (field) => field.type !== "Uploader"
  );
  return notUploaderTypeFieldsValues;
}

export function convertFieldValuesToJSON(fieldsValues) {
  const notUploaderTypeFieldsValues =
    getFieldsValueTypeIsNotUploader(fieldsValues);
  const convertFieldValues = notUploaderTypeFieldsValues.map((field) =>
    JSON.stringify(field)
  );
  return convertFieldValues;
}

export function rebuildObject(fieldsValues) {
  const objectsNeededForBackEnd = [];

  const arrOfFieldsValues = getFieldsValueTypeIsNotUploader(fieldsValues);

  arrOfFieldsValues.forEach((item) => {
    objectsNeededForBackEnd.push(item);
  });

  return objectsNeededForBackEnd;
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

export function restructureData(fieldsValues) {
  const rebuildObjects = getSplicedObjects(fieldsValues)
    .map((item) => `${item.name}:${item.value}`)
    .map((item) => item.split(":"));

  const resultData = JSON.stringify(Object.fromEntries(rebuildObjects));
  return resultData;
}

export function getFieldsValueTypeUploader(fieldsValues) {
  const notUploaderTypeFieldsValues = fieldsValues.filter(
    (field) => field.type === "Uploader"
  );
  return notUploaderTypeFieldsValues;
}
