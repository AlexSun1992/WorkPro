import axios from "axios";
import dataform from "./dataform";
import {
  dataWithFileParams,
  dataWithoutFileParams,
  dataDoubleTypeWithoutDefaultValue,
  dataDoubleTypeWithDefaultValue,
  dataWithDicParams,
  dataDic,
} from "./dataform.helpers.fixtures";

import { mobile2Service } from "../services/mobile2.services";

const mockAxios = jest.genMockFromModule("axios");

mockAxios.create = jest.fn(() => mockAxios);

jest.mock("axios");

jest.mock("../services/mobile2.services", () => ({
  mobile2Service: jest.fn(() => mockAxios),
}));

describe("dataform converter", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Корректно сохраняет объект в DadataSelect 2", () => {
    const convertedData = dataform.save([
      {
        type: "DadataSelect2",
        name: "field",
        value: { value: "bankname" },
      },
    ]);

    expect(convertedData.field).toBe('{"value":"bankname"}');
  });

  it("Корректно сохраняет строку в DadataSelect 2", () => {
    const convertedData = dataform.save([
      {
        type: "DadataSelect2",
        name: "field",
        value: "bankname",
      },
    ]);

    expect(convertedData.field).toBe("bankname");
  });
  it("Корректно устанавливает значение по умолчанию если присутствуют параметры файлов в _data", async () => {
    const { metaData } = await dataform.form(dataWithFileParams, {
      idItem: 1008,
    });
    expect(metaData.data).toEqual([
      {
        label: "Номер извещения о ДТП",
        value: "1212",
        type: "string",
        id: 1008,
        fieldId: 57470,
        cols: 6,
        colSm: 12,
        colMd: 12,
        isMask: false,
        colLg: 12,
        width: "100%",
        name: "SEDOC_NUMBER",
        cssClass: "",
        webId: "",
        visible: false,
        required: false,
        page: 0,
        mask: undefined,
        readonly: false,
        control: null,
        state: null,
        checked: null,
        error: null,
        helpText:
          "<div>Идентификатор ДТП вида «NXXXXX-XXXXX», можно найти: </br>\n" +
          "На Госуслугах в разделе «Уведомления» найдите актуальное сообщение о регистрации европротокола, содержащее номер ДТП\n" +
          "</br>Если оформляли ДТП в мобильном приложении «Госуслуги Авто», откройте в нём: Профиль > Европротоколы\n" +
          "</div>",
        placeholder: undefined,
        isRelation: false,
        fieldRelation: null,
        isTab: false,
      },
    ]);
  });
  it("Корректно устанавливает значение по умолчанию если отсутствуют параметры файлов в _data", async () => {
    const { metaData } = await dataform.form(dataWithoutFileParams, {
      idItem: 1008,
    });
    expect(metaData.data).toEqual([
      {
        label: "Номер извещения о ДТП",
        value: "1212",
        type: "string",
        id: 1008,
        fieldId: 57470,
        cols: 6,
        colSm: 12,
        colMd: 12,
        isMask: false,
        colLg: 12,
        width: "100%",
        name: "SEDOC_NUMBER",
        cssClass: "",
        webId: "",
        visible: false,
        required: false,
        page: 0,
        mask: undefined,
        readonly: false,
        control: null,
        state: null,
        checked: null,
        error: null,
        helpText:
          "<div>Идентификатор ДТП вида «NXXXXX-XXXXX», можно найти: </br>\n" +
          "На Госуслугах в разделе «Уведомления» найдите актуальное сообщение о регистрации европротокола, содержащее номер ДТП\n" +
          "</br>Если оформляли ДТП в мобильном приложении «Госуслуги Авто», откройте в нём: Профиль > Европротоколы\n" +
          "</div>",
        placeholder: undefined,
        isRelation: false,
        fieldRelation: null,
        isTab: false,
      },
    ]);
  });
  it("Корректно устанавливает значение для типа Double если значение по умолчанию не задано", async () => {
    const { metaData } = await dataform.form(dataDoubleTypeWithoutDefaultValue, {
      idItem: 777,
    });
    expect(metaData.data).toEqual([
      {
        label: "Возраст",
        value: undefined,
        type: "double",
        structType: "long",
        id: 777,
        fieldId: 36356,
        cols: 3,
        colSm: 6,
        colMd: 6,
        isMask: false,
        colLg: 2,
        width: "100%",
        name: "NDR_AGE_1",
        cssClass: "r-h-l",
        webId: "",
        visible: false,
        required: true,
        page: 2,
        mask: undefined,
        readonly: false,
        control: null,
        state: null,
        checked: null,
        error: null,
        helpText: undefined,
        placeholder: undefined,
        isRelation: false,
        fieldRelation: null,
        isTab: true,
      },
    ]);
  });
  it("Корректно устанавливает значение для типа Double если значение по умолчанию  задано", async () => {
    const { metaData } = await dataform.form(dataDoubleTypeWithDefaultValue, {
      idItem: 777,
    });
    expect(metaData.data).toEqual([
      {
        label: "Возраст",
        value: 30,
        type: "double",
        structType: "long",
        id: 777,
        fieldId: 36356,
        cols: 3,
        colSm: 6,
        colMd: 6,
        isMask: false,
        colLg: 2,
        width: "100%",
        name: "NDR_AGE_1",
        cssClass: "r-h-l",
        webId: "",
        visible: false,
        required: true,
        page: 2,
        mask: undefined,
        readonly: false,
        control: null,
        state: true,
        checked: true,
        error: null,
        helpText: undefined,
        placeholder: undefined,
        isRelation: false,
        fieldRelation: null,
        isTab: true,
      },
    ]);
  });
  it("Проверка подстановки idlist в справочник", async () => {
    jest.spyOn(mobile2Service(), "get").mockResolvedValue({
      data: dataDic,
      config: { url: "/lk/main/v2/dic/55/777/IDRISK/2439626501/null/0" },
      status: 200,
    });
    await dataform.form(
      dataWithDicParams,
      {
        idModule: "55",
        idItem: "1012",
        idWizard: "1011",
        idCard: "0",
        idList: "2439626501",
      },
      mockAxios
    );
    expect(mockAxios.get).toHaveBeenCalledWith("/lk/main/v2/dic/55/1012/IDRISK/2439626501/null/0");
  });
  it("Проверка вызова справочника если idlist не задан", async () => {
    jest.spyOn(mobile2Service(), "get").mockResolvedValue({
      data: dataDic,
      config: { url: "/lk/main/v2/dic/55/777/IDRISK/2439626501/null/0" },
      status: 200,
    });
    await dataform.form(
      dataWithDicParams,
      {
        idModule: "55",
        idItem: "1012",
        idWizard: "1011",
        idCard: "0",
      },
      mockAxios
    );
    expect(mockAxios.get).toHaveBeenCalledWith("/lk/main/v2/dic/55/1012/IDRISK/0/null/0");
  });
});
