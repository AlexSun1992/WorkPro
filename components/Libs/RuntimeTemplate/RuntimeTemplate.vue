<template>
  <div class="runtime-template-wrap">
    <pre
      v-if="err && debug"
      class="runtime-template-error"
    >
RuntimeTemplate error:
{{ err.message }}

Stack:
{{ err.stack }}

Diagnostics:
compilerSource = {{ compilerSource }}
Vue.version = {{ vueVersion }}
typeof (global Vue).compile = {{ typeofGlobalCompile }}
process.client = {{ isClient }}
templateEmpty = {{ !hasTemplate }}
cspBlocked = {{ cspBlocked }}
staticUrl = {{ staticUrl }}
    </pre>

    <!-- пробрасываем собранные пропсы (data/props/computed + public из setup) -->
    <component
      v-else
      :is="innerComp"
      :key="instanceKey"
      v-bind="mergedPropsForBind"
    />
  </div>
</template>

<script>
import Vue from "vue";
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  useContext,
  getCurrentInstance,
} from "@nuxtjs/composition-api";

// безопасное имя пропса: начинается с буквы, далее буквы/цифры/_/-; не $, не _
const isSafePropName = (k) =>
  typeof k === "string" &&
  k.length > 0 &&
  !k.startsWith("$") &&
  !k.startsWith("_") &&
  /^[A-Za-z][A-Za-z0-9_-]*$/.test(k);

function copyPropDescriptor(src, dst, key) {
  if (!Object.prototype.hasOwnProperty.call(dst, key)) {
    const desc = Object.getOwnPropertyDescriptor(src, key);
    if (desc) Object.defineProperty(dst, key, desc);
  }
}

function normalizeComponentsMap(map = {}) {
  const out = { ...map };
  Object.keys(map).forEach((key) => {
    const comp = map[key];
    const kebab = key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    const pascal = key[0].toUpperCase() + key.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (!out[kebab]) out[kebab] = comp;
    if (!out[pascal]) out[pascal] = comp;
  });
  return out;
}

export default defineComponent({
  name: "RuntimeTemplate",

  props: {
    template: { type: String, required: true },

    // Доп. пропсы внутрь рантайм-компонента (аналог templateProps)
    templateProps: { type: Object, default: () => ({}) },

    // Карта доступных компонентов: { 'notify-block': NotifyBlock, NotifyItem }
    componentsMap: { type: Object, default: () => ({}) },

    // Что наследуем из родителя
    includeParentData: { type: Boolean, default: true },
    includeParentProps: { type: Boolean, default: true },
    includeParentMethods: { type: Boolean, default: true },
    includeParentComputed: { type: Boolean, default: true },
    includeParentComponents: { type: Boolean, default: true },
    // ⬇️ НОВОЕ: тянуть публичные свойства инстанса (включая значения из setup())
    includeParentPublic: { type: Boolean, default: true },

    // Передавать ли функции как props (обычно НЕ нужно)
    passMethodsAsProps: { type: Boolean, default: false },

    // Обёртка для единого корня
    wrapWith: { type: String, default: null },

    // Путь к vue.esm.js (модуль обычно кладёт в /js/vue.esm.js)
    staticCompilerPath: { type: String, default: "" },

    // Диагностика
    debug: { type: Boolean, default: process.env.NODE_ENV !== "production" },
  },

  setup(props) {
    const { app } = useContext();
    const inst = getCurrentInstance();
    const parentVm = inst?.proxy?.$parent || null;

    // diag
    const err = ref(null);
    const compilerSource = ref("none");
    const vueVersion = ref(Vue.version);
    const typeofGlobalCompile = ref(typeof Vue.compile);
    const isClient = ref(process.client);
    const hasTemplate = ref(false);
    const cspBlocked = ref(false);
    const staticUrl = ref("");

    // render state
    const innerComp = ref({ render: (h) => h("span") });
    const instanceKey = ref(0);

    function resolveStaticUrl() {
      if (props.staticCompilerPath) {
        staticUrl.value = props.staticCompilerPath;
        return staticUrl.value;
      }
      const base =
        app?.router?.options?.base ||
        window.__NUXT__?.config?.app?.basePath || // Nuxt 2
        window.__NUXT__?.config?.app?.baseURL || // Bridge/Nuxt 3
        (document.querySelector("base") && document.querySelector("base").getAttribute("href")) ||
        "/";
      const norm = (base.startsWith("/") ? base : `/${base}`).replace(/\/?$/, "/");
      staticUrl.value = `${norm}js/vue.esm.js`;
      return staticUrl.value;
    }

    async function obtainCompilerVue() {
      if (typeof Vue.compile === "function") {
        compilerSource.value = "global Vue.compile";
        return Vue;
      }
      try {
        // eslint-disable-next-line import/extensions
        const mod = await import(/* webpackChunkName: "vue-compiler" */ "vue/dist/vue.esm.js");
        const m = mod && (mod.default || mod);
        if (m && typeof m.compile === "function") {
          compilerSource.value = "dynamic import: vue/dist/vue.esm.js";
          return m;
        }
      } catch (_) {}
      try {
        const m = await loadStaticCompiler(resolveStaticUrl());
        if (m && typeof m.compile === "function") {
          compilerSource.value = `static: ${staticUrl.value}`;
          return m;
        }
      } catch (e) {
        failWith(new Error(`Не удалось загрузить static-компилятор: ${e?.message || e}`));
      }
      return null;
    }

    function loadStaticCompiler(src) {
      if (window.__VUE_COMPILER__) return Promise.resolve(window.__VUE_COMPILER__);
      return new Promise((resolve, reject) => {
        const el = document.createElement("script");
        el.src = src;
        el.async = true;
        el.onload = () => {
          window.__VUE_COMPILER__ = window.__VUE_COMPILER__ || window.Vue || null;
          resolve(window.__VUE_COMPILER__);
        };
        el.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(el);
      });
    }

    function failWith(e) {
      err.value = { message: e?.message || String(e), stack: e?.stack || "" };
      innerComp.value = { render: (h) => h("span") };
      instanceKey.value++;
      // eslint-disable-next-line no-console
      console.error("[RuntimeTemplate]", err.value.message, "\n", err.value.stack);
    }

    // 1) Собираем из родителя то, что можно пробросить (как в твоём v-runtime-template)
    const picked = computed(() => {
      const out = { $data: {}, $props: {}, components: {}, computed: {}, methods: {} };
      if (!parentVm) return out;

      if (props.includeParentData && parentVm.$data) {
        Object.keys(parentVm.$data).forEach((k) => {
          if (isSafePropName(k)) out.$data[k] = parentVm.$data[k];
        });
      }
      if (props.includeParentProps && parentVm.$props) {
        Object.keys(parentVm.$props).forEach((k) => {
          if (isSafePropName(k)) out.$props[k] = parentVm.$props[k];
        });
      }
      if (props.includeParentMethods && parentVm.$options?.methods) {
        Object.keys(parentVm.$options.methods).forEach((k) => {
          if (isSafePropName(k)) out.methods[k] = parentVm.$options.methods[k];
        });
      }
      if (props.includeParentComputed && parentVm.$options?.computed) {
        Object.keys(parentVm.$options.computed).forEach((k) => {
          if (isSafePropName(k)) out.computed[k] = parentVm.$options.computed[k];
        });
      }
      if (props.includeParentComponents && parentVm.$options?.components) {
        Object.assign(out.components, normalizeComponentsMap(parentVm.$options.components));
      }
      return out;
    });

    // 1.1) НОВОЕ: публичные свойства инстанса (включая setup-refs/computed) → как props
    const parentPublicProps = computed(() => {
      const out = {};
      if (!props.includeParentPublic || !parentVm) return out;

      const skip = new Set([
        // внутренние/служебные
        "constructor",
        "prototype",
        "name",
        "length",
      ]);
      const known = new Set([
        // не дублируем то, что уже идёт отдельными путями
        ...Object.keys(parentVm.$data || {}),
        ...Object.keys(parentVm.$props || {}),
        ...(parentVm.$options?.methods ? Object.keys(parentVm.$options.methods) : []),
        ...(parentVm.$options?.computed ? Object.keys(parentVm.$options.computed) : []),
      ]);

      Object.getOwnPropertyNames(parentVm).forEach((k) => {
        if (skip.has(k)) return;
        if (!isSafePropName(k)) return;
        if (known.has(k)) return;

        const desc = Object.getOwnPropertyDescriptor(parentVm, k);
        if (!desc) return;

        // по умолчанию не отдаём функции как props (их отдаём в methodsForInner ниже)
        const val = (() => {
          try {
            return parentVm[k];
          } catch {
            return undefined;
          }
        })();
        const isFn = typeof val === "function";

        if (isFn && !props.passMethodsAsProps) return;

        Object.defineProperty(out, k, desc); // сохраним геттер (реактивность)
      });

      return out;
    });

    // 2) Методы родителя как props-функции (оставим опционально)
    const parentMethodsAsProps = computed(() => {
      const out = {};
      if (!props.passMethodsAsProps) return out;
      Object.keys(picked.value.methods || {}).forEach((k) => copyPropDescriptor(parentVm, out, k));
      return out;
    });

    // 3) Итоговые props: data + props + (опц.) методы как props + публичные свойства + явные templateProps
    const mergedProps = computed(() => {
      const dst = {};

      if (parentVm?.$data) {
        Object.getOwnPropertyNames(picked.value.$data).forEach((k) => {
          if (!isSafePropName(k)) return;
          copyPropDescriptor(parentVm.$data, dst, k);
        });
      }

      Object.getOwnPropertyNames(picked.value.$props).forEach((k) => {
        if (!isSafePropName(k)) return;
        copyPropDescriptor(parentVm, dst, k); // props как геттеры на инстансе
      });

      // публичные свойства (включая setup-refs/computed)
      Object.getOwnPropertyNames(parentPublicProps.value).forEach((k) => {
        if (!isSafePropName(k)) return;
        copyPropDescriptor(parentPublicProps.value, dst, k);
      });

      // (опц.) методы как props
      if (props.passMethodsAsProps) {
        Object.getOwnPropertyNames(parentMethodsAsProps.value).forEach((k) => {
          if (!isSafePropName(k)) return;
          copyPropDescriptor(parentVm, dst, k);
        });
      }

      // явные templateProps (перекрывают всё выше)
      Object.getOwnPropertyNames(props.templateProps || {}).forEach((k) => {
        if (!isSafePropName(k)) return;
        copyPropDescriptor(props.templateProps, dst, k);
      });

      return dst;
    });

    const dynamicPropNames = computed(() => Object.keys(mergedProps.value));

    // Преобразуем в объект для v-bind (сохраняя геттеры)
    const mergedPropsForBind = computed(() => {
      const obj = {};
      dynamicPropNames.value.forEach((k) => {
        Object.defineProperty(
          obj,
          k,
          Object.getOwnPropertyDescriptor(mergedProps.value, k) || {
            enumerable: true,
            get: () => mergedProps.value[k],
          }
        );
      });
      return obj;
    });

    async function compileAndMount() {
      err.value = null;
      cspBlocked.value = false;
      vueVersion.value = Vue.version;
      typeofGlobalCompile.value = typeof Vue.compile;
      isClient.value = process.client;
      hasTemplate.value = !!(props.template && props.template.trim());
      compilerSource.value = "none";
      resolveStaticUrl();

      if (!process.client) {
        innerComp.value = { render: (h) => h("span") };
        return;
      }
      if (!hasTemplate.value) {
        failWith(new Error("Пустой template: строка шаблона не задана или пуста"));
        return;
      }

      // единый корень
      let tpl = (props.template || "").trim();
      if (props.wrapWith && !/^<[\w-]/.test(tpl)) tpl = `<${props.wrapWith}>${tpl}</${props.wrapWith}>`;
      if (!/^<[\w-]/.test(tpl)) tpl = `<div>${tpl}</div>`;

      try {
        const compilerVue = await obtainCompilerVue();
        if (!compilerVue || typeof compilerVue.compile !== "function") {
          throw new Error("Компилятор Vue недоступен после всех попыток (global/dynamic/static).");
        }

        let render;
        let staticRenderFns;
        try {
          ({ render, staticRenderFns } = compilerVue.compile(tpl));
        } catch (e) {
          if (String(e?.message).match(/unsafe-eval|CSP|Content Security Policy/i)) {
            cspBlocked.value = true;
            throw new Error("CSP блокирует компиляцию (нужен script-src 'unsafe-eval' для Vue.compile).");
          }
          throw e;
        }

        // Методы родителя как methods внутреннего компонента (для вызовов из шаблона)
        const methodsForInner = {};
        if (props.includeParentMethods && parentVm?.$options?.methods) {
          Object.keys(parentVm.$options.methods).forEach((k) => {
            if (!isSafePropName(k)) return;
            methodsForInner[k] = parentVm[k];
          });
        }
        // Плюс: если passMethodsAsProps=false, а в public попались функции — добавим их тоже в methods
        if (!props.passMethodsAsProps && props.includeParentPublic) {
          Object.getOwnPropertyNames(parentPublicProps.value).forEach((k) => {
            const val = (() => {
              try {
                return parentVm[k];
              } catch {
                return undefined;
              }
            })();
            if (typeof val === "function" && isSafePropName(k) && !methodsForInner[k]) {
              methodsForInner[k] = val;
            }
          });
        }

        // Компоненты: родителя + карта пользователя
        let effectiveComponents = normalizeComponentsMap(props.componentsMap || {});
        if (props.includeParentComponents && parentVm?.$options?.components) {
          effectiveComponents = { ...normalizeComponentsMap(parentVm.$options.components), ...effectiveComponents };
        }

        const Comp = Vue.extend({
          name: "RuntimeTemplateInner",
          parent: parentVm || undefined, // сохранить provide/inject цепочку
          components: effectiveComponents,
          props: dynamicPropNames.value, // список prop-имён
          computed: picked.value.computed, // computed родителя доступны внутри
          methods: methodsForInner, // методы — только как methods (не как props, если не просили)
          render,
          staticRenderFns,
        });

        innerComp.value = Comp;
        instanceKey.value++;
      } catch (e) {
        failWith(e);
      }
    }

    onMounted(compileAndMount);
    watch(() => props.template, compileAndMount);
    watch(() => props.componentsMap, compileAndMount, { deep: true });
    watch(
      () => props.templateProps,
      () => {
        instanceKey.value++;
      },
      { deep: true }
    );
    // изменение флагов наследования — достаточно перемонтировать
    watch(
      () => [
        props.includeParentData,
        props.includeParentProps,
        props.includeParentComputed,
        props.includeParentPublic,
        props.includeParentMethods,
      ],
      () => {
        instanceKey.value++;
      }
    );

    return {
      innerComp,
      instanceKey,
      err,
      compilerSource,
      vueVersion,
      typeofGlobalCompile,
      isClient,
      hasTemplate,
      cspBlocked,
      staticUrl,
      mergedPropsForBind,
      // eslint-disable-next-line vue/no-dupe-keys
      debug: props.debug,
    };
  },

  errorCaptured(err, vm, info) {
    // eslint-disable-next-line no-console
    console.error(
      "[RuntimeTemplate] ",
      err?.message || err,
      `\n[errorCaptured info: ${info}]`,
      "\nStack:\n",
      err?.stack || ""
    );
    return false;
  },
});
</script>

<style scoped>
.runtime-template-error {
  white-space: pre-wrap;
  padding: 12px;
  border: 1px solid #e11d48;
  border-radius: 6px;
  background: #fff1f2;
  color: #7f1d1d;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 12px;
  line-height: 1.35;
  margin: 8px 0;
}
.runtime-template-wrap {
  display: contents;
}
</style>
