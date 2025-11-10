<template>
  <div class="vrt-wrap">
    <!-- ERROR PANEL -->
    <pre
      v-if="err && debug"
      class="vrt-error"
    >
[v-runtime-template] render error
message: {{ err.message }}
stack:
{{ err.stack }}

diagnostics:
  compilerSource:  {{ compilerSource }}
  vueVersion:      {{ vueVersion }}
  typeof Vue.compile: {{ typeofCompile }}
  cspBlocked:      {{ cspBlocked }}
  process.client:  {{ isClient }}
  templateEmpty:   {{ !hasTemplate }}
  staticUrl:       {{ staticUrl }}
    </pre>

    <!-- NORMAL RENDER -->
    <component
      v-else
      :is="innerComp"
      :key="instanceKey"
    />
  </div>
</template>

<script>
import Vue from "vue";

/**
 * Drop-in замена v-runtime-template для Vue 2.7 / Nuxt 2.
 * Совместимые пропсы:
 *  - template: String (обязателен)
 *  - data / params: Object (данные, доступны как this.* в шаблоне)
 *  - components: Object (whitelist компонентов, доступных в шаблоне)
 * Дополнительно:
 *  - wrapWith: String — принудительная обёртка с единым корнем
 *  - staticCompilerPath: String — явный URL компилятора (если нужен)
 *  - debug: Boolean — показывать панель ошибок (по умолчанию в dev)
 */
export default {
  name: "VRuntimeTemplate",

  props: {
    template: { type: String, required: true },
    // совместимость: и data, и params — одно и то же
    data: { type: Object, default: () => ({}) },
    params: { type: Object, default: null },
    components: { type: Object, default: () => ({}) },
    wrapWith: { type: String, default: null },
    staticCompilerPath: { type: String, default: "" },
    debug: { type: Boolean, default: process.env.NODE_ENV !== "production" },
  },

  data() {
    return {
      innerComp: { render: (h) => h("span") },
      instanceKey: 0,
      // diagnostics
      err: null,
      compilerSource: "none",
      vueVersion: Vue.version,
      typeofCompile: typeof Vue.compile,
      isClient: process.client,
      hasTemplate: false,
      cspBlocked: false,
      staticUrl: "",
    };
  },

  computed: {
    // модель данных (приоритет params, затем data) — как у v-runtime-template
    model() {
      return this.params || this.data || {};
    },
    registry() {
      return this.components || {};
    },
  },

  mounted() {
    this.compileOnClient();
  },

  watch: {
    template() {
      this.compileOnClient();
    },
    components: {
      handler() {
        this.compileOnClient();
      },
      deep: true,
    },
    params: {
      handler() {
        this.instanceKey++;
      },
      deep: true,
    },
    data: {
      handler() {
        this.instanceKey++;
      },
      deep: true,
    },
  },

  methods: {
    async compileOnClient() {
      this.err = null;
      this.cspBlocked = false;
      this.vueVersion = Vue.version;
      this.typeofCompile = typeof Vue.compile;
      this.isClient = process.client;
      this.hasTemplate = !!(this.template && this.template.trim());
      this.compilerSource = "none";
      this.staticUrl = this.computeStaticUrl();

      if (!process.client) {
        this.innerComp = { render: (h) => h("span") };
        return;
      }
      if (!this.hasTemplate) {
        return this.fail(new Error("Empty template: строка шаблона не задана или пуста"));
      }

      // нормализация: гарантируем один корень
      let tpl = (this.template || "").trim();
      if (this.wrapWith && !/^<[\w-]/.test(tpl)) tpl = `<${this.wrapWith}>${tpl}</${this.wrapWith}>`;
      if (!/^<[\w-]/.test(tpl)) tpl = `<div>${tpl}</div>`;

      try {
        const compilerVue = await this.obtainCompilerVue();
        if (!compilerVue || typeof compilerVue.compile !== "function") {
          throw new Error("Vue compiler is unavailable after all attempts (global/dynamic/static)");
        }

        let render;
        let staticRenderFns;
        try {
          ({ render, staticRenderFns } = compilerVue.compile(tpl));
        } catch (e) {
          if (String(e && e.message).match(/unsafe-eval|CSP|Content Security Policy/i)) {
            this.cspBlocked = true;
            throw new Error("CSP blocks compilation (requires script-src 'unsafe-eval')");
          }
          throw e;
        }

        const self = this;
        const Comp = Vue.extend({
          name: "VRuntimeTemplateInner",
          components: self.registry,
          data() {
            return self.model || {};
          }, // реактивная ссылка на модель
          render,
          staticRenderFns,
        });

        this.innerComp = Comp;
        this.instanceKey++;
      } catch (e) {
        this.fail(e);
      }
    },

    computeStaticUrl() {
      if (this.staticCompilerPath) return this.staticCompilerPath;
      // определяем basePath из Nuxt
      let base =
        (this.$router && this.$router.options && this.$router.options.base) ||
        (window.__NUXT__ &&
          window.__NUXT__.config &&
          window.__NUXT__.config.app &&
          window.__NUXT__.config.app.basePath) ||
        (document.querySelector("base") && document.querySelector("base").getAttribute("href")) ||
        "/";
      if (!base.startsWith("/")) base = `/${base}`;
      if (!base.endsWith("/")) base += "/";
      return `${base}vue-compiler/vue.esm.js`;
    },

    async obtainCompilerVue() {
      // 1) глобальный компилятор
      if (typeof Vue.compile === "function") {
        this.compilerSource = "global Vue.compile";
        return Vue;
      }
      // 2) динамический импорт из node_modules
      try {
        // eslint-disable-next-line
        const mod = await import(/* webpackChunkName: "vue-compiler" */ "vue/dist/vue.esm.js");
        const m = mod && (mod.default || mod);
        if (m && typeof m.compile === "function") {
          this.compilerSource = "dynamic import: vue/dist/vue.esm.js";
          // подсунем компилятор текущему рантайму — полезно для сторонних либ
          Vue.compile = m.compile;
          return m;
        }
      } catch (_) {
        /* pass */
      }
      // 3) загрузка из /static (учитывает basePath)
      try {
        const m = await this.loadStaticCompiler(this.staticUrl);
        if (m && typeof m.compile === "function") {
          this.compilerSource = `static: ${this.staticUrl}`;
          Vue.compile = m.compile;
          return m;
        }
      } catch (e) {
        // упадёт чуть ниже в общий обработчик
        throw new Error(`Failed to load static compiler: ${e?.message || e}`);
      }
      return null;
    },

    loadStaticCompiler(src) {
      if (window.__VUE_COMPILER__) return Promise.resolve(window.__VUE_COMPILER__);
      return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => {
          // многие сборки кладут Vue в window.Vue
          window.__VUE_COMPILER__ = window.__VUE_COMPILER__ || window.Vue || null;
          resolve(window.__VUE_COMPILER__);
        };
        s.onerror = () => reject(new Error(`HTTP ${src} not found`));
        document.head.appendChild(s);
      });
    },

    fail(e) {
      this.err = {
        message: e && e.message ? e.message : String(e),
        stack: e && e.stack ? e.stack : "",
      };
      this.innerComp = { render: (h) => h("span") };
      this.instanceKey++;
      // для видимости в консоли
      /* eslint-disable no-console */
      console.error("[v-runtime-template]", this.err.message, "\n", this.err.stack);
    },
  },

  errorCaptured(err, vm, info) {
    this.fail(new Error(`${err && err.message ? err.message : err}\n[errorCaptured info: ${info}]`));
    // не пускаем выше, чтобы не ломать страницу
    return false;
  },
};
</script>

<style scoped>
.vrt-error {
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
.vrt-wrap {
  display: contents;
}
</style>
