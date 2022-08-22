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

export function createParamsForRequest(
  inputQuery,
  name,
  surname,
  patronimyc,
  gender
) {
  const API_KEY = "7a6080c3383b4dc69e786e1cd5c88366ab58a14c";
  let suggestionType = "fio";
  let query;

  const params = {
    query: query,
    suggestionType,
    key: API_KEY,
  };
  if (inputQuery === "patronymic") {
    params.query = patronimyc;
    params.parts = ["PATRONYMIC"];
    params.gender = gender;
  } else if (inputQuery === "surname") {
    params.query = surname;
    params.parts = ["SURNAME"];
    params.gender = gender;
  } else if (inputQuery === "name") {
    params.query = name;
    params.parts = ["NAME"];
    params.gender = gender;
  }
  return params;
}

export async function getSuggestions(
  queryParam,
  suggestionsHub,
  currentSuggestions,
  family,
  name,
  patronymic
) {
  if (queryParam === "surname" && family !== false) {
    currentSuggestions.length = 0;
    await suggestionsHub.forEach((item) => {
      currentSuggestions.push(item.data.surname);
    });
  } else if (queryParam === "name" && name !== false) {
    currentSuggestions.length = 0;
    await suggestionsHub.forEach((item) => {
      currentSuggestions.push(item.data.name);
    });
  } else if (queryParam === "patronymic" && patronymic !== false) {
    currentSuggestions.length = 0;
    await suggestionsHub.forEach((item) => {
      currentSuggestions.push(item.data.patronymic);
    });
  }
  return currentSuggestions;
}

export function revealGender(name, surname, patronymic) {
  if (name === "" && surname === "" && patronymic === "") {
    return false;
  }
  return true;
}

export function userSurnameGender(suggestionsFetched, userSurname) {
  const getGenderFromSurname = suggestionsFetched.find(
    (item) => item.value === userSurname
  );
  return getGenderFromSurname?.data.gender;
}

export function userNameGender(suggestionsFetched, userName) {
  const getGenderFromName = suggestionsFetched.find(
    (item) => item.value === userName
  );
  return getGenderFromName?.data.gender;
}

export function userPatronymicGender(suggestionsFetched, patronimyc) {
  const getGenderFromPatronimyc = suggestionsFetched.find(
    (item) => item.value === patronimyc
  );
  return getGenderFromPatronimyc?.data.gender;
}
