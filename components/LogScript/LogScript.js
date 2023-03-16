import Cookies from "js-cookie";

async function logEvent(object) {
  try {
    let formName;
    let calculateEtape = 0;
    const generalObject = createGeneralObject();

    const objectDataArray = [];

    if (object != undefined) {
      if (typeof object === "object") {
        if (object.length != undefined) {
          object = object.filter((obj) => obj != undefined);
          for (const obj of object) {
            objectDataArray.push(createObjectData(obj));
          }
        } else {
          objectDataArray.push(createObjectData(object));
        }
      }
    }

    if (objectDataArray.length == 1)
      if (objectDataArray[0].idEventType == 1001) {
        calculateEtape++;
      }
    function getCookie(name) {
      const nameEQ = `${name}=`;
      const ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
    function getUtm() {
      const objectData = {};

      let w_search;
      const w_hash = window.location.hash;
      if (w_hash == "") {
        //
        w_search = window.location.search;
        if (w_search != "") {
          //
          getParams(w_search.replace("?", ""));
        }
      } else {
        w_search = window.location.hash.split("?")[1];
        if (w_search !== undefined) {
          //
          getParams(w_search);
        } else {
          w_search = window.location.search;
          if (w_search != "") {
            //
            getParams(w_search.replace("?", ""));
          }
        }
      }

      function getParams(w_data) {
        const params = w_data.split("&").reduce((p, e) => {
          const a = e.split("=");
          p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
          return p;
        }, {});

        if (params.utm_source != undefined) {
          objectData.utm_source = params.utm_source;
        }
        if (params.utm_medium != undefined) {
          objectData.utm_medium = params.utm_medium;
        }
        if (params.utm_campaign != undefined) {
          objectData.utm_campaign = params.utm_campaign;
        }
        if (params.utm_content != undefined) {
          objectData.utm_content = params.utm_content;
        }
        if (params.utm_term != undefined) {
          objectData.utm_term = params.utm_term;
        }
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
      const ipad =
        find("ipad") ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); // ipad or iPadOS13Up

      const blackberry = find("blackberry") || find("bb10");
      const blackberryPhone = blackberry && !find("tablet");
      const blackberryTablet = blackberry && find("tablet");

      const fxos = (find("(mobile") || find("(tablet")) && find(" rv:");
      const fxosPhone = fxos && find("mobile");
      const fxosTablet = fxos && find("tablet");

      const meego = find("meego");

      const tablet =
        ipad ||
        androidTablet ||
        blackberryTablet ||
        windowsTablet ||
        fxosTablet;
      const mobile =
        androidPhone ||
        iphone ||
        ipod ||
        windowsPhone ||
        blackberryPhone ||
        fxosPhone ||
        meego;
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

      try {
        if (getCookie("_ym_uid") !== undefined) {
          objectData.yandexId = getCookie("_ym_uid");
        }
      } catch (error) {}

      const deviceType = getDeviceType();
      if (deviceType.iphone) objectData.idDevice = 2;
      else if (deviceType.androidPhone) objectData.idDevice = 3;
      else if (deviceType.tablet) objectData.idDevice = 5;
      else if (deviceType.desktop) objectData.idDevice = 1;
      else objectData.idDevice = 9;

      objectData.referer = document.referrer.split("?")[0];
      // objectData.userAgent = window.navigator.userAgent;

      const utm = getUtm();
      objectData.utm_source = utm.utm_source;
      objectData.utm_medium = utm.utm_medium;
      objectData.utm_campaign = utm.utm_campaign;
      objectData.utm_content = utm.utm_content;
      objectData.utm_term = utm.utm_term;

      try {
        objectData.googleId = ga.getAll()[0].get("clientId");
      } catch (error) {}

      objectData.etape = calculateEtape;

      try {
        objectData.ipUser = $("input[name=user_ip]").val();
        objectData.idSession = $("input[name=web_session]").val().toLowerCase();
      } catch (e) {}

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

      const token = Cookies.get("auth._token.local");
      const isAuthorised = token && token.length > 10;
      if (isAuthorised) {
        urlApiLog = "/am/main/v2/lk/log";
        fetchOptions.headers.Authorization = token;
      }
      await fetch("/am/main/v2/lk/log").then((response) => {
        if (response.status === 401) {
          return fetch("/am/free/v2/lk/log", fetchOptions);
        }
      });
      fetch(urlApiLog, fetchOptions);
    }
  } catch (error) {
    console.error(error);
  }
}
export default logEvent;
