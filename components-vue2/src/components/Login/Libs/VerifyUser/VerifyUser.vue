<template>
  <div class="row">
    <div class="col-12 col-lg-4">
      <b-form-group class="required">
        <legend v-if="loginType === 'phone'">Телефон</legend>
        <b-form-input
          id="phone"
          v-if="loginType === 'phone'"
          ref="userInput"
          v-model="v[loginType].$model"
          v-mask="changeMask"
          @change="changeField('phone')"
          autofocus
          :state="validateInput(loginType, isUserBlured)"
          :placeholder="placeholder"
          :disabled="isSendCode || loading"
          @blur="debouncedUpdate(loginType, isUserBlured)"
          @click="loginTouchesCount = 2"
          autocomplete="off"
          :tabindex="tabIndex[1]"
        ></b-form-input>
        <legend v-if="loginType === 'email'">Почта</legend>
        <b-form-input
          v-if="loginType === 'email'"
          ref="userInput"
          v-model="v[loginType].$model"
          autofocus
          :state="validateInput(loginType, isUserBlured)"
          placeholder="E-mail"
          :disabled="isSendCode || loading"
          @blur="debouncedUpdate(loginType, isUserBlured)"
          @change="changeField('email')"
          @click="loginTouchesCount = 2"
          @keyup.enter="verifyUser"
          autocomplete="off"
          :tabindex="tabIndex[0]"
          id="email"
        ></b-form-input>

        <b-form-invalid-feedback v-if="!v.email"
          >Пожалуйста, заполните это поле</b-form-invalid-feedback
        >
        <b-form-invalid-feedback v-if="v.email && v.email.$model === ''"
          >Пожалуйста, заполните это поле</b-form-invalid-feedback
        >

        <b-form-invalid-feedback
          v-if="v.email && v.email.forbiddenRussianSign === false"
          >Русские символы запрещены
        </b-form-invalid-feedback>

        <b-form-invalid-feedback v-if="v.email && v.email.email === false"
          >Пожалуйста, введите корректный email</b-form-invalid-feedback
        >

        <b-form-invalid-feedback
          v-if="v.email && v.email.forbiddenPlusSign === false"
        >
          Знак '+' запрещен
        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <div class="col-12 col-lg-4 mt-3 mt-lg-0" v-if="codeFieldShown">
      <b-form-group label="Код подтверждения">
        <b-form-input
          id="sms-confirm"
          autofocus
          ref="codeInput"
          v-model="v.code.$model"
          class="mb-2"
          v-mask="codeMask"
          :state="validateInput('code', isCodeBlured)"
          @blur="blurField('code', isCodeBlured)"
          @update="updateField('code')"
          @change="changeField('code')"
          @input="inputTouch(loginType)"
          :disabled="disabled"
          autocomplete="off"
          placeholder="Код подтверждения"
        ></b-form-input>
        <b-form-invalid-feedback v-if="!v.code.$model"
          >Пожалуйста, заполните это поле</b-form-invalid-feedback
        >
        <b-form-invalid-feedback v-else
          >Неверный код подтверждения</b-form-invalid-feedback
        >
      </b-form-group>
    </div>
    <div class="col-12 col-lg-4 mt-3 pt-lg-1">
      <button
        v-if="isSendCode"
        @click="changeNumber"
        class="btn-link mt-lg-4 d-table"
        type="button"
      >
        {{ loginType === "phone" ? "Изменить номер" : "Изменить email" }}
      </button>
    </div>

    <vue-recaptcha
      ref="recaptcha"
      size="invisible"
      :load-recaptcha-script="true"
      :sitekey="siteKey"
      @verify="setToken"
      @expired="onCaptchaExpired"
    />
    <div class="col-12 mt-4">
      <b-button
        type="submit"
        :disabled="
          (loginType === 'phone' ? v.phone.$invalid : v.email.$invalid) ||
          isSendCode ||
          loading
        "
        @click="executeRecaptcha"
        variant="primary"
        id="btn_code_verification_lk"
        :tabindex="tabIndex[2]"
        v-if="!isCodeFieldValid"
      >
        <span v-if="!isSendCode">Получить код</span>
        <template v-if="isSendCode"
          >Отправить повторно можно через
          <verify-timer @onFinish="stopTimer" :duration="duration" />
          сек.</template
        >
      </b-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";
import { mask } from "vue-the-mask";
import VueRecaptcha from "vue-recaptcha";
import {
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BRow,
  BButton,
  BLink,
  BSpinner,
} from "bootstrap-vue";
import VerifyTimer from "./VerifyTimer.vue";
import { isCaptchaBecomesHide } from "./captcha.helper";
import { getMessageFromSuccessResponse } from "./verifyUser.helper";

export default {
  components: {
    VerifyTimer,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BRow,
    VueRecaptcha,
    BLink,
    BButton,
    BSpinner,
  },

  directives: { mask },
  props: [
    "count",
    "v",
    "validateState",
    "disabled",
    "loginType",
    "modeType",
    "label",
    "context",
    "textMessage",
    "tabIndex",
    "error",
    "isError",
    "isCodeFieldValid",
    "logParams",
  ],

  data() {
    return {
      isSendCode: false,
      isUserBlured: true,
      isCodeBlured: true,
      code: 1,
      isUserDisabled: false,
      timer: null,
      isPhoneChanged: false,
      mask: "",
      codeMask: "#####",
      placeholder: "+7(___)-___-__-__",
      loginTouchesCount: 0,
      token: 1,
      myclass: ["cabinet verifyuser"],
      duration: 60,
      siteKey: "6LcR59kUAAAAAN9gdxm2TWPCTey73RTAKGIOkTTV",
      loading: false,
      codeFieldShown: false,
      allHiddenCaptchas: null,
      meassageWasSend: null,
    };
  },

  created() {
    this.debouncedUpdate = _.debounce(this.blurField, 100);
    this.debouncedGetCode = _.debounce(this.getCode, 100);
  },

  updated() {
    if (this.$refs.userInput.vModelValue.length === 4) {
      if (document.querySelector(".app_body")?.children) {
        this.allHiddenCaptchas = Array.from(
          document.querySelector(".app_body").children
        ).filter((item) => item.style.visibility === "hidden");
      }
    }
  },

  methods: {
    updateField(field) {
      this.$emit("checkCodeFieldValid", this.validateState(field));
    },
    changeField(field) {
      this.isUserBlured = false;
      if (this.validateState(field)) {
        // this.$LogEvent({
        //   ...this.logParams,
        //   message: `Поле ${field} заполнено`,
        //   timeUser: new Date(),
        // });
      }
    },
    async executeRecaptcha() {
      this.loading = true;
      await this.$refs.recaptcha.reset();
      await this.$refs.recaptcha.execute();
      await isCaptchaBecomesHide();
      const visibleCaptchas = Array.from(document.querySelectorAll("body>div"))
        .filter((elem) => elem.querySelector("iframe[title*='reCAPTCHA']"))
        .filter((item) => item.style.visibility === "visible");

      if (visibleCaptchas.length === 0) {
        this.loading = false;
      }
    },

    inputTouch() {
      this.isUserBlured = false;
      if (this.v.code.$invalid === false) {
        this.$emit("getLoginType", this.loginType);
      } else {
        this.$emit("getLoginType", null);
      }
    },

    onCaptchaExpired() {
      this.$refs.recaptcha.reset();
    },

    setToken(recaptcha) {
      this.token = recaptcha;
    },
    async getCodeHelper(params) {
      try {
        const headers = {
          headers: { recaptcha: this.token },
        };
        if (
          this.loginType === "phone" ||
          this.modeType === "REG" ||
          this.modeType === "RECOVERY"
        ) {
          const method = params.error ? "sendsmscode2" : "sendsmscode";

          const response = await axios.post(
            `/free/v2/${method}` +
              `${this.modeType === "RECOVERY" ? `?smstype=recovery` : ``}`,
            params,
            headers
          );

          const getSuccessSendMessageText =
            getMessageFromSuccessResponse(response);
          // Получение сообщения об отправке на номер телефона

          if (getSuccessSendMessageText !== undefined) {
            this.$emit("messageText", getSuccessSendMessageText);
          }
          return response;
        }
        return await axios.post("/free/v2/sendemailcode", params, headers);
      } catch (e) {
        this.loading = false;
        this.$emit("error", e.response.data.INFO);
      }
    },

    async getCode() {
      this.v.code.$model = null;
      this.codeFieldShown = false;
      this.isPhoneChanged = false;
      this.$emit("error", null);
      try {
        if (
          this.loginType === "phone"
            ? !this.v.phone.$invalid
            : !this.v.email.$invalid
        ) {
          let params = this.getCodeParams(this.loginType);
          params = { ...params, token: 1, modeType: this.modeType };
          const response = await this.getCodeHelper(params);
          if (response.data[0].MESSAGE_CODE === 200) {
            this.codeFieldShown = true;
            this.loading = false;
            this.isSendCode = true;
          }
          if (response.data.STATUS === 500) {
            this.loading = false;
            this.isSendCode = false;
            this.$emit("error", response.data.INFO);
            return;
          }

          if (response?.data[0]?.ERRORCODE === 106) {
            params = {
              ...params,
              token: this.token,
              modeType: this.modeType,
              error: true,
            };
            const response = await this.getCodeHelper(params);
            if (response?.data[0]?.ERRORLIST) {
              this.loading = false;
              this.isSendCode = false;
              this.$emit("error", response?.data[0]?.ERRORLIST[0].ERRORTEXT);
            } else {
              this.codeFieldShown = true;
              this.loading = false;
              this.isSendCode = true;
            }
          }
          const isError = Boolean(response?.data[0]?.ERRORCODE);
          const isErrorList = Boolean(response?.data[0]?.ERRORLIST);
          const isInSystemLogin = response?.data[0]?.MESSAGE_CODE === 201;
          const isExpiredLogin = response?.data[0]?.MESSAGE_CODE === 202;
          if (isError === false) {
            if (
              this.modeType === "REG" &&
              this.loginType === "phone" &&
              (isInSystemLogin || isExpiredLogin)
            ) {
              this.$bvModal
                .msgBoxConfirm(
                  "Введенный Вами мобильный номер уже есть в системе.",
                  {
                    title: "Номер уже зарегистрирован",
                    size: "md",
                    okVariant: "secondary",
                    cancelVariant: "primary",
                    okTitle: isInSystemLogin
                      ? "Восстановить пароль"
                      : "Продолжить регистрацию",
                    cancelTitle: "Войти в систему",
                    footerClass: "p-2",
                    hideHeaderClose: false,
                    centered: true,
                    modalClass: this.myclass,
                    autoFocusButton: "ok",
                  }
                )
                .then((value) => {
                  if (value === true) {
                    if (isInSystemLogin) {
                      this.changeNumber();
                    }
                    if (isExpiredLogin) {
                      this.isSendCode = true;
                    }
                  }
                  if (value === false) {
                    window.location.href = "/login";
                  }
                  this.loading = false;
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              this.codeFieldShown = true;
              this.loading = false;
              this.isSendCode = true;
            }
          } else if (isErrorList === true) {
            if (response?.data[0]?.ERRORCODE === 106) return;
            this.$emit(
              "error",
              response?.data[0]?.ERRORLIST[0].ERRORTEXT.replace(/^\[|\]$/g, "")
            );
          }
        } else {
          this.isUserDisabled = false;
        }
      } catch (e) {
        this.loading = false;
        console.log(e);
      }
    },

    getCodeParams(loginType) {
      let params;
      if (this.loginType === "phone") {
        params = {
          PHONE: this.v.phone.$model,
          loginType: "phone",
        };
      } else {
        params = {
          EMAIL: this.v.email.$model,
          loginType: "email",
        };
      }
      return params;
    },

    async showForm() {
      if (!this.$v.user.$invalid) {
        this.isUserDisabled = true;
      }
    },

    changeNumber() {
      this.codeFieldShown = false;
      this.$emit("checkCodeFieldValid", false);
      this.$emit("error", null);
      this.isUserBlured = false;
      this.v.phone.$model = "";
      this.$refs.userInput.$el.disabled = false;
      this.$refs.userInput.$el.focus();
      this.v.code.$model = null;
      this.isUserDisabled = false;
      this.isPhoneChanged = true;
      this.$emit("isPhoneChangedButtonClicked", this.isPhoneChanged);
      this.isSendCode = false;
    },

    validateInput(field) {
      return this.validateState(field);
    },

    blurField(field) {
      this.v[field].$touch();
    },

    stopTimer() {
      this.isSendCode = false;
    },
  },

  computed: {
    changeMask() {
      if (this.loginType === "phone") {
        this.placeholder = "+7(___)-___-__-__";
        return (this.mask = "+7(###)-###-##-##");
      }
      this.placeholder = "";
      return (this.mask = "X".repeat(50));
    },
    isShowCodeEnter() {
      if (this.loginType === "phone") {
        return !this.v.phone.$invalid && this.isSendCode;
      }
      return !this.v.email.$invalid && this.isSendCode;
    },
  },
  watch: {
    token() {
      if (this.token) {
        this.getCode();
      }
    },

    isError(value) {
      if (typeof value === "string") {
        this.loading = false;
      }
    },

    error() {
      this.loading = false;
    },
  },
  destroyed() {
    this.isSendCode = false;
  },
};
</script>

<style>
.alert {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.mx-datepicker {
  width: 100% !important;
}
.mx-datepicker .button-datapicker {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  background: url(/img/button-datapicker.svg) 50% 50% no-repeat;
  background-size: 16px;
  border: 0 !important;
  width: 28px;
}
.mx-datepicker .input-group > div {
  width: 100%;
}
.mx-datepicker .form-control.is-invalid,
.mx-datepicker .form-control.is-valid {
  background: #fff;
}
/*.form-group {*/
/*  margin: 0 !important;*/
/*}*/
.btn-success {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid #28a745;
  border-radius: 0.25rem;
  color: #fff;
  background-color: #28a745;
  padding: 0 15px;
  font-size: 1.125rem;
  font-weight: 500;
}

.btn-success:disabled {
  opacity: 0.6;
  pointer-events: none;
}
.btn-sms {
  font-size: 1rem;
  font-weight: 400;
}
</style>
<style scoped lang="scss">
// @import "~/assets/scss/reg.scss";
</style>
