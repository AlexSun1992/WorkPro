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

  it("Если historyToggleComponents пустой, то добавляется новый объект", () => {
    const state = {
      historyToggleComponents: [],
      formCollapse: [],
      form: data,
    };
    mutations.toggleComponents(state, {
      fieldId: 1,
      name: "COLLAPSE_DATA",
      value: true,
      components: ["Emptyblock", "SDOCUMENT_UPLOADER"],
    });
    const getForm = getters.getForm(state);

    expect(getForm.length).toBe(15);

    expect(state.historyToggleComponents).toEqual([
      {
        components: ["Emptyblock", "SDOCUMENT_UPLOADER"],
        hide: true,
        name: "COLLAPSE_DATA",
      },
    ]);
  });

  it("Если historyToggleComponents не пустой и приходит объект отличающийся от имеющегося, то добавляется новый объект", () => {
    const state = {
      historyToggleComponents: [
        {
          components: ["Emptyblock", "SDOCUMENT_UPLOADER"],
          hide: true,
          name: "COLLAPSE_DATA",
        },
      ],
      formCollapse: [],
      form: data,
    };
    mutations.toggleComponents(state, {
      fieldId: 1,
      name: "COLLAPSE_DATA1",
      value: true,
      components: ["S_REASON"],
    });
    const getForm = getters.getForm(state);

    expect(getForm.length).toBe(14);

    expect(state.historyToggleComponents).toEqual([
      {
        components: ["Emptyblock", "SDOCUMENT_UPLOADER"],
        hide: true,
        name: "COLLAPSE_DATA",
      },
      {
        components: ["S_REASON"],
        hide: true,
        name: "COLLAPSE_DATA1",
      },
    ]);
  });

  it("Если historyToggleComponents не пустой и добавляем  такой же объект, то он не добавляется ", () => {
    const state = {
      historyToggleComponents: [
        {
          components: ["Emptyblock", "SDOCUMENT_UPLOADER"],
          hide: true,
          name: "COLLAPSE_DATA",
        },
      ],
      formCollapse: [],
      form: data,
    };
    mutations.toggleComponents(state, {
      fieldId: 1,
      name: "COLLAPSE_DATA",
      value: true,
      components: ["Emptyblock", "SDOCUMENT_UPLOADER"],
    });
    const getForm = getters.getForm(state);

    expect(getForm.length).toBe(15);
    expect(state.historyToggleComponents).toEqual([
      {
        components: ["Emptyblock", "SDOCUMENT_UPLOADER"],
        hide: true,
        name: "COLLAPSE_DATA",
      },
    ]);
  });

  it("Если historyToggleComponents не пустой и добавляем  такой же объект, но value изменяется, то value обновится", () => {
    const state = {
      historyToggleComponents: [
        {
          components: ["Emptyblock", "SDOCUMENT_UPLOADER"],
          hide: true,
          name: "COLLAPSE_DATA",
        },
      ],
      formCollapse: [],
      form: data,
    };
    mutations.toggleComponents(state, {
      fieldId: 1,
      name: "COLLAPSE_DATA",
      value: false,
      components: ["Emptyblock", "SDOCUMENT_UPLOADER"],
    });
    const getForm = getters.getForm(state);

    expect(getForm.length).toBe(17);
    expect(state.historyToggleComponents).not.toEqual([
      {
        components: ["Emptyblock", "SDOCUMENT_UPLOADER"],
        hide: true,
        name: "COLLAPSE_DATA",
      },
    ]);
    expect(state.historyToggleComponents).toEqual([
      {
        components: ["Emptyblock", "SDOCUMENT_UPLOADER"],
        hide: false,
        name: "COLLAPSE_DATA",
      },
    ]);
  });

  it("Если historyToggleComponents не пустой и добавляем  такой же объект, но value изменяется у второго объект, то value обновляется только у второго объект", () => {
    const state = {
      historyToggleComponents: [
        {
          components: ["Emptyblock", "SDOCUMENT_UPLOADER"],
          hide: true,
          name: "COLLAPSE_DATA",
        },
        {
          components: ["S_REASON"],
          hide: false,
          name: "COLLAPSE_DATA1",
        },
      ],
      formCollapse: [],
      form: data,
    };
    mutations.toggleComponents(state, {
      fieldId: 1,
      name: "COLLAPSE_DATA1",
      value: true,
      components: ["S_REASON"],
    });
    const getForm = getters.getForm(state);

    expect(getForm.length).toBe(14);

    expect(state.historyToggleComponents).not.toEqual([
      {
        components: ["Emptyblock", "SDOCUMENT_UPLOADER"],
        hide: true,
        name: "COLLAPSE_DATA",
      },
      {
        components: ["S_REASON"],
        hide: false,
        name: "COLLAPSE_DATA1",
      },
    ]);
    expect(state.historyToggleComponents).toEqual([
      {
        components: ["Emptyblock", "SDOCUMENT_UPLOADER"],
        hide: true,
        name: "COLLAPSE_DATA",
      },
      {
        components: ["S_REASON"],
        hide: true,
        name: "COLLAPSE_DATA1",
      },
    ]);
  });

  it("Если formCollapse пустой, то возвращаются данные из form", () => {
    const state = {
      historyToggleComponents: [],
      formCollapse: [],
      form: data,
    };

    const getForm = getters.getForm(state);

    expect(getForm.length).toBe(17);

    expect(getForm).toEqual(data);
  });

  it("Если formCollapse не пустой, то возвращаются данные из formCollapse", () => {
    const state = {
      historyToggleComponents: [],
      formCollapse: [
        {
          label: "Водительское удостоверение",
          type: "string",
          name: "SLICENSE_NUMBER",
        },
      ],
      form: data,
    };
    const getForm = getters.getForm(state);

    expect(getForm.length).toBe(1);

    expect(getForm).toEqual([
      {
        label: "Водительское удостоверение",
        type: "string",
        name: "SLICENSE_NUMBER",
      },
    ]);
  });
});
