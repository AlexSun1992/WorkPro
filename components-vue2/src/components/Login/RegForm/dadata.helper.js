export async function fetchSuggestions(params) {
  const type = params.suggestionType;
  const key = params.key;
  delete params.suggestionType;
  delete params.key;

  const response = await fetch(`/suggestions/api/4_1/rs/suggest/${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Token ${key}`,
    },
    body: JSON.stringify(params),
  });

  const result = await response.json();

  return result.suggestions;
}

export function revealGender(name, surname, patronymic) {
  if (name === "" && surname === "" && patronymic === "") {
    return true;
  }
  return false;
}

export function userGender(suggestionsFetched, userSurname) {
  const getGenderFromSurname = suggestionsFetched.find(
    (item) => item.value === userSurname
  );
  return getGenderFromSurname?.data.gender;
}

export function getSuggestions(fetchedSuggestions, suggestions) {
  fetchedSuggestions.forEach((item) => {
    suggestions.push(item);
  });

  const result = suggestions;
  return result;
}

export function isEnoughDataForGenderDefine(
  firstGenderField,
  secondGenderField
) {
  if (firstGenderField === "" && secondGenderField === "") {
    return true;
  }
  return false;
}

export function isFieldFIOValid(inputValue, regex) {
  if (inputValue.match(regex)) {
    return false;
  }
  return true;
}
