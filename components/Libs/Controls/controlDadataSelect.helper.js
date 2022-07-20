import axios from "axios";

export async function getSuggestionsWithFilters() {
  const body = {
    query: "автобус",
    filters: [
      {
        car_type: "Л",
      },
      {
        car_type: "Д",
      },
      {
        car_type: "МА",
      },
      {
        car_type: "МЛ",
      },
    ],
  };

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

export async function getSuggestionsWithOutFilters() {
  const body = {
    query: "автобус",
  };

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
