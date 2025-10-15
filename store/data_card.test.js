import { mutations, getters, actions } from "./data_card";
import { data, form } from "./data_card.helpers.fixtures";

const flatmenuFx = [
  {
    ACTIONSCUR: [
      {
        ID: 47421,
        REL: "9D14444CD9E441384E330F2E4F31AA45",
        SNAME: "Оставить заявку",
      },
      {
        ID: 47392,
        REL: "318927DF17971A046F9DE1ABB4FE4C7D",
        SNAME: "Выполнить предварительный расчет",
      },
    ],
  },
];

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
    expect(() => getDataFieldsByNames(["ABCDE", "IDCOUNTRY"])).toThrow(`Связанное поле не найдено "ABCDE"`);
  });

  it("Не вычислит поле так как его не существует", () => {
    const getDataFieldsByNames = getters.getDataFieldsByNames({
      form: data,
    });
    expect(() => getDataFieldsByNames(["ABCDE"])).toThrow(`Связанное поле не найдено "ABCDE"`);
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

  it("Подключено 2 компонента, сначала данные иеняются на false у компонентов которые переданы в value из 1компонента, а потом из другого", () => {
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

  it("Если связь между двумя компонентами CustomCombobox, то управляем видимостью полей", () => {
    const state = {
      form: [
        {
          checked: null,
          fieldId: 63961,
          fieldRelation: "IDFRAN",
          id: "1070",
          isLoading: false,
          isMask: false,
          isRelation: true,
          isTab: true,
          name: "NCOST",
          options: [{ ID: 155275, SNAME: 155275, text: "155275", value: 155275 }],
          page: 2,
          readonly: false,
          required: false,
          state: null,
          type: "searchSelect",
          visible: true,
          webId: "",
        },
        {
          fieldId: 64200,
          fieldRelation: null,
          id: "1070",
          label: "Размер франшизы",
          name: "IDFRAN",
          placeholder: "руб.",
          readonly: false,
          required: false,
          state: null,
          structType: "double",
          type: "searchSelect",
          value: 6,
          visible: true,
          options: [
            { ID: 1, NFRANCHISE: 0, text: "0", value: 1 },
            { ID: 2, NFRANCHISE: 3000, text: "3000", value: 2 },
          ],
        },
      ],
    };

    expect(state.form[0].visible).toBe(true);
    expect(state.form[0].visible).not.toBe(false);

    mutations.setValueSearchSelect(state, {
      fieldId: 64200,
      fieldRelation: null,
      id: "1070",
      label: "Размер франшизы",
      name: "IDFRAN",
      placeholder: "руб.",
      readonly: false,
      required: false,
      state: null,
      structType: "double",
      type: "searchSelect",
      value: 6,
      visible: true,
      options: [
        { ID: 1, NFRANCHISE: 0, text: "0", value: 1 },
        { ID: 2, NFRANCHISE: 3000, text: "3000", value: 2 },
      ],
    });

    expect(state.form[0].visible).toBe(false);
    expect(state.form[0].visible).not.toBe(true);
  });

  it("Если связь между двумя компонентами CustomCombobox и каким-то другим компонентом, то не управляем видимостью компонентов", () => {
    const state = {
      form: [
        {
          checked: null,
          fieldId: 63961,
          fieldRelation: "IDFRAN",
          id: "1070",
          isLoading: false,
          isMask: false,
          isRelation: true,
          isTab: true,
          name: "NCOST",
          options: [{ ID: 155275, SNAME: 155275, text: "155275", value: 155275 }],
          page: 2,
          readonly: false,
          required: false,
          state: null,
          type: "DynamicDepend",
          visible: true,
          webId: "",
        },
        {
          fieldId: 64200,
          fieldRelation: null,
          id: "1070",
          label: "Размер франшизы",
          name: "IDFRAN",
          placeholder: "руб.",
          readonly: false,
          required: false,
          state: null,
          structType: "double",
          type: "searchSelect",
          value: 6,
          visible: true,
          options: [
            { ID: 1, NFRANCHISE: 0, text: "0", value: 1 },
            { ID: 2, NFRANCHISE: 3000, text: "3000", value: 2 },
          ],
        },
      ],
    };

    expect(state.form[0].visible).toBe(true);
    expect(state.form[0].visible).not.toBe(false);

    mutations.setValueSearchSelect(state, {
      fieldId: 64200,
      fieldRelation: null,
      id: "1070",
      label: "Размер франшизы",
      name: "IDFRAN",
      placeholder: "руб.",
      readonly: false,
      required: false,
      state: null,
      structType: "double",
      type: "searchSelect",
      value: 6,
      visible: true,
      options: [
        { ID: 1, NFRANCHISE: 0, text: "0", value: 1 },
        { ID: 2, NFRANCHISE: 3000, text: "3000", value: 2 },
      ],
    });

    expect(state.form[0].visible).toBe(true);
    expect(state.form[0].visible).not.toBe(false);
  });

  it("Отправляются нужные данные", async () => {
    const state = {
      form: [
        {
          fieldId: 63961,
          type: "DynamicDepend",
          value: null,
        },
        {
          fieldId: 64200,
          type: "searchSelect",
          value: 6,
        },
      ],
    };

    const getters = {
      getDataFieldsRelationsByFieldId: jest.fn().mockReturnValue([{ fieldId: 63961, type: "DynamicDepend" }]),
    };

    const commit = jest.fn();
    const dispatch = jest.fn();

    const context = { state, getters, commit, dispatch };

    const data = { fieldId: 64200, value: 2 };

    await actions.setActionFormField(context, data);

    expect(getters.getDataFieldsRelationsByFieldId).toHaveBeenCalledWith(64200);
    expect(getters.getDataFieldsRelationsByFieldId.length).toBe(0);
    expect(dispatch).toHaveBeenCalledWith("setOptionsField", {
      data,
      fields: { fields: [{ fieldId: 63961, type: "DynamicDepend" }] },
    });
  });
});

describe("Store data_card mutations", () => {
  test("Clear cache", () => {
    const state = { dictionaries: [{}] };

    mutations.clearDictionariesUrls(state);

    expect(state.dictionaries).toHaveLength(0);
  });
});
describe("actions.maybeExecuteAction (без moduleGetters)", () => {
  const makeCtx = ({
    actionId = null,
    idCard = 101,
    idRel = 202,
    formBody = form, // фикстура формы
    flatmenu = [], // rootGetters['menu/flatmenu']
  } = {}) => {
    const state = { actionId };

    const getters = {
      getFormParams: { idCard, idRel },
      getForm: formBody,
    };

    const rootGetters = { "menu/flatmenu": flatmenu };
    const dispatch = jest.fn().mockResolvedValue("OK");
    return { state, getters, rootGetters, dispatch };
  };

  test("ничего не делает, если actionId отсутствует", async () => {
    const ctx = makeCtx({ actionId: null, flatmenu: flatmenuFx });
    await actions.maybeExecuteAction(ctx);
    expect(ctx.dispatch).not.toHaveBeenCalled();
  });

  test("ничего не делает, если экшн с таким ID не найден", async () => {
    const ctx = makeCtx({ actionId: 99999, flatmenu: flatmenuFx });
    await actions.maybeExecuteAction(ctx);
    expect(ctx.dispatch).not.toHaveBeenCalledWith("executeAction", expect.anything());
  });

  test("диспатчит executeAction с корректным payload, если экшн найден (ID 47392)", async () => {
    const actionId = 47392;
    const rel = "318927DF17971A046F9DE1ABB4FE4C7D";
    const idCard = 12345;
    const idRel = 67890;

    const ctx = makeCtx({
      actionId,
      idCard,
      idRel,
      flatmenu: flatmenuFx,
    });

    await actions.maybeExecuteAction(ctx);

    expect(ctx.dispatch).toHaveBeenCalledTimes(1);
    expect(ctx.dispatch).toHaveBeenCalledWith("executeAction", {
      actionId,
      relActionId: rel,
      relId: idRel,
      rowId: idCard,
      body: form, // значение из getters.getForm
    });
  });
});
