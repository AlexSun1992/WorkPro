import { createCardModal } from "@/components/Libs/CardModal/createCardModal";

/**
 * Vue-плагин для web-компонентной сборки (публичная зона).
 * Регистрирует $cardModal через Vue.prototype, используя store сборки.
 * Роутера в публичной зоне нет, поэтому он не передаётся.
 */
export default {
  install(Vue, { store } = {}) {
    Vue.prototype.$cardModal = createCardModal({ store });
  },
};
