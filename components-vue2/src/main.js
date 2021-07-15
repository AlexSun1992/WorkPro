import Vue from "vue";
import vueCustomElement from "vue-custom-element";
import ComponentLoginButton from "./components/Login/LoginButton.vue";
import ComponentLoginForm from "./components/Login/LoginForm.vue";
import ComponentQuizCalculator from "./components/QuizCalculator/QuizCalculator.vue";
Vue.use(vueCustomElement);
Vue.config.productionTip = false;
new Vue({
  render: (h) => h(App),
});
Vue.customElement("component-login-button", ComponentLoginButton);
Vue.customElement("component-login-form", ComponentLoginForm);
Vue.customElement("component-quiz-calculator", ComponentQuizCalculator);
