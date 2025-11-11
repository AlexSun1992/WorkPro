// plugins/vue-compile-polyfill.client.js
import Vue from "vue";

export default async (ctx) => {
  if (typeof Vue.compile === "function") return;

  // 1) сначала пробуем динамический импорт ESM (в бандле это нормально)
  let compilerVue = null;
  try {
    // eslint-disable-next-line import/extensions
    const mod = await import(/* webpackChunkName: "vue-compiler" */ "vue/dist/vue.esm.js");
    compilerVue = mod && (mod.default || mod);
  } catch (_) {}

  // 2) фолбэк: грузим UMD из статики
  if (!compilerVue || typeof compilerVue.compile !== "function") {
    const base = ctx.app?.router?.options?.base || window.__NUXT__?.config?.app?.basePath || "/";
    const normalizedBase = (base.startsWith("/") ? base : `/${base}`).replace(/\/?$/, "/");
    const url = `${normalizedBase}js/vue.js`; // ← UMD, не ESM!

    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = url;
      s.async = true;
      s.onload = resolve;
      s.onerror = () => reject(new Error(`Failed to load ${url}`));
      document.head.appendChild(s);
    });

    // UMD создаёт глобал
    compilerVue = window.Vue || window.__VUE_COMPILER__ || null;
  }

  if (!compilerVue || typeof compilerVue.compile !== "function") {
    console.error(
      "[vue-compile-polyfill] Vue.compile не найден. " +
        "Проверьте, что /js/vue.js доступен (UMD-сборка) и CSP допускает unsafe-eval."
    );
    return;
  }

  Vue.compile = compilerVue.compile;
  if (!window.Vue) window.Vue = Vue;
  console.info("[vue-compile-polyfill] Vue.compile подключён:", compilerVue.version);
};
