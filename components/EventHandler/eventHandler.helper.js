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
