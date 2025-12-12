// src/matchMediaPolyfill.js

if (!window.matchMedia) {
  window.matchMedia = function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      dispatchEvent() {},
    };
  };
}
