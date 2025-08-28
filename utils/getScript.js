let cachedController = null;
const cachedPromised = Promise.resolve();
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

  console.log(document, script, "---- document");

  if (document.body) {
    document.body.appendChild(script);
  }
}

export function clearScript() {
  setScript("function initHandler(){return null}; function eventHandler(){return null}");
}

export function updateScript(scriptText) {
  clearScript();
  setScript(scriptText);
}

const loadScriptFromApi = async (idModule, idItem) => {
  try {
    cacheKey = idItem;
    const response = await fetch(`/api/card/js/${idModule}/${idItem}?time=${Date.now()}`, {
      method: "GET",
      signal: cachedController.signal,
    });
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error loading script from API:", error);
    throw error;
  }
};
const getScript = async (payload) => {
  if (!global.window || cacheKey === payload.idItem) return;
  cachedController?.abort();
  await cachedPromised?.catch(() => null);

  cacheKey = payload.idItem;

  cachedController = new AbortController();

  try {
    const scriptText = await loadScriptFromApi(payload.idModule, payload.idItem);
    updateScript(scriptText);
  } catch (error) {
    clearScript();
  }
};

export default getScript;
