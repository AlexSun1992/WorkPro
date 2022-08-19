export async function fetchSuggestions(params) {
  const type = params.suggestionType;
  const key = params.key;
  delete params.suggestionType;
  delete params.key;

  //   if (this.family === "" && this.name === "" && this.patronymic === "") {
  //     this.gender = "UNKNOWN";
  //   }
  //   params.gender = this.gender;
  //   console.log("paams:", params);
  //   console.log("type:", type);
  const response = await fetch(`/suggestions/api/4_1/rs/suggest/${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Token ${key}`,
    },
    body: JSON.stringify(params),
  });
  //   console.log("params:", params);
  const result = await response.json();

  return result.suggestions;
}
