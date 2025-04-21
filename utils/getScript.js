import axios from "axios";

let cachedController = null;
let cachedPromised = Promise.resolve();
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

const getScript = async (payload) => {
  if (!global.window || cacheKey === payload.idItem) return;
  cachedController?.abort();

  cacheKey = payload.idItem;

  cachedController = new AbortController();


  try {
      cachedPromised = loadScriptFromApi(payload.idModule, payload.idItem);
      const scriptText = await cachedPromised;
      updateScript(scriptText);
  } catch (error) {
    clearScript();
  }
};

export default getScript;
