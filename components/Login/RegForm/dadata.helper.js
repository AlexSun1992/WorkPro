const abortControllers = new Map();

export async function getSuggestionsData(params, type) {
  const controller = new AbortController();

  const key = params.parts ? params.parts[0] : params.suggestionType;

  if (params.parts === undefined) {
    if (abortControllers.get(key) !== undefined) {
      abortControllers.get(key).abort();
    }
    abortControllers.set(key, controller);
  }

  if (params.parts) {
    if (abortControllers.get(key) !== undefined) {
      abortControllers.get(key).abort();
    }

    abortControllers.set(key, controller);
  }
  const testResult = await fetch(`/api/suggestions/${type}`, {
    method: "POST",
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(params),
  });

  const dataSuggestions = await testResult.json();

  return dataSuggestions.suggestions;
}

export async function fetchEmail(input) {
  try {
    const params = {
      query: `${input}`,
      suggestionType: "email",
    };
    const type = params.suggestionType;
    const getData = await getSuggestionsData(params, type);
    return getData;
  } catch (e) {
    console.log("e:", e);
  }
  return [];
}

export async function fetchPatronymic(input, gender, isFieldContentNotValid) {
  if (isFieldContentNotValid === false) {
    try {
      const params = {
        gender: `${gender}`,
        query: `${input}`,
        suggestionType: "fio",
        parts: ["PATRONYMIC"],
      };

      const type = params.suggestionType;

      const getData = await getSuggestionsData(params, type);
      return getData;
    } catch (e) {
      if (e === "DOMException: The user aborted a request.") {
        return null;
      }
    }
  }
  return [];
}

export async function fetchSurname(input, gender, isFieldContentNotValid) {
  if (isFieldContentNotValid === false) {
    try {
      const params = {
        gender: `${gender}`,
        query: `${input}`,
        suggestionType: "fio",
        parts: ["SURNAME"],
      };

      const type = params.suggestionType;

      const getData = await getSuggestionsData(params, type);
      return getData;
    } catch (e) {
      if (e === "DOMException: The user aborted a request.") {
        return null;
      }
    }
  }
  return [];
}
//

export async function fetchName(input, gender, isFieldContentNotValid) {
  if (isFieldContentNotValid === false) {
    try {
      const params = {
        gender: `${gender}`,
        query: `${input}`,
        suggestionType: "fio",
        parts: ["NAME"],
      };

      const type = params.suggestionType;

      const getData = await getSuggestionsData(params, type);
      return getData;
    } catch (e) {
      if (e === "DOMException: The user aborted a request.") {
        return null;
      }
    }
  }
  return [];
}

export function isGenderReveal(name, surname, patronymic) {
  if (name === "" && surname === "" && patronymic === "") {
    return false;
  }
  return true;
}

export function userGender(suggestionsFetched, userSurname) {
  const getGenderFromSurname = suggestionsFetched.find((item) => item.value === userSurname);
  return getGenderFromSurname?.data.gender;
}

export function getSuggestions(fetchedSuggestions, suggestions, fieldContent) {
  if (fetchedSuggestions === null) {
    return null;
  }
  if (fieldContent !== "") {
    fetchedSuggestions.forEach((item) => {
      suggestions.push(item);
    });
    const result = suggestions;
    return result;
  }
  return [];
}

export function isEnoughDataForGenderDefine(firstGenderField, secondGenderField) {
  if (firstGenderField === "" && secondGenderField === "") {
    return false;
  }
  return true;
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

export function isEmailRight(input) {
  const regex =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
  return regex.test(input);
}
