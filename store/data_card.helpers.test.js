import {
  getFieldsValueTypeIsNotUploader,
  getSplicedObjects,
  getFieldsValueTypeUploader,
  changeObj,
  getVisibleStatus,
} from "./data_card.helpers";
import { data, hidedElements, visibleElements } from "./data_card.helpers.fixtures";

describe("Модуль подготовки данных", () => {
  it("Выполняет reverse для видимости элементов", () => {
    const elementVisibilitySAUTO = getVisibleStatus(visibleElements, hidedElements, "SAUTO");

    expect(elementVisibilitySAUTO).toBe(true);

    const elementVisibilitySVEHICLEdATA = getVisibleStatus(visibleElements, hidedElements, "SVEHICLE_DATA");

    expect(elementVisibilitySVEHICLEdATA).toBe(false);
  });
  it("получает объекты кроме типа Uploader", () => {
    const TEST_DATA = [...data];
    const arrayOfFieldsWithOutUploader = getFieldsValueTypeIsNotUploader(TEST_DATA);
    expect(Array.isArray(arrayOfFieldsWithOutUploader)).toBe(true);
  });

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
});
