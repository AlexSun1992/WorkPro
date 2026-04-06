<template>
  <div class="login-form-content">
    <div
      v-if="visibleForm === 'login' || visibleForm === 'registration'"
      class="block-registration"
    >
      <button
        :class="{ active: visibleForm === 'login' }"
        @click="toggleForm('login')"
        class="login-btn-mobile"
      >
        Вход
      </button>

      <button
        :class="{ active: visibleForm === 'registration' }"
        @click="toggleForm('registration')"
        class="login-btn-mobile"
      >
        Регистрация
      </button>
    </div>
    <template v-if="visibleForm === 'login' || visibleForm === 'registration'">
      <div class="login_gos mt-4">
        <span>
          {{ visibleForm === "login" ? "Войти с помощью" : "Зарегистрироваться с помощью" }}
        </span>
      </div>

      <button
        @click="goESIA()"
        class="goesia"
        id="esia-login"
      >
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <use href="/img/login.svg#esia"></use>
        </svg>
        Госуслуги
      </button>

      <div class="login_gos mt-3">
        <span>Или</span>
      </div>

      <login-form v-if="visibleForm === 'login'"></login-form>
      <reg-form v-else-if="visibleForm === 'registration'"></reg-form>

      <div class="login_more mt-4">
        <div class="login_gos"><span>Другие способы входа</span></div>
        <div class="alternative_login-des">
          Вход с помощью Мобильного ID возможен только для операторов Мегафон, МТС и Билайн
        </div>
        <div class="row mt-3">
          <div class="col-12 col-lg-6">
            <button
              class="btn-alfa"
              @click="goALFA()"
              id="alfa-login"
            >
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="/img/login.svg#alfa"></use>
              </svg>
              Альфа ID
            </button>
          </div>
          <div class="col-12 col-lg-6 mt-3 mt-lg-0">
            <button
              class="btn-mobileid"
              @click="goMobileID()"
              id="mobile-login"
            >
              <svg
                width="16"
                height="19"
                viewBox="0 0 16 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="/img/login.svg#mobile"></use>
              </svg>
              Мобильный ID
            </button>
          </div>
          <div class="col-12 mt-3">
            <button
              class="btn-sberid hide"
              @click="goSberID()"
              id="sberid-login"
            >
              <svg
                width="23"
                height="22"
                viewBox="0 0 23 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <use href="/img/login.svg#sber"></use>
              </svg>
              Сбер ID
            </button>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="visibleForm === 'sms-confirm'">
      <div class="login_gos mt-4">
        <span>Подтвердите вход по SMS</span>
      </div>
      <sms-confirm />
    </template>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import LoginForm from "../LoginForm";
import RegForm from "../RegForm/RegForm";
import SmsConfirm from "../SMSConfirm/SMSConfirm";

export default {
  name: "AuthForm",
  components: {
    LoginForm,
    RegForm,
    SmsConfirm,
  },
  data() {
    return {
      visibleForm: null,
    };
  },
  methods: {
    redirectWithRef(path) {
      const url = new URL(path, window.location.origin);
      const DEFAULT_SUCCESS_REF = "/cabinet";
      const currentUrl = new URL(window.location.href);
      const cookieRef = Cookies.get("ref");

      url.searchParams.set("ref", currentUrl.searchParams.get("ref") || cookieRef || DEFAULT_SUCCESS_REF);

      window.location.href = url.href;
    },
    toggleForm(address) {
      if (address === "registration") {
        window.location.href = "/login/registration";
      }
      if (address === "login") {
        window.location.href = "/login";
      }
    },
    goESIA() {
      this.$LogEvent({
        formName: "AuthForm",
        idEventType: 18,
        controlName: "AuthForm.vue",
        message: `Нажал на кнопку «Войти через ГОСУСЛУГИ»`,
        timeUser: new Date(),
      });
      this.redirectWithRef("/sso?auth&type=esia");
    },
    goALFA() {
      this.$LogEvent({
        formName: "AuthForm",
        idEventType: 503,
        controlName: "AuthForm.vue",
        message: `Нажал на кнопку «Войти через AlfaID`,
        timeUser: new Date(),
      });
      this.redirectWithRef("/sso?auth&type=alfa");
    },
    goMobileID() {
      this.$LogEvent({
        formName: "AuthForm",
        idEventType: 521,
        controlName: "AuthForm.vue",
        message: `Нажал на кнопку «Войти через MobileID`,
        timeUser: new Date(),
      });
      this.redirectWithRef("/sso?auth&type=mobileid");
    },
    goSberID() {
      this.$LogEvent({
        formName: "AuthForm",
        idEventType: 861,
        controlName: "AuthForm.vue",
        message: `Нажал на кнопку «Войти чере Сбер ID`,
        timeUser: new Date(),
      });
      this.redirectWithRef("/sso?auth&type=sberid");
    },
  },
  mounted() {
    const currentURL = window.location.pathname;

    if (currentURL.includes("registration")) {
      this.visibleForm = "registration";
    } else if (currentURL.includes("sms-confirm")) {
      this.visibleForm = "sms-confirm";
    } else {
      this.visibleForm = "login";
    }
  },
};
</script>

<style scoped>
.btn-sberid {
  display: none;
}

.login-form-content {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  border-radius: 32px;
  padding: 42px;
}

.block-registration {
  background: #f2f4f5;
  padding: 2px;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 50% 50%;
}

.block-registration button {
  border: 0;
  background: transparent;
  height: 32px;
  font-weight: 600;
  color: #686868;
}

.block-registration button.active {
  background: #fff;
  border-radius: 6px;
  color: #43b02a;
}

#esia-login {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e1e1e1;
  width: 100%;
  height: 48px;
  margin-top: 1.5rem;
  font-weight: 700;
}

#esia-login svg {
  margin-right: 8px;
}

.login_more:after,
.login_more:before {
  display: none;
}

.login_more {
  position: relative;
  font-size: 1rem;
  display: block;
}

.btn-sberid,
.btn-mobileid,
.btn-alfa {
  width: 100%;
  background: #fff;
  border: 1px solid #e1e1e1;
  height: 48px;
  border-radius: 16px;
  color: #292929;
  font-size: 1rem;
  display: block;
  font-weight: 700;
}

.alternative_login-des {
  font-weight: 400;
  margin-top: 1rem;
}

.btn-alfa svg {
  display: inline-block;
}

.btn-alfa:hover:after {
  display: none;
}

.btn-mobileid:before,
.btn-sberid:before,
.btn-alfa:before {
  display: none;
}

.login_gos {
  text-align: center;
  background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSIzIiB2aWV3Qm94PSIwIDAgOCAzIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KPHBhdGggZD0iTTEgMS41SDIzNSIgc3Ryb2tlPSIjRjBGMEYwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWRhc2hhcnJheT0iNCA0Ii8+DQo8L3N2Zz4NCg==)
    50% 50%;
  background-repeat: repeat-x;
  font-weight: 700;
  font-size: 1rem;
  font-family: "Raleway";
  text-align: center;
  color: #5d737e;
}

.login_gos span {
  text-align: center;
  padding: 0 10px;
  background: #fff;
}
</style>
