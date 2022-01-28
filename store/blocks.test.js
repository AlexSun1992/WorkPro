import { mutations } from "./blocks";

describe("модуль блоков", () => {
  it("должен добавлять фильтр в список", () => {
    const state = { filters: [] };
    mutations.setFilter(state, {
      type: "query",
      cardId: 900,
      value: "find",
    });
    expect(state.filters).toMatchInlineSnapshot(`
      Array [
        Object {
          "cardId": 900,
          "type": "query",
          "value": "find",
        },
      ]
    `);
  });

  it("должен обновлять значение фильтра в списке", () => {});
});
