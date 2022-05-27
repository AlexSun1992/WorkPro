//const FormData = require("form-data");

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

export function convertUploaderFilesToFormData(obj) {
  const formData = new FormData();
  const copyObjBlobs = copyObject(obj);
  const copyObjNotBlob = copyObject(obj);

  Object.keys(copyObjBlobs).forEach((item) => {
    if (!Array.isArray(copyObjBlobs[item])) {
      delete copyObjBlobs[item];
    }
  });

  Object.keys(copyObjNotBlob).forEach((item) => {
    if (Array.isArray(copyObjNotBlob[item])) {
      delete copyObjNotBlob[item];
    }
  });

  Object.keys(copyObjBlobs).forEach((item) => {
    for (let i = 0; i < copyObjBlobs[item].length; i++) {
      formData.append(`${item}`, copyObjBlobs[item][i]);
    }
  });

  formData.append("JSON", JSON.stringify(copyObjNotBlob));
  return formData;
}
