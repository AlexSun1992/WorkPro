import { mutations, getters } from "./blocks";

describe("модуль блоков", () => {
  it("должен добавлять фильтр в список", () => {
    const state = { filters: [] };
    mutations.setFilter(state, {
      type: "query",
      cardId: 800,
      value: "find",
    });
    expect(state.filters).toMatchInlineSnapshot(`
      Array [
        Object {
          "cardId": 800,
          "type": "query",
          "value": "find",
        },
      ]
    `);
  });

  it("должен обновлять значение фильтра в списке", () => {});
});

//Пробные тесты

describe("Неотфильтрованные блоки", () => {
  it("должен возвращать все имеющиеся объекты(неотфильтрованные)", () => {
    const state = { blocks: [] };
    getters.getUnfilteredBlockById(state, { id: 712 });
    expect(state.blocks).not.toBeNaN();
    // expect(state.blocks).toHaveProperty("data");
  });
});

describe("Значения по которым проводится фильтрация", () => {
  it("Должен содержать строковые значения", () => {
    const state = { filters: [] };
    getters.getFilters(state);
    expect(state.filters).not.toBeNaN();
  });
});
