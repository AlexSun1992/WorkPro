import Cookies from "js-cookie";
import { TOKEN_NAME } from "@/components/EventHandler/helpers";

async function logEvent(object) {
  try {
    let formName;
    let calculateEtape = 0;
    const generalObject = createGeneralObject();
    const objectDataArray = [];

    if (object && typeof object === "object") {
      if (Array.isArray(object)) {
        object = object.filter((obj) => obj !== undefined);
        for (const obj of object) {
          objectDataArray.push(createObjectData(obj));
        }
      } else {
        objectDataArray.push(createObjectData(object));
      }
    }

    if (objectDataArray.length === 1) {
      if (objectDataArray[0].idEventType === 1001) {
        calculateEtape++;
      }
    }

    function getCookie(name) {
      const nameEQ = `${name}=`;
      const cookieList = document.cookie.split(";");

      for (let i = 0; i < cookieList.length; i++) {
        let cookie = cookieList[i];

        while (cookie.charAt(0) === " ") cookie = cookie.substring(1, cookie.length);

        if (cookie.indexOf(nameEQ) === 0) {
          return cookie.substring(nameEQ.length, cookie.length);
        }
      }
      return null;
    }

    function getUtm() {
      const objectData = {};
      const hashQuery = window.location.hash.split("?")[1];
      const w_search = hashQuery ?? window.location.search.replace("?", "");

      if (w_search !== "") {
        getParams(w_search);
      }

      function getParams(w_data) {
        const props = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
        const params = w_data.split("&").reduce((p, e) => {
          const a = e.split("=");

          p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
          return p;
        }, {});

        props.forEach((key) => {
          if (params[key] !== undefined) {
            objectData[key] = params[key];
          }
        });
      }
      return objectData;
    }

    function getDeviceType() {
      const userAgent = window.navigator.userAgent.toLowerCase();

      function find(needle) {
        return userAgent.indexOf(needle) !== -1;
      }

      const windows = find("windows");
      const windowsPhone = windows && find("phone");
      const windowsTablet = windows && find("touch") && !windowsPhone;

      const android = !windows && find("android");
      const androidPhone = android && find("mobile");
      const androidTablet = android && !find("mobile");

      const iphone = !windows && find("iphone");
      const ipod = find("ipod");
      const ipad = find("ipad") || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); // ipad or iPadOS13Up

      const blackberry = find("blackberry") || find("bb10");
      const blackberryPhone = blackberry && !find("tablet");
      const blackberryTablet = blackberry && find("tablet");

      const fxos = (find("(mobile") || find("(tablet")) && find(" rv:");
      const fxosPhone = fxos && find("mobile");
      const fxosTablet = fxos && find("tablet");

      const meego = find("meego");

      const tablet = ipad || androidTablet || blackberryTablet || windowsTablet || fxosTablet;
      const mobile = androidPhone || iphone || ipod || windowsPhone || blackberryPhone || fxosPhone || meego;
      const desktop = !tablet && !mobile;

      return {
        windows,
        windowsPhone,
        windowsTablet,
        android,
        androidPhone,
        androidTablet,
        iphone,
        ipod,
        ipad,
        blackberry,
        blackberryPhone,
        blackberryTablet,
        fxos,
        fxosPhone,
        fxosTablet,
        meego,
        tablet,
        mobile,
        desktop,
      };
    }
    function createObjectData(object) {
      const objectData = {};

      formName = object.formName;
      objectData.controlName = object.controlName;
      objectData.controlValue = object.controlValue;
      objectData.idEventType = object.idEventType;
      objectData.message = object.message;

      objectData.idCalc = object.idCalc;
      objectData.idPolicy = object.idPolicy;
      objectData.idPholder = object.idPholder;

      objectData.timeUser = object.timeUser;

      return objectData;
    }

    function createGeneralObject() {
      const objectData = {};
      const types = { desktop: 1, iphone: 2, androidPhone: 3, tablet: 5, default: 9 };

      try {
        if (getCookie("_ym_uid") !== undefined) {
          objectData.yandexId = getCookie("_ym_uid");
        }
      } catch (e) {
        console.error(e);
      }

      const deviceType = getDeviceType();

      objectData.idDevice = types.default;

      for (const key in types) {
        if (deviceType[key]) {
          objectData.idDevice = types[key];

          break;
        }
      }

      const [firstElReferer] = document.referrer.split("?");

      objectData.referer = firstElReferer;

      const utm = getUtm();
      objectData.utm_source = utm.utm_source;
      objectData.utm_medium = utm.utm_medium;
      objectData.utm_campaign = utm.utm_campaign;
      objectData.utm_content = utm.utm_content;
      objectData.utm_term = utm.utm_term;

      objectData.etape = calculateEtape;

      try {
        objectData.ipUser = document.querySelector("input[name=user_ip]")?.value;
        objectData.idSession = document.querySelector("input[name=web_session]")?.value.toLowerCase();
      } catch (e) {
        console.error(e);
      }

      return objectData;
    }

    if (objectDataArray.length > 0) {
      generalObject.formName = formName;
      let urlApiLog = "/am/free/v2/lk/log";
      const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Application": "VueJS",
        },
        body: JSON.stringify({ ...generalObject, ...object }),
      };

      const token = Cookies.get(TOKEN_NAME);
      const isAuthorised = token && token.length > 10;

      if (isAuthorised) {
        urlApiLog = "/am/main/v2/lk/log";
        fetchOptions.headers.Authorization = token;
      }
      await fetch(urlApiLog, fetchOptions).catch((err) => {
        const { response } = err;

        if (response?.status === 401) {
          urlApiLog = "/am/free/v2/lk/log";
          return fetch(urlApiLog, fetchOptions);
        }
        throw err;
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export default logEvent;
