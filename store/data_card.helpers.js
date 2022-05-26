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

export function convertUploaderFilesToFormData(obj) {
  const arrayOfFieldsValueTypeBlob = [];
  const formData = new FormData();

  Object.keys(obj).forEach((item) => {
    if (obj[item].type === "field/blob") {
      arrayOfFieldsValueTypeBlob.push(obj[item]);
      delete obj[item];
    }
  });
  const filedValuesTypeBlob = new File(
    [...arrayOfFieldsValueTypeBlob],
    "UploaderFiles",
    {
      type: "field/blob",
    }
  );

  formData.append("Blobs:", filedValuesTypeBlob);
  formData.append("NotBlob:", JSON.stringify(obj));

  return formData;
}

// export function convertFieldValuesToJSON(fieldsValues) {
//   const notUploaderTypeFieldsValues =
//     getFieldsValueTypeIsNotUploader(fieldsValues);
//   const convertFieldValues = notUploaderTypeFieldsValues.map((field) =>
//     JSON.stringify(field)
//   );
//   return convertFieldValues;
// }

// export function restructureData(fieldsValues) {
//   const rebuildObjects = getSplicedObjects(fieldsValues)
//     .map((item) => `${item.name}:${item.value}`)
//     .map((item) => item.split(":"));

//   const resultData = JSON.stringify(Object.fromEntries(rebuildObjects));
//   return resultData;
// }
