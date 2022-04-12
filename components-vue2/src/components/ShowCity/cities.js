/**
 * 
 * !!!!!!!!!!!!!!!Не удалять эти комментарии!!!!!!!!!!!!!!!!
 * 
 * const names = [
  "Волгоград",
  "Краснодар",
  "Воронеж",
  "Санкт-Петербург",
  "Ростов-на-Дону",
  "Екатеринбург",
  "Нижний Новгород",
  "Уфа",
  "Казань",
  "Пермь",
  "Новосибирск",
  "Челябинск",
  "Самара",
  "Омск",
];

const requests = names.map((city) =>
  fetch("suggestions/api/4_1/rs/suggest/address", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ query: city, count: 1 }),
  })
);

Promise.all(requests)
  .then((responses) => responses)
  .then((responses) => Promise.all(responses.map((r) => r.json())))
  .then((result) => {
    const citiesArr = [];
    result.forEach((item, index) => {
      citiesArr.push({
        id: index + 2,
        kladr_id: item.suggestions[0].data.kladr_id,
        text: item.suggestions[0].data.city,
        lon: item.suggestions[0].data.geo_lon,
        lat: item.suggestions[0].data.geo_lat,
      });
    });
    console.log(JSON.stringify(citiesArr));
  });
 */

const cities = [
  {
    id: 2,
    kladr_id: "3400000100000",
    text: "Волгоград",
    lon: "44.5170339",
    lat: "48.7070042",
  },
  {
    id: 3,
    kladr_id: "2300000100000",
    text: "Краснодар",
    lon: "38.9759647",
    lat: "45.0401604",
  },
  {
    id: 4,
    kladr_id: "3600000100000",
    text: "Воронеж",
    lon: "39.1969229",
    lat: "51.6593332",
  },
  {
    id: 5,
    kladr_id: "7800000000000",
    text: "Санкт-Петербург",
    lon: "30.3159004",
    lat: "59.9391313",
  },
  {
    id: 6,
    kladr_id: "6100000100000",
    text: "Ростов-на-Дону",
    lon: "39.718803",
    lat: "47.2224566",
  },
  {
    id: 7,
    kladr_id: "6600000100000",
    text: "Екатеринбург",
    lon: "60.6054911",
    lat: "56.8385216",
  },
  {
    id: 8,
    kladr_id: "5200000100000",
    text: "Нижний Новгород",
    lon: "44.0053913",
    lat: "56.3240627",
  },
  {
    id: 9,
    kladr_id: "0200000100000",
    text: "Уфа",
    lon: "55.9578468",
    lat: "54.734944",
  },
  {
    id: 10,
    kladr_id: "1600000100000",
    text: "Казань",
    lon: "49.1114975",
    lat: "55.7943584",
  },
  {
    id: 11,
    kladr_id: "5900000100000",
    text: "Пермь",
    lon: "56.2342034",
    lat: "58.0102583",
  },
  {
    id: 12,
    kladr_id: "5400000100000",
    text: "Новосибирск",
    lon: "82.9211489",
    lat: "55.028191",
  },
  {
    id: 13,
    kladr_id: "7400000100000",
    text: "Челябинск",
    lon: "61.4008078",
    lat: "55.1602624",
  },
  {
    id: 14,
    kladr_id: "6300000100000",
    text: "Самара",
    lon: "50.1069518",
    lat: "53.1950306",
  },
  {
    id: 15,
    kladr_id: "5500000100000",
    text: "Омск",
    lon: "73.3674517",
    lat: "54.9848566",
  },
  {
    id: 16,
    kladr_id: "2500000100000",
    text: "Владивосток",
    lon: "131.882421",
    lat: "43.116391",
  },
];

export default cities;
