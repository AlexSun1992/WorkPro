import { getFieldsValueTypeIsNotUploader } from "./data_card.helpers";
//import { convertFieldValuesToJSON } from "./data_card.helpers";
import { getSplicedObjects } from "./data_card.helpers";
import { getFieldsValueTypeUploader } from "./data_card.helpers";
// import { preparing } from "./data_card.helpers";
import { changeObj } from "./data_card.helpers";
import { data } from "./data_card.helpers.fixtures";
import { testData } from "./data_card.helpers.fixtures";
// import {copyObject} from "./data_card.helpers"

describe("Модуль подготовки данных", () => {
  it("получает объекты кроме типа Uploader", () => {
    const TEST_DATA = [...data];
    const arrayOfFieldsWithOutUploader =
      getFieldsValueTypeIsNotUploader(TEST_DATA);
    expect(Array.isArray(arrayOfFieldsWithOutUploader)).toBe(true);
  });

  // it("преобразовывает все объекты массива в JSON", () => {
  //   const TEST_DATA = [...data];
  //   const arrayOfJSON = convertFieldValuesToJSON(TEST_DATA);
  //   // console.log("arrayOfJSON:", arrayOfJSON);
  //   expect(Array.isArray(arrayOfJSON)).toBe(true);
  // });

  it("удаляем ненужные свойства у объектов", () => {
    const TEST_DATA = [...data];
    const objectsReadyForServerTransfer = getSplicedObjects(TEST_DATA);
    expect(Array.isArray(objectsReadyForServerTransfer)).toBe(true);
  });

  it("Преобразованы данные для отправки на сервер", () => {
    const TEST_DATA = [...data];
    const restructuredData = changeObj(TEST_DATA);
    expect(typeof restructuredData).toBe("string");
  });

  it("получаем объекты из файла Uploader", () => {
    const TEST_DATA = [...data];
    const uploaderFieldsValue = getFieldsValueTypeUploader(TEST_DATA);
    expect(Array.isArray(uploaderFieldsValue)).toBe(true);
  });

  it("готовим данные для отправки на сервер", () => {
    const getFilesTypeBlob = preparing(testData);
    expect(typeof getFilesTypeBlob === "object").toBe(true);
  });
  it();
});
