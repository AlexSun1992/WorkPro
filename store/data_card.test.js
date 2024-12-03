import { mutations, getters } from "./data_card";
import { data, form } from "./data_card.helpers.fixtures";

describe("модуль data_card actions", () => {
  const actionId = 12345;

  it("должен не содержать признака выполнения действия", () => {
    const state = { fetchingActions: [] };

    expect(getters.isFetchingAction(state)(actionId)).toBe(false);
  });

  it("должен добавлять признак выполнения действия", () => {
    const state = { fetchingActions: [] };

    mutations.setFetchingAction(state, { actionId, isFetching: true });

    expect(getters.isFetchingAction(state)(actionId)).toBe(true);
  });

  it("должен удалять признак выполнения действия", () => {
    const state = { fetchingActions: [actionId] };

    mutations.setFetchingAction(state, { actionId, isFetching: true });
    mutations.setFetchingAction(state, { actionId, isFetching: false });

    expect(getters.isFetchingAction(state)(actionId)).toBe(false);
  });

  it("должен вычислять actionParams простые значения", () => {
    const params = getters.getActionParams({
      actionParams: [
        {
          label: "Полис",
          name: "FKIDPOLICY",
          fromDataCard: true,
        },
      ],
      form: [
        {
          value: "Полис 1",
          name: "FKIDPOLICY",
        },
      ],
    });

    expect(params[0].value).toBe("Полис 1");
  });

  it("должен вычислять actionParams значения объекта в виде JSON", () => {
    const params = getters.getActionParams({
      actionParams: [
        {
          label: "Полис",
          name: "FKIDPOLICY",
          fromDataCard: true,
        },
      ],
      form: [
        {
          value: {
            SNAME: "Полис 1",
            ID: 1,
          },
          name: "FKIDPOLICY",
        },
      ],
    });

    expect(params[0].value).toBe('{"SNAME":"Полис 1","ID":1}');
  });

  it("Не вычислит поле так как оно не указано", () => {
    const getDataFieldsByNames = getters.getDataFieldsByNames({
      form: data,
    });
    const dataFieldsByNames = getDataFieldsByNames([]);
    expect(dataFieldsByNames).toEqual([]);
  });

  it("Не вычислит поле так как его не существует", () => {
    const getDataFieldsByNames = getters.getDataFieldsByNames({
      form: data,
    });
    expect(() => getDataFieldsByNames(["ABCDE", "IDCOUNTRY"])).toThrow(
      `Связанное поле не найдено "ABCDE"`
    );
  });

  it("Не вычислит поле так как его не существует", () => {
    const getDataFieldsByNames = getters.getDataFieldsByNames({
      form: data,
    });
    expect(() => getDataFieldsByNames(["ABCDE"])).toThrow(
      `Связанное поле не найдено "ABCDE"`
    );
  });

  it("Вычислит  поле так как оно существует", () => {
    const getDataFieldsByNames = getters.getDataFieldsByNames({
      form: data,
    });
    const dataFieldsByNames = getDataFieldsByNames(["IDCOUNTRY"]);
    expect(dataFieldsByNames).toEqual([
      {
        checked: null,
        colLg: 12,
        colMd: 12,
        colSm: 12,
        cols: 6,
        control: null,
        cssClass: "",
        dic: "IDCOUNTRY",
        error: null,
        fieldId: 39199,
        fieldRelation: null,
        id: "912",
        isRelation: false,
        isTab: true,
        label: "Страна выдачи документа",
        name: "FKIDCOUNTRY",
        options: null,
        page: 0,
        readonly: false,
        required: false,
        state: null,
        type: "enum",
        value: {},
        visible: true,
        width: "100%",
      },
    ]);
  });

  it("Вычислит  поля так как они существуют", () => {
    const getDataFieldsByNames = getters.getDataFieldsByNames({
      form: data,
    });
    const dataFieldsByNames = getDataFieldsByNames(["IDCOUNTRY", "IDDOCTYPE"]);
    expect(dataFieldsByNames).toEqual([
      {
        checked: null,
        colLg: 12,
        colMd: 12,
        colSm: 12,
        cols: 6,
        control: null,
        cssClass: "",
        dic: "IDCOUNTRY",
        error: null,
        fieldId: 39199,
        fieldRelation: null,
        id: "912",
        isRelation: false,
        isTab: true,
        label: "Страна выдачи документа",
        name: "FKIDCOUNTRY",
        options: null,
        page: 0,
        readonly: false,
        required: false,
        state: null,
        type: "enum",
        value: {},
        visible: true,
        width: "100%",
      },
      {
        checked: null,
        colLg: 12,
        colMd: 12,
        colSm: 12,
        cols: 6,
        control: null,
        cssClass: "",
        error: null,
        fieldId: 39200,
        fieldRelation: null,
        id: "912",
        isRelation: false,
        isTab: true,
        label: "Документ",
        name: "FKIDDOCTYPE",
        page: 0,
        readonly: false,
        required: false,
        state: null,
        type: "string",
        visible: true,
        width: "100%",
      },
    ]);
  });

  it("visible: true , если передается в аргументах visible: true", () => {
    const copyForm = JSON.parse(JSON.stringify(form));
    const state = {
      form: copyForm,
    };
    mutations.toggleComponents(state, {
      fieldId: 1,
      name: "COLLAPSE_DATA",
      value: ["Emptyblock", "SDOCUMENT_UPLOADER"],
      visible: true,
    });
    const getForm = getters.getForm(state);

    expect(getForm).toEqual([
      {
        type: "label",
        fieldId: 39204,
        name: "Emptyblock",
        visible: false,
      },
      {
        type: "label",
        fieldId: 39204,
        name: "SDOCUMENT_UPLOADER",
        visible: false,
      },
      {
        type: "label",
        fieldId: 39204,
        name: "UPLOADER",
        visible: true,
      },
    ]);
  });

  it("visible: false только в тех компонентах, которые указаны в value", () => {
    const copyForm = JSON.parse(JSON.stringify(form));
    const state = {
      form: copyForm,
    };
    mutations.toggleComponents(state, {
      fieldId: 1,
      name: "COLLAPSE_DATA",
      value: ["Emptyblock", "SDOCUMENT_UPLOADER"],
      visible: false,
    });
    const getForm = getters.getForm(state);

    expect(getForm).toEqual([
      {
        type: "label",
        fieldId: 39204,
        name: "Emptyblock",
        visible: false,
      },
      {
        type: "label",
        fieldId: 39204,
        name: "SDOCUMENT_UPLOADER",
        visible: false,
      },
      {
        type: "label",
        fieldId: 39204,
        name: "UPLOADER",
        visible: true,
      },
    ]);
  });

  it("Подключено 2 компоненто, сначала данные иеняются на false у компонентов которые переданы в value из 1компонента, а потом из другого", () => {
    const copyForm = JSON.parse(JSON.stringify(form));
    const state = {
      form: copyForm,
    };
    mutations.toggleComponents(state, {
      fieldId: 1,
      name: "COLLAPSE_DATA",
      value: ["Emptyblock", "SDOCUMENT_UPLOADER"],
      visible: false,
    });
    let getForm = getters.getForm(state);

    expect(getForm).toEqual([
      {
        type: "label",
        fieldId: 39204,
        name: "Emptyblock",
        visible: false,
      },
      {
        type: "label",
        fieldId: 39204,
        name: "SDOCUMENT_UPLOADER",
        visible: false,
      },
      {
        type: "label",
        fieldId: 39204,
        name: "UPLOADER",
        visible: true,
      },
    ]);
    mutations.toggleComponents(state, {
      fieldId: 2,
      name: "COLLAPSE_DATA2",
      value: ["UPLOADER"],
      visible: false,
    });
    getForm = getters.getForm(state);

    expect(getForm).toEqual([
      {
        type: "label",
        fieldId: 39204,
        name: "Emptyblock",
        visible: false,
      },
      {
        type: "label",
        fieldId: 39204,
        name: "SDOCUMENT_UPLOADER",
        visible: false,
      },
      {
        type: "label",
        fieldId: 39204,
        name: "UPLOADER",
        visible: false,
      },
    ]);
  });
});
