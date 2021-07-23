import Vue from "vue";
import vueCustomElement from "vue-custom-element";
import { ModalPlugin } from "bootstrap-vue";
Vue.use(ModalPlugin);
Vue.use(vueCustomElement);
Vue.config.productionTip = false;
new Vue({
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
/* Для теста */
Vue.customElement(
  "component-driver-list",
  () =>
    new Promise((resolve) => {
      require(["./components/FormCalculator/DriverList.vue"], (lazyComponent) =>
        resolve(lazyComponent.default));
    })
);
