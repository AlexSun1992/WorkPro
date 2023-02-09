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
          :autofocus="!formData"
          :state="validateInput(loginType, isUserBlured)"
          :placeholder="placeholder"
          :disabled="disabled"
          @click="loginTouchesCount = 2"
          autocomplete="off"
        ></b-form-input>
        <b-form-invalid-feedback :state="validateInput(loginType, isUserBlured)"
          >Обязательное поле</b-form-invalid-feedback
        >
      </b-form-group>
    </div>
    <div class="col-12 col-lg-4 mt-3 mt-lg-0" v-if="codeFieldShown">
      <b-form-group label="Код подтверждения">
        <b-form-input
          id="sms-confirm"
          autofocus
          ref="codeInput"
          v-model="v.code.$model"
          v-mask="codeMask"
          :state="validateInput('code', isCodeBlured)"
          @blur="blurField('code', isCodeBlured)"
          @update="updateField('code')"
          @change="changeField('code')"
          @input="inputTouch(loginType)"
          :disabled="loading"
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
    <div class="col-12 col-lg-4 mt-3 mt-lg-btn-small_hl">
      <b-button
        type="submit"
        :disabled="isDisabledButtonGetCode"
        @click="getCode()"
        variant="secondary"
        class="btn-small w-100 p-0"
        id="btn_code_verification_lk"
      >
        <span v-if="!isSendCode">Получить код</span>
        <template v-if="isSendCode"
          >Получить код (<verify-timer
            @onFinish="stopTimer"
            :duration="duration"
          />
          с)</template
        >
      </b-button>
    </div>
    <vue-recaptcha
      ref="recaptcha"
      size="invisible"
      :load-recaptcha-script="true"
      :sitekey="siteKey"
      @verify="getCode"
      @expired="onCaptchaExpired"
    />
    <div v-if="successMessage && codeFieldShown">
      <div id="verify-success-message" class="success-feedback mt-3">
        {{ successMessage }}
      </div>
    </div>
    <div
      id="verify-error-message"
      class="col-12 invalid-feedback d-block mt-3"
      v-if="errorMessage"
    >
      {{ errorMessage }}
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
  BButton,
} from "bootstrap-vue";
import VerifyTimer from "../VerifyUser/VerifyTimer.vue";
import { isCaptchaBecomesHide } from "../VerifyUser/captcha.helper";
import {
  getMessageFromSuccessResponse,
  isAlertShouldBeShown,
} from "../VerifyUser/verifyUser.helper";

export default {
  components: {
    VerifyTimer,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    VueRecaptcha,
    BButton,
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
    "error",
    "isError",
    "isCodeFieldValid",
    "logParams",
    "formData",
    "isValidForm",
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
      allHiddenCaptchas: null,
      meassageWasSend: null,
      errorMessage: null,
      successMessage: null,
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
    removeErrorTextMessage() {
      this.errorMessage = null;
    },
    updateField(field) {
      this.$emit("checkCodeFieldValid", this.validateState(field));
    },
    changeField(field) {
      this.isUserBlured = false;
      if (this.validateState(field)) {
        this.$LogEvent({
          ...this.logParams,
          controlName: field,
          message: `Поле ${field} посещено`,
          timeUser: new Date(),
        });
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
        this.$emit("sendingCode", false);
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
    async getCodeHelper(params) {
      try {
        const headers = {
          headers: { recaptcha: params.token, "X-Application": "VueJS" },
        };
        if (
          this.loginType !== undefined &&
          (this.modeType === "REG" || this.modeType === "RECOVERY")
        ) {
          const getMethod = () => {
            if (params.error === true && this.loginType === "phone") {
              return "registerUser1captcha";
            }
            if (params.error === false && this.loginType === "phone") {
              return "registerUser1";
            }
            return null;
          };
          const method = getMethod();
          const getURL = () => {
            if (this.loginType === "phone") {
              return (
                `/am/free/v2/${method}` +
                `${this.modeType === "RECOVERY" ? `?smstype=recovery` : ``}`
              );
            }
            return null;
          };
          const response = await axios.post(getURL(), params, headers);

          const getSuccessSendMessageText =
            getMessageFromSuccessResponse(response);
          if (getSuccessSendMessageText !== undefined) {
            this.$emit("messageText", getSuccessSendMessageText);
          }
          return response;
        }
        return null;
      } catch (e) {
        this.loading = false;
        this.$emit("error", e.response.data.INFO);
        return e?.response;
      }
    },
    async getCode(token = null) {
      this.successMessage = null;
      this.errorMessage = null;
      this.isPhoneChanged = false;
      this.loading = true;
      this.$emit("error", null);
      this.errorMessage = null;
      this.$emit("sendingCode", true);

      try {
        let response;
        const isCaptcha = Boolean(token);
        const request = async (p) => {
          const data = await this.getCodeHelper(p);
          return data;
        };
        if (
          this.loginType === "phone"
            ? !this.v.phone.$invalid
            : !this.v.email.$invalid
        ) {
          let params = this.getCodeParams(this.loginType);

          if (isCaptcha === false) {
            params = {
              ...params,
              token: 1,
              modeType: this.modeType,
              error: false,
            };

            const headers = {
              headers: { recaptcha: params.token, "X-Application": "VueJS" },
            };

            const response1 = await request(params, headers);

            response = response1;
            const getResponseMessageCodeErr = response?.data[0]?.ERRORCODE;
            const isAlertShown = isAlertShouldBeShown(
              this.modeType,
              this.loginType,
              getResponseMessageCodeErr
            );
            if (isAlertShown) {
              this.errorMessage =
                response?.data[0]?.ERRORLIST[0].ERRORTEXT.replace(
                  /^\[|\]$/g,
                  ""
                ) ?? "Неизвестная ошибка";
              this.isSendCode = false;
              this.$LogEvent({
                formName: "VerifyUser errorMessage",
                idEventType: this.loginType ? 155 : 162,
                controlName: "VerifyUser.vue",
                message: `Показало сообщение об ошибке на ${
                  this.loginType === "phone" ? "номере" : "EMAIL"
                }"`,
                timeUser: new Date(),
              });
              return;
            }

            if (response1.data[0].MESSAGE_CODE === 200) {
              this.loading = false;
              this.isSendCode = true;
              this.successMessage = response?.data[0]?.MESSAGE;
            }

            if (response1.data.STATUS === 500) {
              this.loading = false;
              this.isSendCode = false;
              this.errorMessage = response1.data?.INFO ?? "Неизвестная ошибка";
              this.$LogEvent({
                formName: "VerifyUser errorMessage",
                idEventType: this.loginType ? 155 : 162,
                controlName: "VerifyUser.vue",
                message: `Показало сообщение об ошибке на ${
                  this.loginType === "phone" ? "номере" : "EMAIL"
                }"`,
                timeUser: new Date(),
              });
              return;
            }

            if (response1?.data[0]?.ERRORCODE === 106) {
              await this.executeRecaptcha();
              return;
            }
          } else {
            params = {
              ...params,
              token,
              modeType: this.modeType,
              error: true,
            };
            const headers = {
              headers: { recaptcha: params.token, "X-Application": "VueJS" },
            };
            const response2 = await request(params, headers);
            response = response2;

            const getResponseMessageCodeErr = response?.data[0]?.ERRORCODE;

            const isAlertShown = isAlertShouldBeShown(
              this.modeType,
              this.loginType,
              getResponseMessageCodeErr
            );
            if (isAlertShown) {
              this.errorMessage =
                response?.data[0]?.ERRORLIST[0].ERRORTEXT.replace(
                  /^\[|\]$/g,
                  ""
                ) ?? "Неизвестная ошибка";
              this.isSendCode = false;
              this.$LogEvent({
                formName: "VerifyUser errorMessage",
                idEventType: this.loginType ? 155 : 162,
                controlName: "VerifyUser.vue",
                message: `Показало сообщение об ошибке на ${
                  this.loginType === "phone" ? "номере" : "EMAIL"
                }"`,
                timeUser: new Date(),
              });
              return;
            }
            if (response2?.status === 500 || response2?.data[0]?.ERRORCODE) {
              this.loading = false;
              this.isSendCode = false;
            } else {
              this.loading = false;
              this.isSendCode = true;
              this.successMessage = response?.data[0]?.MESSAGE;
            }
          }
          const isError = Boolean(
            response?.data[0]?.ERRORCODE || response.data.STATUS === 500
          );
          const isErrorList = Boolean(response?.data[0]?.ERRORLIST);

          const isInSystemLogin = response?.data[0]?.MESSAGE_CODE === 201;
          const isExpiredLogin = response?.data[0]?.MESSAGE_CODE === 202;
          const getResponseMessageCode = response?.data[0]?.MESSAGE_CODE;
          const codeToken = response?.data[0]?.GUID;

          if (isError === false) {
            if (
              this.modeType === "REG" &&
              this.loginType === "phone" &&
              (getResponseMessageCode === 201 || getResponseMessageCode === 204)
            ) {
              this.$bvModal
                .msgBoxConfirm(
                  "Личный кабинет с указанным номером телефона уже существует.",
                  {
                    title: "Номер уже зарегистрирован",
                    size: "md",
                    okVariant: "secondary",
                    cancelVariant: "primary",
                    okTitle: isInSystemLogin
                      ? "Восстановить пароль"
                      : "Обратитесь в техподдержку",
                    cancelTitle: "Обратитесь в техподдержку",
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
                      window.location.href = "/login/password-recovery";
                    }
                    if (isExpiredLogin) {
                      this.isSendCode = true;
                    }
                  }
                  if (value === false) {
                    window.location.href = "/feedback";
                  }
                  this.loading = false;
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              this.loading = false;
              this.isSendCode = true;
              if (codeToken) {
                this.$emit("sendCode", codeToken);
              }
            }
          } else if (isErrorList === true) {
            if (response?.data[0]?.ERRORCODE === 106) return;
            this.errorMessage =
              response?.data[0]?.ERRORLIST[0].ERRORTEXT.replace(
                /^\[|\]$/g,
                ""
              ) ?? "Неизвестная ошибка";
            this.$LogEvent({
              formName: "VerifyUser errorMessage",
              idEventType: this.loginType ? 155 : 162,
              controlName: "VerifyUser.vue",
              message: `Показало сообщение об ошибке на ${
                this.loginType === "phone" ? "номере" : "EMAIL"
              }"`,
              timeUser: new Date(),
            });
          }
        } else {
          this.isUserDisabled = false;
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
        this.$emit("sendingCode", false);
      }
      this.$LogEvent({
        formName: "VerifyUser",
        idEventType: this.loginType === "phone" ? 155 : 162,
        controlName: "PasswordRecoveryForm.vue",
        message: `Нажал на кнопку "Получить код через ${
          this.loginType === "phone" ? "номер" : "EMAIL"
        }"`,
        timeUser: new Date(),
      });
    },

    getCodeParams() {
      let params;
      if (this.loginType === "phone") {
        params = {
          ...this.formData,
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
      this.$emit("checkCodeFieldValid", false);
      this.$emit("sendCode", false);
      this.$emit("error", null);
      this.errorMessage = null;
      this.isUserBlured = false;
      this.v.phone.$model = "";
      this.$refs.userInput.$el.disabled = false;
      this.$refs.userInput.$el.focus();
      this.v.code.$model = null;
      this.isUserDisabled = false;
      this.isPhoneChanged = true;
      this.$emit("isPhoneChangedButtonClicked", this.isPhoneChanged);
      this.isSendCode = false;
      this.$LogEvent({
        formName: "VerifyUser",
        idEventType: this.loginType === "phone" ? 156 : 161,
        controlName: "VerifyUser.vue",
        message: `Нажал на кнопку "Изменить ${
          this.loginType === "phone" ? "номер" : "EMAIL"
        }"`,
        timeUser: new Date(),
      });
    },

    validateInput(field) {
      if (field === "code" && this.isCodeError) {
        return false;
      }
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
    isCodeError() {
      if (this.error) {
        return this.error.includes("код подтверждения");
      }
      return false;
    },
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
    isDisabledButtonGetCode() {
      if (this.loginType === "phone") {
        if (this.v.phone.$invalid) {
          return true;
        }
        if (this.isValidForm === false) {
          return true;
        }
        if (this.isSendCode) {
          return true;
        }
        if (this.loading) {
          return true;
        }
      } else {
        return this.v.email.$invalid || this.isSendCode || this.loading;
      }
      return false;
    },
    labelChangeButton() {
      if (this.formData) {
        return "Изменить данные";
      }
      return this.loginType === "phone" ? "Изменить номер" : "Изменить E-mail";
    },
    codeFieldShown() {
      return Boolean(this.formData?.GUID);
    },
  },
  watch: {
    errorMessage(value) {
      const isPhoneExist = value.includes(
        "В Личном кабинете отсутствует профиль с данным номером телефона"
      );
      this.$LogEvent({
        formName: "VerifyUser errorMessage",
        idEventType: this.loginType ? 155 : 162,
        controlName: "VerifyUser.vue",
        message: `Показало сообщение об ошибке на ${
          this.loginType === "phone" ? "номере" : "EMAIL"
        }"`,
        timeUser: new Date(),
      });
      const isMailExist = value.includes(
        "На указанный email отсутствует зарегистрированная уч.запись"
      );
      if (isPhoneExist || isMailExist) {
        this.loading = false;
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
.success-feedback {
  background: #edf8ea;
  border-radius: 15px;
  padding: 24px;
}
// @import "~/assets/scss/reg.scss";
</style>
