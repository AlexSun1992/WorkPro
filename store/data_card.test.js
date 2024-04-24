import { mutations, getters } from "./data_card";

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
});
