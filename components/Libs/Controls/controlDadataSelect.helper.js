import axios from "axios";

/**
 * Подсказки Dadata по справочнику brandmodel
 * @param {String} query   Строка для поиска
 * @param {Array} filters  Набор фильтров
 * @returns Результаты поиска
 */
export async function getBrandmodelSuggestions(query, filters) {
  const group = [];

  const response = await axios({
    method: "post",
    url: "/suggestions/api/4_1/rs/suggest/brandmodel",
    headers: { "X-Application": "VueJS" },
    data: { query, filters },
  });

  const result = response.data;

  result.suggestions.forEach((item) => {
    group.push(item);
  });

  return group;
}

export function isFieldFIONotValid(inputValue, regex) {
  return !inputValue.match(regex);
}

export function getQueryParams(queryType, input, gender = null) {
  const genderQuery = gender ? { gender } : {};
  if (queryType.includes("ADDRESS")) {
    return {
      query: "address",
      body: {
        query: input,
      },
    };
  }
  if (queryType.includes("BANK")) {
    return {
      query: "bank",
      body: {
        query: input,
      },
    };
  }
  if (queryType === "SCITY_SETTLEMENT") {
    return {
      query: "address",
      body: {
        query: input,
        from_bound: {
          value: "city",
        },
        to_bound: {
          value: "settlement",
        },
      },
    };
  }
  if (queryType === "SVEHICLE_MODEL" || queryType === "SVEHICLE_MODEL_CASCO") {
    return {
      query: "brandmodel",
      body: {
        query: input,
        filters: [{ car_type: "Л" }, { car_type: "Д" }, { car_type: "МА" }, { car_type: "МЛ" }],
        count: 20,
      },
      id: "brand_model_code",
    };
  }

  if (queryType === "SVEHICLE_MODEL_CASCO") {
    return {
      query: "brandmodel_casco",
      body: {
        query: input,
        filters: [{ car_type: "Л" }, { car_type: "Д" }, { car_type: "МА" }, { car_type: "МЛ" }],
      },
      id: "brand_model_code",
    };
  }
  if (queryType.includes("SECONDNAME")) {
    return {
      query: "fio",
      body: {
        query: input,
        suggestionType: "fio",
        parts: ["SURNAME"],
        ...genderQuery,
      },
    };
  }

  if (queryType.includes("THIRDNAME")) {
    return {
      query: "fio",
      body: {
        query: input,
        suggestionType: "fio",
        parts: ["PATRONYMIC"],
        ...genderQuery,
      },
    };
  }

  if (queryType.includes("FIRSTNAME")) {
    return {
      query: "fio",
      body: {
        query: input,
        suggestionType: "fio",
        parts: ["NAME"],
        ...genderQuery,
      },
    };
  }

  throw new Error(`Неизвестное название поля для компонента ControlDadataSelect.vue: ${queryType}`);
}
