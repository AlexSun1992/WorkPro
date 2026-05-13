import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({});
if (typeof window === "undefined") {
  instance.defaults.baseURL = process.env.MOBILE_URL ?? "https://lk.reso.ru";
}
instance.defaults.headers.common["X-Application"] = "VueJS";

let currentCityPromise = null;
function getCurrentCity() {
  if (currentCityPromise) {
    return currentCityPromise;
  }
  let city;
  let kladr;
  let lat;
  let lon;
  currentCityPromise = new Promise((resolve) => {
    instance
      .get(`/lk/free/v2/data/55/800/0/0`)
      .then((res) => {
        if (res.data[0]._data[0].TOWN) {
          city = res.data[0]._data[0].TOWN.replace(/^г/i, "");
          Cookies.set("location_user", city);
        }
        if (res.data[0]._data[0].KLADR_ID) {
          kladr = res.data[0]._data[0].KLADR_ID;
          Cookies.set("kladr_id", kladr);
        }
        if (res.data[0]._data[0].LAT) {
          lat = res.data[0]._data[0].LAT;
          Cookies.set("lat", lat);
        }
        if (res.data[0]._data[0].LON) {
          lon = res.data[0]._data[0].LON;
          Cookies.set("lon", lon);
        }
        if (!res.data[0]._data[0].TOWN) {
          city = "Москва";
          Cookies.set("location_user", city);
        }
        if (!res.data[0]._data[0].KLADR_ID) {
          kladr = "7700000000000";
          Cookies.set("kladr_id", kladr);
        }
        if (!res.data[0]._data[0].LAT) {
          lat = "55.75396";
        }
        if (!res.data[0]._data[0].LON) {
          lon = "37.620393";
        }
        resolve({ lat, lon, kladr, city });
      })
      .catch((error) => {
        console.log(error);
      });
  });
  return currentCityPromise;
}

export default getCurrentCity;
