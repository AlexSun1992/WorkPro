import { mutations, getters } from "./data_card";
import { data } from "./data_card.helpers.fixtures";

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
});
