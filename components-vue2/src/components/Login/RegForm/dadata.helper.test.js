import { fetchSuggestions } from "./dadata.helper";
import { suggestionsSurnames } from "./dadata.helper.fixtures";
import { paramsSurname } from "./dadata.helper.fixtures";
import { suggestionsNames } from "./dadata.helper.fixtures";
import { paramsName } from "./dadata.helper.fixtures";
import { suggestionsPatronymic } from "./dadata.helper.fixtures";
import { paramsPatronymic } from "./dadata.helper.fixtures";

import { fetch, Response } from "node-fetch";
import { jest } from "@jest/globals";

const unmockedFetch = global.fetch;

beforeAll(() => {
  global.fetch = () =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    });
});

afterAll(() => {
  global.fetch = unmockedFetch;
});

describe("Модуль тестирования подсказок по ФИО daddata", () => {
  it("тестируем асинхронную функцию", async () => {
    const suggestionsDataSurnames = suggestionsSurnames;
    // const paramsFamily = paramsSurname;

    const mockFn = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(suggestionsDataSurnames));

    const result = mockFn();

    expect(result).not.toBe(null);
  });
});
