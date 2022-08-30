const abortControllers = new Map();

export async function fetchSuggestions(params, id) {
  const type = params.suggestionType;
  delete params.suggestionType;

  // console.log("id:", id);
  // console.log("abortControllers", abortControllers);
  const controller = new AbortController();
  console.log("controller", controller);
  // console.log("controllers values:", abortControllers.values());
  // console.log("controllers keys:", abortControllers.keys());
  // console.log("controllers enries:", abortControllers.entries());
  // console.log("abortControllers:", abortControllers);
  // console.log("test:", abortControllers.get(id));

  if (abortControllers.get(id) !== undefined) {
    // console.log("abort", abortControllers.get(id));
    // controller.abort();
    abortControllers.get(id).abort();
    console.log("abort", abortControllers.get(id).signal);
  }

  // for (let amount of abortControllers.entries()) {
  //   if (amount[0] === id) {
  //     console.log("!!!!");
  //     abort.abort();
  //   }
  // }

  // console.log(abortControllers.values());
  // abortControllers.entries().forEach((item) => console.log(item));

  // if (abortControllers.has(id)) {
  //   // debugger;
  //  // abortControllers.get(id)();
  // }

  abortControllers.set(id, controller);
  const response = await fetch(`/suggestions/api/4_1/rs/suggest/${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      signal: controller.signal,
    },
    body: JSON.stringify(params),
  }).finally(() => {
    abortControllers.delete(id);
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

export function fetchPatronymic(input, gender = "") {}
