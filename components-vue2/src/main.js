import Vue from "vue";
import vueCustomElement from "vue-custom-element";
import { ModalPlugin, DropdownPlugin, BootstrapVue } from "bootstrap-vue";
import axios from "axios";
import Vue2TouchEvents from "vue2-touch-events";
/* eslint-disable */
import LogEvent from "@/components/LogScript/LogScript";
import { store } from "./store/index";
import LottieVuePlayer from "@lottiefiles/vue-lottie-player";

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

Vue.customElement(
  "component-password-confirm",
  () =>
    new Promise((resolve) => {
      require(["@/components/Libs/Controls/ControlPasswordConfirm/ControlPasswordConfirm.vue"], (lazyComponent) => {
        lazyComponent.default.store = store;
        resolve(lazyComponent.default);
      });
    })
);

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
  "component-auth-form",
  () =>
    new Promise((resolve) => {
      require(["./components/Login/AuthForm/AuthForm"], (lazyComponent) => {
        resolve(lazyComponent.default);
      });
    })
);

Vue.customElement(
  "component-auth-form",
  () =>
    new Promise((resolve) => {
      require(["./components/Login/AuthForm/AuthForm"], (lazyComponent) => {
        resolve(lazyComponent.default);
      });
    })
);

Vue.customElement(
  "component-login-form",
  () =>
    new Promise((resolve) => {
      require(["./components/Login/LoginForm.vue"], (lazyComponent) => resolve(lazyComponent.default));
    })
);
Vue.customElement(
  "component-quiz-calculator",
  () =>
    new Promise((resolve) => {
      require(["./components/QuizCalculator/QuizCalculator.vue"], (lazyComponent) => resolve(lazyComponent.default));
    })
);

Vue.customElement(
  "component-password-recovery-form",
  () =>
    new Promise((resolve) => {
      require(["./components/Login/RecoveryForm/PasswordRecoveryForm.vue"], (lazyComponent) =>
        resolve(lazyComponent.default));
    })
);
Vue.customElement(
  "component-reg-form",
  () =>
    new Promise((resolve) => {
      require(["./components/Login/RegForm/RegForm.vue"], (lazyComponent) => resolve(lazyComponent.default));
    })
);
Vue.customElement(
  "component-dynamic-question-container",
  () =>
    new Promise((resolve) => {
      require(["./components/DynamicQuestion/DynamicQuestionContainer.vue"], (lazyComponent) =>
        resolve(lazyComponent.default));
    })
);

Vue.customElement(
  "component-list",
  () =>
    new Promise((resolve) => {
      require(["./components/List/List.vue", "./store/index"], (lazyComponent) => {
        lazyComponent.default.store = store;
        resolve(lazyComponent.default);
      });
    })
);

Vue.customElement(
  "component-card-editor",
  () =>
    new Promise((resolve) => {
      require(["./components/Card/CardEditor.vue", "./store/index"], (lazyComponent) => {
        lazyComponent.default.store = store;
        resolve(lazyComponent.default);
      });
    })
);

Vue.customElement(
  "component-show-city",
  () =>
    new Promise((resolve) => {
      require(["./components/ShowCity/ShowCity.vue"], (lazyComponent) => {
        lazyComponent.default.store = store;
        resolve(lazyComponent.default);
      });
    })
);

Vue.customElement(
  "component-user-location",
  () =>
    new Promise((resolve) => {
      require(["./components/UserLocation/UserLocation.vue"], (lazyComponent) => {
        lazyComponent.default.store = store;
        resolve(lazyComponent.default);
      });
    })
);

Vue.customElement(
  "component-header",
  () =>
    new Promise((resolve) => {
      require(["./components/Header/Header.vue"], (lazyComponent) => {
        lazyComponent.default.store = store;
        resolve(lazyComponent.default);
      });
    })
);

Vue.customElement(
  "component-payment-map",
  () =>
    new Promise((resolve) => {
      require(["./components/PaymentMap/PaymentMap.vue"], (lazyComponent) => {
        lazyComponent.default.store = store;
        resolve(lazyComponent.default);
      });
    })
);

Vue.customElement(
  "component-show-city-payment",
  () =>
    new Promise((resolve) => {
      require(["./components/PaymentMap/ShowCityPayment"], (lazyComponent) => {
        lazyComponent.default.store = store;
        resolve(lazyComponent.default);
      });
    })
);

Vue.customElement(
  "component-async-modal-action",
  () =>
    new Promise((resolve) => {
      require(["@/components/Libs/Controls/AsyncModalAction/ControlAsyncModal.vue"], (lazyComponent) => {
        lazyComponent.default.store = store;
        resolve(lazyComponent.default);
      });
    })
);

Vue.customElement(
  "control-modal",
  () =>
    new Promise((resolve) => {
      require(["@/components/Libs/Controls/AsyncModalAction/ControlModal"], (lazyComponent) => {
        lazyComponent.default.store = store;
        resolve(lazyComponent.default);
      });
    })
);

Vue.customElement(
  "control-authorization",
  () =>
    new Promise((resolve) => {
      require(["@/components/Libs/Controls/ControlAuthorization/ControlAuthorization.vue"], (lazyComponent) => {
        lazyComponent.default.store = store;
        resolve(lazyComponent.default);
      });
    })
);
