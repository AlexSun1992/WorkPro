import Vue from "vue";
import vueCustomElement from "vue-custom-element";
import ComponentLoginButton from "./components/Login/LoginButton.vue";
import ComponentLoginForm from "./components/Login/LoginForm.vue";
import ComponentQuizCalculator from "./components/QuizCalculator/QuizCalculator.vue";
import ComponentPasswordRecoveryForm from "./components/Login/RecoveryForm/PasswordRecoveryForm.vue";
import { BootstrapVue } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import { BSpinner } from 'bootstrap-vue'
Vue.use(vueCustomElement);
Vue.component('b-spinner', BSpinner);
Vue.use(BootstrapVue)
Vue.config.productionTip = false;
new Vue({
  render: (h) => h(App),
});
Vue.customElement("component-login-button", ComponentLoginButton);
Vue.customElement("component-login-form", ComponentLoginForm);
Vue.customElement("component-quiz-calculator", ComponentQuizCalculator);
Vue.customElement(
  "component-password-recovery-form",
  ComponentPasswordRecoveryForm
);
