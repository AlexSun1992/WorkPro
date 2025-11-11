// components/v-runtime-template.js
import Vue from "vue";

// копирует дескриптор свойства из src в dst, если его там нет
function copyPropDescriptor(src, dst, key) {
  if (!Object.prototype.hasOwnProperty.call(dst, key)) {
    const desc = Object.getOwnPropertyDescriptor(src, key);
    if (desc) Object.defineProperty(dst, key, desc);
  }
}

// безопасные имена пропсов (не служебные, не пустые, начинаются с буквы)
function isSafePropName(k) {
  return (
    typeof k === "string" &&
    k.length > 0 &&
    !k.startsWith("$") &&
    !k.startsWith("_") &&
    /^[A-Za-z][A-Za-z0-9_-]*$/.test(k)
  );
}

// нормализация карты компонентов (kebab/Pascal)
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

export default {
  name: "v-runtime-template",
  props: {
    template: String,
    parent: Object,
    templateProps: { type: Object, default: () => ({}) },
    // опции как в улучшенной версии
    passMethodsAsProps: { type: Boolean, default: false },
    includeParentPublic: { type: Boolean, default: true },
  },

  render(h) {
    try {
      if (!this.template) return;

      const parent = this.parent || this.$parent;

      // из родителя
      const pData = parent.$data || {};
      const pProps = parent.$props || {};
      const pOptions = parent.$options || {};
      const pComponents = pOptions.components || {};
      const pComputed = pOptions.computed || {};
      const pMethods = pOptions.methods || {};

      // из текущего компонента (чтобы не перетирать локальные одноимённые)
      const cData = this.$data || {};
      const cProps = this.$props || {};
      const cOptions = this.$options || {};
      const cMethods = cOptions.methods || {};
      const cComputed = cOptions.computed || {};
      const cComponents = cOptions.components || {};

      // соберём «недостающие» части из родителя
      const picked = {
        $data: {},
        $props: {},
        $options: {},
        components: {},
        computed: {},
        methods: {},
      };

      Object.keys(pData).forEach((k) => {
        if (cData[k] === undefined && isSafePropName(k)) picked.$data[k] = pData[k];
      });
      Object.keys(pProps).forEach((k) => {
        if (cProps[k] === undefined && isSafePropName(k)) picked.$props[k] = pProps[k];
      });
      Object.keys(pMethods).forEach((k) => {
        if (cMethods[k] === undefined && isSafePropName(k)) picked.methods[k] = pMethods[k];
      });
      Object.keys(pComputed).forEach((k) => {
        if (cComputed[k] === undefined && isSafePropName(k)) picked.computed[k] = pComputed[k];
      });

      // нормализованные компоненты родителя
      const normalizedParentComponents = normalizeComponentsMap(pComponents);
      Object.keys(normalizedParentComponents).forEach((k) => {
        if (cComponents[k] === undefined) picked.components[k] = normalizedParentComponents[k];
      });

      // публичные свойства инстанса родителя (включая значения из setup()) — как props
      const parentPublic = {};
      if (this.includeParentPublic) {
        const skip = new Set(["constructor", "prototype", "name", "length"]);
        const known = new Set([
          ...Object.keys(pData || {}),
          ...Object.keys(pProps || {}),
          ...Object.keys(pMethods || {}),
          ...Object.keys(pComputed || {}),
        ]);
        Object.getOwnPropertyNames(parent).forEach((k) => {
          if (skip.has(k)) return;
          if (!isSafePropName(k)) return;
          if (known.has(k)) return;
          const desc = Object.getOwnPropertyDescriptor(parent, k);
          if (!desc) return;
          const val = (() => {
            try {
              return parent[k];
            } catch {
              return undefined;
            }
          })();
          const isFn = typeof val === "function";
          if (isFn && !this.passMethodsAsProps) return; // функции не кладём как props по умолчанию
          Object.defineProperty(parentPublic, k, desc);
        });
      }

      // список пропсов для динамического компонента
      const methodKeys = Object.keys(picked.methods || {}).filter(isSafePropName);
      const dataKeys = Object.keys(picked.$data || {}).filter(isSafePropName);
      const propKeys = Object.keys(picked.$props || {}).filter(isSafePropName);
      const publicKeys = Object.keys(parentPublic || {}).filter(isSafePropName);
      const extraKeys = Object.keys(this.templateProps || {}).filter(isSafePropName);

      const dynamicPropNames = Array.from(
        new Set(
          []
            .concat(dataKeys)
            .concat(propKeys)
            .concat(this.passMethodsAsProps ? methodKeys : []) // методы как props — по флагу
            .concat(publicKeys)
            .concat(extraKeys)
        )
      );

      // методы родителя в качестве methods внутреннего компонента
      const methodsForInner = (() => {
        const out = {};
        methodKeys.forEach((k) => {
          out[k] = parent[k];
        });
        // если среди public попались функции и флаг не включён — тоже добавим в methods
        Object.keys(parentPublic).forEach((k) => {
          const val = (() => {
            try {
              return parent[k];
            } catch {
              return undefined;
            }
          })();
          if (typeof val === "function" && isSafePropName(k) && !out[k]) out[k] = val;
        });
        return out;
      })();

      // методы родителя как props (сохраняем дескрипторы/биндинг) — только по флагу
      const parentMethodsAsProps = (() => {
        const out = {};
        if (!this.passMethodsAsProps) return out;
        methodKeys.forEach((k) => copyPropDescriptor(parent, out, k));
        return out;
      })();

      // итоговый объект пропсов: data + props + public + (опц.) методы как props + явные templateProps
      const mergedProps = ((sources) => {
        const out = {};
        sources.forEach((src) => {
          if (!src) return;
          Object.getOwnPropertyNames(src).forEach((key) => {
            if (!isSafePropName(key)) return;
            copyPropDescriptor(src, out, key);
          });
        });
        return out;
      })([picked.$data, picked.$props, parentPublic, parentMethodsAsProps, this.templateProps]);

      // ─────────────────────────────────────────────────────────────
      // НОВОЕ: если компилятор есть — соберём реальный компонент через Vue.extend
      // ─────────────────────────────────────────────────────────────
      const tplRaw = (this.template || "").trim();
      const tpl = /^<[\w-]/.test(tplRaw) ? tplRaw : `<div>${tplRaw}</div>`;

      if (typeof Vue.compile === "function") {
        let render;
        let staticRenderFns;
        try {
          ({ render, staticRenderFns } = Vue.compile(tpl));
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error("[v-runtime-template] compile error:", e && e.message ? e.message : e);
          // если компиляция не удалась — откатимся к старому пути
        }

        if (render) {
          const Comp = Vue.extend({
            name: "RuntimeTemplateInner",
            parent: parent || undefined, // сохранить provide/inject цепочку
            components: picked.components,
            props: dynamicPropNames, // список prop-имён
            computed: picked.computed, // computed родителя доступны внутри
            methods: methodsForInner, // методы — только как methods (не как props)
            render,
            staticRenderFns,
          });

          return h(Comp, { props: mergedProps });
        }
      }

      // ─────────────────────────────────────────────────────────────
      // Фолбэк: старый подход — виртуальный объект с template
      // ─────────────────────────────────────────────────────────────
      return h(
        {
          template: tpl || "<div></div>",
          props: dynamicPropNames,
          computed: picked.computed,
          components: picked.components,
          methods: methodsForInner,
          // сохраняем provide/inject-цепочку
          provide: this.$parent && this.$parent._provided,
        },
        { props: mergedProps }
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(
        "[v-runtime-template] render error:",
        e && e.message ? e.message : e,
        "\nTemplate:\n",
        this.template,
        "\nStack:\n",
        e && e.stack ? e.stack : ""
      );
      return null;
    }
  },
};
