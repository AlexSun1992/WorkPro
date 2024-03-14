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
});
