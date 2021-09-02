import Vue from "vue";
import vueCustomElement from "vue-custom-element";
import { ModalPlugin } from "bootstrap-vue";
import axios from "axios";
import { store } from "./store/index";
store.$axios = axios;
Vue.use(ModalPlugin);
Vue.use(vueCustomElement);
Vue.config.productionTip = false;

Vue.customElement(
  "component-login-button",
  () =>
    new Promise((resolve) => {
      require(["./components/Login/LoginButton.vue"], (lazyComponent) => {
        lazyComponent.default.store = store;
        resolve(lazyComponent.default);
      });
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
  "component-dynamic-question-container",
  () =>
    new Promise((resolve) => {
      require(["./components/DynamicQuestion/DynamicQuestionContainer.vue"], (
        lazyComponent
      ) => resolve(lazyComponent.default));
    })
);
Vue.customElement(
  "component-card-editor",
  () =>
    new Promise((resolve) => {
      require(["./components/Card/CardEditor.vue", "./store/index"], (
        lazyComponent
      ) => {
        lazyComponent.default.store = store;
        resolve(lazyComponent.default);
      });
    })
);
Vue.customElement(
  "component-office-map",
  () =>
    new Promise((resolve) => {
      require(["./components/OfficeMap.vue", "./store/index"], (
        lazyComponent
      ) => {
        lazyComponent.default.store = store;
        resolve(lazyComponent.default);
      });
    })
);
