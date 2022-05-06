import { getFieldsValueTypeIsNotUploader } from "./data_card.helpers";
import { rebuildObject } from "./data_card.helpers";
import { convertFieldValuesToJSON } from "./data_card.helpers";
import { getSplicedObjects } from "./data_card.helpers";
import { getFieldsValueTypeUploader } from "./data_card.helpers";
import { restructureData } from "./data_card.helpers";
import { data } from "./data_card.helpers.fixtures";
const FormData = require("form-data");

describe("Модуль подготовки данных", () => {
  it("получает объекты кроме типа Uploader", () => {
    const TEST_DATA = [...data];
    const arrayOfFieldsWithOut = getFieldsValueTypeIsNotUploader(TEST_DATA);
    expect(Array.isArray(arrayOfFieldsWithOut)).toBe(true);
  });

  it("преобразовывает все объекты массива в JSON", () => {
    const TEST_DATA = [...data];
    const arrayOfJSON = convertFieldValuesToJSON(TEST_DATA);
    expect(Array.isArray(arrayOfJSON)).toBe(true);
  });

  it("готовим массивы для отправки на сервер", () => {
    const TEST_DATA = [...data];
    const rebuildedObjects = rebuildObject(TEST_DATA);
    expect(Array.isArray(rebuildedObjects)).toBe(true);
  });

  it("удаляем ненужные свойства у объектов", () => {
    const TEST_DATA = [...data];
    const objectsReadyForServerTransfer = getSplicedObjects(TEST_DATA);
    expect(Array.isArray(objectsReadyForServerTransfer)).toBe(true);
  });

  it("Преобразованы данные для отправки на сервер", () => {
    const TEST_DATA = [...data];
    const convertedData = restructureData(TEST_DATA);
    console.log("covertedData:", convertedData);
    expect(typeof convertedData).toBe("string");
  });

  it("получаем объекты из файла Uploader", () => {
    const TEST_DATA = [...data];
    const body = new FormData();
    // console.log(body);
    const uploaderFieldsValue = getFieldsValueTypeUploader(TEST_DATA);

    expect(Array.isArray(uploaderFieldsValue)).toBe(true);
  });
});
