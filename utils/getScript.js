import axios from "axios";
import * as localScript from "../components/EventHandler/1089/eventHandler";

let cachedController = null;
let cachedPromised = null;
let cacheKey = null;

export function setScript(scriptText) {
  const getScriptFromConf = document.getElementById("eventHandler");
  if (getScriptFromConf) {
    document.body.removeChild(getScriptFromConf);
  }
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.setAttribute("id", "eventHandler");
  script.textContent = scriptText;

  document.body.appendChild(script);
}

export function clearScript() {
  setScript(
    "function initHandler(){return null}; function eventHandler(){return null}"
  );
}

export function updateScript(scriptText) {
  clearScript();
  setScript(scriptText);
}

const loadScriptFromApi = async (idModule, idItem) => {
  try {
    const response = await axios.get(
      `/api/card/js/${idModule}/${idItem}?time=${Date.now()}`,
      {
        method: "GET",
        signal: cachedController.signal,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error loading script from API:", error);
    throw error;
  }
};

const getScript = async (payload, store) => {
  if (!global.window || cacheKey === payload.idItem) return;
  store.commit("blocks/scriptLoaded", false);
  cachedController?.abort();
  await cachedPromised?.catch(() => null);

  cacheKey = payload.idItem;

  cachedController = new AbortController();

  if (payload.idItem == 1089) {
    console.log(1089, localScript);
    window.eventHandler = localScript.eventHandler;
    window.initHandler = localScript.initHandler;
    store.commit("blocks/scriptLoaded", true);
    return
  } else {
    cachedPromised = loadScriptFromApi(payload.idModule, payload.idItem);
  }

  try {
    const scriptText = await cachedPromised;
    updateScript(scriptText);
  } catch (error) {
    clearScript();
  }

  await cachedPromised;
  store.commit("blocks/scriptLoaded", true);
};

export default getScript;
