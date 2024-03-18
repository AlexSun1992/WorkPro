import dataform from "./dataform";
import {
  dataWithFileParams,
  dataWithoutFileParams,
} from "./dataform.helpers.fixtures";

describe("dataform converter", () => {
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
});
