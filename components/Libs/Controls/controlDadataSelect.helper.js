import axios from "axios";

export async function getSuggestions() {
  const body = {
    query: "авто",
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

  //   const response = await axios(
  //     `https://dadata.reso.ru/api/suggestions/brandmodel`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //       body: JSON.stringify(body),
  //     }
  //   );

  const response = await axios({
    method: "post",
    url: "https://dadata.reso.ru/suggestions/api/4_1/rs/suggest/brandmodel",

    data: body,
  });

  const result = response.data;

  result.suggestions.forEach((item) => {
    group.push(item);
  });

  console.log("group:", group);

  return group;
}
