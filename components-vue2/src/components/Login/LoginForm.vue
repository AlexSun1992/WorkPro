<template>
  <div>
    <b-modal
      id="sms-confirm-modal"
      v-model="isModalVisible"
      hide-footer
      @shown="setFocusSMSCode()"
      @hidden="closeModalConfirmSMSCode"
      :centered="true"
      :static="true"
      content-class="sms-confirm-modal"
      title="Введите код"
    >
      <div>
        <div v-html="modalTextRequest" />
        <b-form id="sms-form" @submit.prevent="onSubmitWithCodeSMS">
          <b-form-input
            id="sms-code"
            ref="focusCodeSMS"
            autocomplete="off"
            placeholder="12345"
            type="number"
            :disabled="authInProcess"
            v-model="$v.user.code.$model"
            :state="isValidStateCodeSMS"
            @focus="isValidStateCodeSMS = null"
            class="form-control mt-3"
            data-testid="authSMSCode"
          ></b-form-input>
          <b-form-invalid-feedback
            >Неверный код. Попробуйте еще раз.
          </b-form-invalid-feedback>
          <div
            v-if="isCaptchaNeeded && !authInProcess && isModalVisible"
            class="mt-3 text-start"
          >
            <captcha
              @update="setIdCaptcha($event)"
              @updateCode="setCodeCaptcha($event)"
              :isCaptchaValid="this.captchaMessage"
            />
          </div>
          <div class="d-block d-lg-table">
            <b-button
              id="submit-sms-code"
              :disabled="
                authInProcess ||
                user.code === '' ||
                (isCaptchaNeeded && !user.cap)
              "
              variant="primary"
              class="mt-4 w-100"
              block
              @click="fetchToken()"
              >Продолжить
              <b-spinner v-if="authInProcess" variant="light"></b-spinner
            ></b-button>
          </div>
          <div v-if="!isRetrySendCodeSMS" class="mt-4 d-block d-lg-table">
            <button
              type="button"
              disabled="disabled"
              class="btn btn-primary w-100"
            >
              Отправить повторно(можно через
              <verify-timer
                @onFinish="isRetrySendCodeSMS = true"
                :duration="duration"
              />
              секунд)
            </button>
          </div>
          <div v-if="isRetrySendCodeSMS" class="mt-4 d-block d-lg-table">
            <b-button @click="retrySendCodeSMS()" class="w-100"
              >Отправить повторно</b-button
            >
          </div>
        </b-form>
      </div>
    </b-modal>

    <b-form id="auth-form" @submit.prevent="onSubmit">
      <div class="tab-mobile-block">Вход</div>
      <div class="row">
        <div class="col-12 col-lg-4">
          <b-form-group label="Телефон или e-mail" label-cols="12">
            <b-form-input
              autofocus
              id="phone"
              ref="phoneInput"
              v-model="$v.user.username.$model"
              placeholder="Телефон или e-mail"
              type="text"
              :state="wrongAuthData ? false : validateState('username')"
              @blur="$v.user.username.$touch()"
              @input="wrongAuthData = false"
              :disabled="authInProcess"
              class="form-control"
              data-testid="authPhoneEmail"
            >
            </b-form-input>

            <b-form-invalid-feedback v-if="this.$v.user.username.$model === ''"
              >Пожалуйста, заполните это поле</b-form-invalid-feedback
            >
          </b-form-group>
        </div>

        <div class="col-12 col-lg-4 mt-3 mt-lg-0">
          <b-form-group label="Пароль" label-cols="12">
            <b-form-input
              v-model="$v.user.password.$model"
              id="password"
              placeholder="Пароль"
              :type="pswVisible ? 'text' : 'password'"
              :state="wrongAuthData ? false : validateState('password')"
              @blur="$v.user.password.$touch()"
              @input="wrongAuthData = null"
              class="form-control"
              :disabled="authInProcess"
              data-testid="authPassword"
            ></b-form-input>
            <button
              type="button"
              class="btn-psw-visible"
              @click="visiblePSW()"
            ></button>
            <b-form-invalid-feedback v-if="this.$v.user.password.$model === ''"
              >Пожалуйста, введите пароль
            </b-form-invalid-feedback>
          </b-form-group>
        </div>

        <div class="col-12 col-lg-4 mt-3 mt-lg-3 pt-lg-1">
          <a
            href="/login/password-recovery"
            id="btn_recovery-password_lk"
            class="mt-lg-4 d-table btn-link"
            >Не помните пароль?</a
          >
        </div>

        <div class="col-12 invalid-feedback d-block mt-3" v-if="wrongAuthData">
          Неверный логин или пароль.<br />Проверьте корректность введенных
          даных.
        </div>
        <div
          class="col-12 invalid-feedback d-block mt-3"
          v-if="queryError && !wrongAuthData"
        >
          {{ queryError }}
        </div>

        <div
          v-if="isCaptchaNeeded && !authInProcess && !isModalVisible"
          class="col-12 mt-3"
        >
          <div class="ph4b mb-2">
            Слишком много попыток с вашего компьютера. Подтвердите, что вы не
            бот
          </div>
          <captcha
            @update="setIdCaptcha($event)"
            @updateCode="setCodeCaptcha($event)"
            :isCaptchaValid="this.captchaMessage"
          />
        </div>
      </div>
      <b-button
        v-on:enter="fetchToken()"
        variant="primary"
        type="submit"
        :disabled="authInProcess"
        class="mt-3 mt-lg-4"
        id="btn_entry_lk"
      >
        Авторизоваться
        <b-spinner v-if="authInProcess" variant="light"></b-spinner>
      </b-button>
    </b-form>
  </div>
</template>

<script>
import axios from "axios";
import {
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BSpinner,
  BButton,
  BModal,
  BRow,
} from "bootstrap-vue";

import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import _ from "lodash";
import Captcha from "./Captcha/Captcha";
import VerifyTimer from "./Libs/VerifyUser/VerifyTimer";
import {
  getRestructuredPhoneNumber,
  removeNotNumberElements,
} from "./loginForm.helper";

export default {
  name: "LoginForm",
  components: {
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BSpinner,
    BButton,
    BModal,
    BRow,
    VerifyTimer,
    Captcha,
  },
  mixins: [validationMixin],

  data() {
    return {
      user: {
        username: "",
        password: "",
        code: "",
        cap: "",
        capid: null,
      },
      wrongAuthData: null,
      captchaMessage: null,
      modalTextRequest: "",
      duration: 60,
      isUsernameBlured: true,
      isPasswordBlured: true,
      isValidStateCodeSMS: null,
      isValidStateCodeCaptcha: null,
      isRetrySendCodeSMS: false,
      isSendingCodeSMS: false,
      isCaptchaNeeded: false,
      isModalVisible: false,
      autofocus: true,
      placeholder: "Телефон или почта",
      errorMessage: null,
      authInProcess: false,
      pswVisible: false,
      captchaToken: null,
      loginTouchesCount: 0,
    };
  },
  mounted() {
    const attempt = new URL(window.location.href);
    const isAuthorizationCookie = /Bearer/.test(document.cookie);
    if (isAuthorizationCookie && !attempt.searchParams.has("ref")) {
      window.location.href = "/cabinet";
    }
    this.$nextTick(() => {
      if (typeof this.$LogEvent === "function") {
        const currentURL = window.location.pathname;
        if (!currentURL.includes("registration")) {
          this.$LogEvent({
            formName: "Authorization",
            idEventType: 2,
            controlName: "LoginForm.vue",
            message: "Просмотр страницы Авторизации",
            timeUser: new Date(),
          });
        }
      }
    });
  },
  created() {
    this.debouncedUpdate = _.debounce(this.blurField, 100);
    // eslint-disable-next-line nuxt/no-globals-in-created
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    if (params?.error) {
      this.errorMessage = params?.error;
    }
  },

  watch: {
    isCaptchaNeeded(newValue) {
      if (newValue === false) {
        this.user.capid = null;
        this.user.cap = null;
      }
    },
  },

  methods: {
    visiblePSW() {
      if (this.pswVisible === false) {
        this.pswVisible = true;
      } else {
        this.pswVisible = false;
      }
    },
    setIdCaptcha(id) {
      this.user.capid = id;
    },
    setCodeCaptcha(code) {
      this.user.cap = code;
    },

    async fetchToken() {
      this.$v.user.username.$touch();
      this.$v.user.password.$touch();
      if (
        this.$v.user.username.$model === "" ||
        this.$v.user.password.$model === ""
      ) {
        return;
      }
      try {
        this.authInProcess = true;
        const getValidPhoneNumber = getRestructuredPhoneNumber(
          this.$v.user.username.$model
        );

        let body = {
          mode: 2,
          password: this.$v.user.password.$model,
          username: this.$v.user.username.$model.includes("@")
            ? this.$v.user.username.$model
            : getValidPhoneNumber,

          cap: this.user.cap || null,
          capid: this.user.capid || null,
        };

        if (this.user.code !== "" && this.isSendingCodeSMS === false) {
          body = {
            ...body,
            code: this.$v.user.code.$model,
          };
        }

        const headers = {
          headers: { "X-Application": "VueJS" },
        };

        const {
          data: { ACCESS_TOKEN, REFRESH_TOKEN, ID },
        } = await axios.post("/am/authw/v2/authorize", body, headers);

        this.isModalVisible = false;
        document.cookie = `auth.strategy=local; Path=/; expires=${new Date(
          new Date().getTime() + 1000 * 60 * 60 * 24 * 365
        ).toGMTString()}`;
        document.cookie = `auth._token.local=Bearer%20${ACCESS_TOKEN}; Path=/; expires=${new Date(
          new Date().getTime() + 1000 * 60 * 60 * 24 * 365
        ).toGMTString()}`;
        document.cookie = `auth._refresh_token.local=${REFRESH_TOKEN}; Path=/; expires=${new Date(
          new Date().getTime() + 1000 * 60 * 60 * 24 * 365
        ).toGMTString()}`;
        document.cookie = `auth.user_id=${ID}; Path=/; expires=${new Date(
          new Date().getTime() + 1000 * 60 * 60 * 24 * 365
        ).toGMTString()}`;
        this.authInProcess = false;
        window.location.href = "/cabinet/55/0/701";
        const attempt = new URL(window.location.href);

        if (attempt.searchParams.has("ref")) {
          window.location.href = `${attempt.searchParams.get("ref")}`;
        }
      } catch (e) {
        this.authInProcess = false;
        const data = e.response?.data;
        if (data) {
          this.captchaMessage =
            data.CODENAME === "CaptchaInvalid" ||
            data.CODENAME === "CaptchaRequest"
              ? data.MESSAGE
              : null;

          if (data.CODENAME === "CaptchaRequest") {
            this.isCaptchaNeeded = true;
          }
          if (data.CODENAME === "PhoneCodeRequest") {
            this.modalTextRequest = `${data.MESSAGE}`;
            this.wrongAuthData = null;
            this.isModalVisible = true;
            return;
          }
          if (data.CODENAME === "InvalidPhoneCode") {
            this.isValidStateCodeSMS = false;
            return;
          }
          if (data.CODENAME === "Invalid") {
            this.wrongAuthData = true;
            return;
          }
        }

        if (e?.response?.data.CODE === 105) {
          this.isValidStateCodeSMS = false;
          this.user.code = "";
          return;
        }

        this.errorMessage = `Неверный телефон или пароль`;
      }
      if (typeof this.$LogEvent === "function") {
        this.$LogEvent({
          formName: "Authorization",
          idEventType: this.$v.user.code.$model ? 45 : 4,
          controlName: "Button",
          message: `Нажал на кнопку "${
            this.$v.user.code.$model ? "Продолжить" : "Авторизоваться"
          }"`,
          timeUser: new Date(),
        });
      }
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.user[name];
      return $dirty ? !$error : null;
    },
    setFocusSMSCode() {
      this.$refs.focusCodeSMS.focus();
    },
    retrySendCodeSMS() {
      this.isSendingCodeSMS = true;
      this.fetchToken().finally(() => {
        this.isSendingCodeSMS = false;
        this.isRetrySendCodeSMS = false;
      });
    },
    closeModalConfirmSMSCode(e) {
      this.isValidStateCodeSMS = false;
      this.isRetrySendCodeSMS = false;
      this.user.code = "";
    },

    blurField(field) {
      this.$v.user[field].$touch();
    },

    onSubmit() {
      this.fetchToken();
    },
    onSubmitWithCodeSMS() {
      if (this.user.code !== "") {
        this.fetchToken();
      }
    },
  },
  computed: {
    queryError() {
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop.toString()),
      });
      if (params?.error) {
        return params.error;
      }
      return false;
    },
  },

  validations: {
    user: {
      username: {
        required,
      },

      password: {
        required,
      },
      code: {
        required,
      },
    },
  },
};
</script>

<style>
.dropdown-select {
  position: relative;
  z-index: 1;
}
.btn-dropdown-select {
  background-color: #fff;
  border: 1px solid #c3c3c3;
  box-sizing: border-box;
  border-radius: 15px !important;
  width: 100%;
  padding: 13px 20px;
  font-size: 1rem;
  height: 54px;
  outline: 0 !important;
  color: #000;
  cursor: pointer;
  text-align: left;
}
.dropdown-menu {
  display: none;
}
.dropdown-menu.show {
  display: block;
}

ul.dropdown-menu.show {
  margin: 0;
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 0;
  box-sizing: border-box;
  max-height: 296px;
  overflow-y: auto;
  background: #fff;
  list-style: none;
  box-shadow: 0 2px 2px rgb(0, 0, 0, 0.16);
  width: 100%;
  margin-top: 4px !important;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
  outline: none !important;
}
.dropdown-menu.show li {
  transition: 0.2s;
  cursor: pointer;
  cursor: default;
  overflow: hidden;
  background: #fff;
  white-space: initial;
  font-size: 1rem;
  cursor: default;
  padding: 12px 20px 12px 15px !important;
}
.dropdown-item {
  display: block;
  width: 100%;
  background: transparent;
  border: 0;
  text-align: left;
}
.dropdown-item:hover,
.dropdown-item:hover > button {
  background: #f4f7f5 !important;
}

.dropdown-menu.show li:hover {
  background: #f4f7f5;
}
@media (max-width: 992px) {
  .btn-dropdown-select {
    height: 50px;
  }
}
</style>
