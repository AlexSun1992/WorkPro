import axios from "axios";

/**
 * Подсказки Dadata по справочнику brandmodel
 * @param {String} query   Строка для поиска
 * @param {Array} filters  Набор фильтров
 * @returns Результаты поиска
 */
export async function getBrandmodelSuggestions(query, filters) {
  const group = [];

  const response = await axios({
    method: "post",
    url: "/suggestions/api/4_1/rs/suggest/brandmodel",
    headers: { "X-Application": "VueJS" },
    data: { query, filters },
  });

  const result = response.data;

  result.suggestions.forEach((item) => {
    group.push(item);
  });

  return group;
}

export function isFieldFIONotValid(inputValue, regex) {
  return !inputValue.match(regex);
}
