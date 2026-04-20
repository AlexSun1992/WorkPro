import Vue from "vue";

// TODO: удалить этот плагин после миграции на Vue 3.
// В Vue 3 ограничение на '$'-префикс в setup() снято, и useVuelidate() можно
// возвращать сразу как '$v' из setup() — миксин станет не нужен.
// Также убрать подключение этого файла из jest.config.js -> setupFilesAfterEnv.
Vue.mixin({
  created() {
    if (this.vuelidateRef !== undefined) {
      Object.defineProperty(this, "$v", {
        get: () => this.vuelidateRef,
        configurable: true,
        enumerable: true,
      });
    }
  },
});
