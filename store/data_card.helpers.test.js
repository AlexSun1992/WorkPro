import { getFieldsValueTypeIsNotUploader } from "./data_card.helpers";
import { rebuildObject } from "./data_card.helpers";
import { convertFieldValuesToJSON } from "./data_card.helpers";
import { getSplicedObjects } from "./data_card.helpers";
import { getFieldsValueTypeUploader } from "./data_card.helpers";
import { restructureData } from "./data_card.helpers";
import { reSet } from "./data_card.helpers";
import { changeObj } from "./data_card.helpers";
import { data } from "./data_card.helpers.fixtures";

const FormData = require("form-data");

describe("Модуль подготовки данных", () => {
  it("получает объекты кроме типа Uploader", () => {
    const TEST_DATA = [...data];
    const arrayOfFieldsWithOutUploader =
      getFieldsValueTypeIsNotUploader(TEST_DATA);
    expect(Array.isArray(arrayOfFieldsWithOutUploader)).toBe(true);
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
    // testSplicedData можно передать в changeObj вместо TEST_DATA;
    //const testSplicedData = getSplicedObjects(TEST_DATA);
    const restructuredData = changeObj(TEST_DATA);
    console.log("restructuredData:", restructuredData);
    expect(typeof restructuredData).toBe("string");
  });

  it("получаем объекты из файла Uploader", () => {
    const TEST_DATA = [...data];
    const body = new FormData();
    const uploaderFieldsValue = getFieldsValueTypeUploader(TEST_DATA);
    expect(Array.isArray(uploaderFieldsValue)).toBe(true);
  });
});
