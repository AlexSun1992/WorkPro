/* eslint-disable global-require, import/no-dynamic-require */
import Vue from "vue";
import vueCustomElement from "vue-custom-element";
import { ModalPlugin, DropdownPlugin, BootstrapVue } from "bootstrap-vue";
import axios from "axios";
import Vue2TouchEvents from "vue2-touch-events";
import LottieVuePlayer from "@lottiefiles/vue-lottie-player";
import LogEvent from "@/components/LogScript/LogScript";
import { store } from "./store/index";

store.$axios = axios;
Vue.prototype.$axios = axios;
Vue.prototype.$LogEvent = LogEvent;
Vue.use(ModalPlugin);
Vue.use(DropdownPlugin);
Vue.use(vueCustomElement);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;
Vue.use(Vue2TouchEvents);
Vue.use(LottieVuePlayer);
Vue.config.devtools = true;

if (process.env.NODE_ENV === "development") {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach((node) => {
        if (node.__vue_custom_element__) {
          node.__vue__ = node.__vue_custom_element__;
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

Vue.customElement(
  "component-login-button",
  () =>
    new Promise((resolve) => {
      require(["@/components/Login/LoginButton.vue"], (lazyComponent) => {
        lazyComponent.default.store = store;
        resolve(lazyComponent.default);
      });
    })
);

Vue.customElement(
  "component-auth-form",
  () =>
    new Promise((resolve) => {
      require(["@/components/Login/AuthForm/AuthForm"], (lazyComponent) => {
        resolve(lazyComponent.default);
      });
    })
);

Vue.customElement(
  "component-login-form",
  () =>
    new Promise((resolve) => {
      require(["@/components/Login/LoginForm.vue"], (lazyComponent) => resolve(lazyComponent.default));
    })
);

Vue.customElement(
  "component-card-editor",
  () =>
    new Promise((resolve) => {
      require(["@/components/Card/CardEditor.vue", "./store/index"], (lazyComponent) => {
        lazyComponent.default.store = store;
        resolve(lazyComponent.default);
      });
    })
);

Vue.customElement(
  "component-password-recovery-form",
  () =>
    new Promise((resolve) => {
      require(["@/components/Login/RecoveryForm/PasswordRecoveryForm.vue"], (lazyComponent) =>
        resolve(lazyComponent.default));
    })
);
Vue.customElement(
  "component-reg-form",
  () =>
    new Promise((resolve) => {
      require(["@/components/Login/RegForm/RegForm.vue"], (lazyComponent) => resolve(lazyComponent.default));
    })
);

Vue.customElement(
  "component-show-city",
  () =>
    new Promise((resolve) => {
      require(["@/components/ShowCity/ShowCity.vue"], (lazyComponent) => {
        lazyComponent.default.store = store;
        resolve(lazyComponent.default);
      });
    })
);
