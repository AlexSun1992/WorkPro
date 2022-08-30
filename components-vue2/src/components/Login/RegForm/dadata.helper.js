const abortControllers = new Map();

export async function fetchSuggestions(params, id) {
  const controller = new AbortController();

  if (abortControllers.get(id) !== undefined) {
    abortControllers.get(id).abort();
  }

  abortControllers.set(id, controller);
  const response = await fetch(`/suggestions/api/4_1/rs/suggest/${type}`, {
    method: "POST",
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
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

export function getSuggestions(fetchedSuggestions, suggestions, fieldContent) {
  if (fieldContent !== "") {
    fetchedSuggestions.forEach((item) => {
      suggestions.push(item);
    });

    const result = suggestions;
    return result;
  }
  return [];
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

export function isFieldFIONotValid(inputValue, regex) {
  if (!inputValue.match(regex)) {
    return true;
  }
  return false;
}

export function getArrayWithClass(array, classText) {
  array.splice(0, array.length);
  array.push(classText);
  return array;
}

export function fetchPatronymic(input) {
  const suggestionType = "fio";

  const params = {
    query: input,
    suggestionType,
    parts: ["PATRONYMIC"],
  };

  return input;
}
