// import axios from "axios";
import { $axios } from "@/plugins/axios";
/**
 * Подсказки Dadata по справочнику brandmodel
 * @param {String} query   Строка для поиска
 * @param {Array} filters  Набор фильтров
 * @returns Результаты поиска
 */
export async function getBrandmodelSuggestions(query, filters) {
  const group = [];

  const response = await this.$axios.post({
    url: "https://dadata.reso.ru/suggestions/api/4_1/rs/suggest/brandmodel",

    data: { query, filters },
  });

  const result = response.data;

  result.suggestions.forEach((item) => {
    group.push(item);
  });

  return group;
}
