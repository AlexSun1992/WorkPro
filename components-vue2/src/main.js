import Vue from "vue";
// import Vuex from "vuex";
import vueCustomElement from "vue-custom-element";
import { ModalPlugin } from "bootstrap-vue";
import { store } from "./store/index";

Vue.use(ModalPlugin);
Vue.use(vueCustomElement);

Vue.config.productionTip = false;
new Vue({
  store,
  render: (h) => h(App),
});

Vue.customElement(
  "component-login-button",
  () =>
    new Promise((resolve) => {
      require(["./components/Login/LoginButton.vue"], (lazyComponent) =>
        resolve(lazyComponent.default));
    })
);
Vue.customElement(
  "component-login-form",
  () =>
    new Promise((resolve) => {
      require(["./components/Login/LoginForm.vue"], (lazyComponent) =>
        resolve(lazyComponent.default));
    })
);
Vue.customElement(
  "component-quiz-calculator",
  () =>
    new Promise((resolve) => {
      require(["./components/QuizCalculator/QuizCalculator.vue"], (
        lazyComponent
      ) => resolve(lazyComponent.default));
    })
);
Vue.customElement(
  "component-password-recovery-form",
  () =>
    new Promise((resolve) => {
      require(["./components/Login/RecoveryForm/PasswordRecoveryForm.vue"], (
        lazyComponent
      ) => resolve(lazyComponent.default));
    })
);
Vue.customElement(
  "component-reg-form",
  () =>
    new Promise((resolve) => {
      require(["./components/Login/RegForm/RegForm.vue"], (lazyComponent) =>
        resolve(lazyComponent.default));
    })
);
Vue.customElement(
  "component-editor-wrapper",
  () =>
    new Promise((resolve) => {
      require(["./components/EditorWrapper.vue"], (lazyComponent) =>
        resolve(lazyComponent.default));
    })
);
