// Копирует node_modules/vue/dist/vue.esm.js → <static>/js/vue.esm.js
const fs = require("fs");
const path = require("path");

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
function fileDifferent(src, dst) {
  try {
    const a = fs.statSync(src);
    const b = fs.statSync(dst);
    return a.size !== b.size || a.mtimeMs > b.mtimeMs;
  } catch {
    return true;
  }
}

module.exports = function runtimeCompilerStatic(moduleOptions = {}) {
  const { nuxt } = this;
  const opts = {
    source: "vue/dist/vue.esm.js",
    outDir: "js", // ← по требованию: кладём в /js/
    filename: "vue.esm.js",
    force: false,
    silent: false,
    ...moduleOptions,
  };
  const log = (...a) => {
    if (!opts.silent) console.log("[runtime-compiler]", ...a);
  };
  const error = (...a) => console.error("[runtime-compiler]", ...a);

  const resolveStaticDir = () => {
    const staticDirName = (nuxt.options.dir && nuxt.options.dir.static) || "static";
    const base = nuxt.options.srcDir || nuxt.options.rootDir;
    return path.join(base, staticDirName);
  };

  let from;
  try {
    from = require.resolve(opts.source);
  } catch (e) {
    error(`Не найден "${opts.source}". Установлен ли пакет "vue"?`, e.message || e);
    return;
  }

  const copyOnce = () => {
    const staticDir = resolveStaticDir();
    const destDir = path.join(staticDir, opts.outDir); // static/js
    const dest = path.join(destDir, opts.filename); // static/js/vue.esm.js
    try {
      ensureDirSync(destDir);
      if (opts.force || fileDifferent(from, dest)) {
        fs.copyFileSync(from, dest);
        log(`Copied → ${path.relative(nuxt.options.rootDir, dest)}`);
      } else {
        log(`Already up-to-date → ${path.relative(nuxt.options.rootDir, dest)}`);
      }
    } catch (e) {
      error("Ошибка копирования компилятора:", e.message || e);
    }
  };

  nuxt.hook("ready", () => {
    if (nuxt.options.dev) copyOnce();
  });
  nuxt.hook("build:before", copyOnce);
  nuxt.hook("generate:before", copyOnce);
};
