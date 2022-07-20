import axios from "axios";

export async function getSuggestionsWithFilters(body) {
  const group = [];

  const response = await axios({
    method: "post",
    url: "https://dadata.reso.ru/suggestions/api/4_1/rs/suggest/brandmodel",

    data: body,
  });

  const result = response.data;

  result.suggestions.forEach((item) => {
    group.push(item);
  });

  return group;
}
