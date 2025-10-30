<template>
  <div class="row">
    <div class="col-12 col-lg-4">
      <b-form-group class="required">
        <legend v-if="loginType === 'phone'">Телефон</legend>
        <b-form-input
          id="phone"
          v-if="loginType === 'phone'"
          type="tel"
          ref="userInput"
          v-model="propModel"
          v-mask="changeMask"
          @change="changeField('phone')"
          :autofocus="!formData"
          :state="validateInput(loginType, isUserBlured)"
          :placeholder="placeholder"
          :disabled="isSendCode || loading"
          @blur="debouncedUpdate(loginType, isUserBlured)"
          @click="loginTouchesCount = 2"
          @input="removeErrorTextMessage"
          autocomplete="username"
          :tabindex="tabIndex[1]"
        ></b-form-input>
        <legend v-if="loginType === 'email'">Почта</legend>
        <b-form-input
          v-if="loginType === 'email'"
          ref="userInput"
          v-model="propModel"
          type="email"
          autofocus
          :state="validateInput(loginType, isUserBlured)"
          placeholder="E-mail"
          :disabled="isSendCode || loading"
          @blur="debouncedUpdate(loginType, isUserBlured)"
          @change="changeField('email')"
          @input="removeErrorTextMessage"
          @click="loginTouchesCount = 2"
          @keyup.enter="verifyUser"
          autocomplete="username"
          :tabindex="tabIndex[0]"
          id="email"
        ></b-form-input>

        <b-form-invalid-feedback v-if="!v.email || v.email.$model === ''"
          >Пожалуйста, заполните это поле</b-form-invalid-feedback
        >

        <b-form-invalid-feedback v-if="v.email && v.email.forbiddenRussianSign === false"
          >Русские символы запрещены
        </b-form-invalid-feedback>

        <b-form-invalid-feedback v-if="v.email && v.email.email === false"
          >Пожалуйста, введите корректный e-mail</b-form-invalid-feedback
        >

        <b-form-invalid-feedback v-if="v.email && v.email.forbiddenPlusSign === false">
          Знак '+' запрещен
        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <div
      class="col-12 col-lg-4 mt-3 mt-lg-0"
      v-if="codeFieldShown"
    >
      <b-form-group label="Код подтверждения">
        <b-form-input
          id="sms-confirm"
          type="tel"
          autofocus
          ref="codeInput"
          v-model="codeModel"
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
        <b-form-invalid-feedback v-if="!v.code.$model">Пожалуйста, заполните это поле</b-form-invalid-feedback>
        <b-form-invalid-feedback v-else>Неверный код подтверждения</b-form-invalid-feedback>
      </b-form-group>
    </div>
    <div class="col-12 col-lg-4 mt-3 pt-lg-1">
      <button
        v-if="codeFieldShown || isCodeFieldValid"
        @click="changeNumber"
        class="btn-link mt-lg-4 d-table"
        type="button"
        id="change_phone"
      >
        {{ labelChangeButton }}
      </button>
    </div>

    <vue-recaptcha
      ref="recaptcha"
      size="invisible"
      :load-recaptcha-script="true"
      :sitekey="siteKey"
      @verify="getCode"
      @expired="onCaptchaExpired"
    />
    <div
      id="verify-error-message"
      class="col-12 invalid-feedback d-block mt-3"
      v-if="errorMessage"
    >
      {{ errorMessage }}
    </div>
    <div class="col-12 mt-4">
      <button
        type="submit"
        :disabled="isDisabledButtonGetCode"
        @click="getCode()"
        class="btn btn-primary"
        id="btn_code_verification_lk"
        :tabindex="tabIndex[2]"
        v-show="!validateInput('code', isCodeBlured)"
      >
        <span v-if="!isSendCode">Получить код</span>
        <template v-if="isSendCode"
          >Отправить повторно через
          <verify-timer
            @onFinish="stopTimer"
            :duration="duration"
          />
          сек.</template
        >
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import debounce from "lodash.debounce";
import { mask } from "vue-the-mask";
import VueRecaptcha from "vue-recaptcha";
import { BFormGroup, BFormInput, BFormInvalidFeedback } from "bootstrap-vue";
import VerifyTimer from "./VerifyTimer.vue";
import { isCaptchaBecomesHide } from "./captcha.helper";
import { getMessageFromSuccessResponse, isAlertShouldBeShown } from "./verifyUser.helper";

export default {
  components: {
    VerifyTimer,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    VueRecaptcha,
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
      codeFieldShown: false,
      allHiddenCaptchas: null,
      meassageWasSend: null,
      errorMessage: null,
    };
  },

  created() {
    this.debouncedUpdate = debounce(this.blurField, 100);
    this.debouncedGetCode = debounce(this.getCode, 100);
  },

  updated() {
    if (this.$refs.userInput.vModelValue.length === 4) {
      if (document.querySelector(".app_body")?.children) {
        this.allHiddenCaptchas = Array.from(document.querySelector(".app_body").children).filter(
          (item) => item.style.visibility === "hidden"
        );
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
      this.$LogEvent({
        formName: "VerifyUser errorMessage",
        idEventType: this.loginType === "phone" ? 294 : 295,
        controlName: "VerifyUser.vue",
        message: `Показало капчу через ${this.loginType === "phone" ? "номер" : "EMAIL"}"`,
        timeUser: new Date(),
      });
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
    async getCodeHelper(params) {
      try {
        const headers = {
          headers: { recaptcha: params.token, "X-Application": "VueJS" },
        };
        if (this.loginType !== undefined && (this.modeType === "REG" || this.modeType === "RECOVERY")) {
          const getMethod = () => {
            if (params.error === true && this.loginType === "phone") {
              return "sendsmscode2";
            }
            if (params.error === false && this.loginType === "phone") {
              return "sendsmscode";
            }
            if (params.error === true && this.loginType === "email") {
              return "sendemailcode2";
            }
            if (params.error === false && this.loginType === "email") {
              return "sendemailcode";
            }
            return null;
          };
          const method = getMethod();
          const getURL = () => {
            if (this.loginType === "phone") {
              return `/am/free/v2/${method}` + `${this.modeType === "RECOVERY" ? `?smstype=recovery` : ``}`;
            }
            if (this.loginType === "email") {
              return `/am/free/v2/${method}`;
            }
            return null;
          };
          const response = await axios.post(getURL(), params, headers);

          const getSuccessSendMessageText = getMessageFromSuccessResponse(response);
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
      this.$LogEvent({
        formName: "VerifyUser errorMessage",
        idEventType: this.loginType === "phone" ? 155 : 162,
        controlName: "VerifyUser.vue",
        message: `Нажал на кнопку Получить код на ${this.loginType === "phone" ? "номере" : "EMAIL"}"`,
        timeUser: new Date(),
      });
      // eslint-disable-next-line vue/no-mutating-props
      this.v.code.$model = null;
      this.codeFieldShown = false;
      this.isPhoneChanged = false;
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
        if (this.loginType === "phone" ? !this.v.phone.$invalid : !this.v.email.$invalid) {
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
            const getResponseMessageCodeErr = response?.data[0]?.MESSAGE_CODE;
            const isAlertShown = isAlertShouldBeShown(this.modeType, this.loginType, getResponseMessageCodeErr);
            if (isAlertShown) {
              this.codeFieldShown = false;
              this.errorMessage = "В Личном кабинете отсутствует профиль с данным номером телефона";
              this.$LogEvent({
                formName: "VerifyUser errorMessage",
                idEventType: this.loginType === "phone" ? 153 : 164,
                controlName: "VerifyUser.vue",
                message: `Показало сообщение об ошибке на ${this.loginType === "phone" ? "номере" : "EMAIL"}"`,
                timeUser: new Date(),
              });
              this.isSendCode = false;
              return;
            }

            if (response1.data[0].MESSAGE_CODE === 200) {
              this.codeFieldShown = true;
              this.loading = false;
              this.isSendCode = true;
            }

            if (response1.data.STATUS === 500 || response1.data.STATUS === 520) {
              this.loading = false;
              this.isSendCode = false;
              this.errorMessage = response1.data?.INFO ?? "Неизвестная ошибка";
              return;
            }

            if (response1?.data[0]?.ERRORCODE === 106) {
              await this.executeRecaptcha();
              return;
            }
          }
          if (isCaptcha === true) {
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

            const getResponseMessageCodeErr = response?.data[0]?.MESSAGE_CODE;

            const isAlertShown = isAlertShouldBeShown(this.modeType, this.loginType, getResponseMessageCodeErr);
            if (isAlertShown) {
              this.codeFieldShown = false;
              this.errorMessage = "В Личном кабинете отсутствует профиль с данным номером телефона";
              this.$LogEvent({
                formName: "VerifyUser errorMessage",
                idEventType: this.loginType === "phone" ? 153 : 164,
                controlName: "VerifyUser.vue",
                message: `Показало сообщение об ошибке на ${this.loginType === "phone" ? "номере" : "EMAIL"}"`,
                timeUser: new Date(),
              });
              this.isSendCode = false;
              return;
            }
            if (response2?.status === 500 || response2?.status === 520 || response2?.data[0]?.ERRORCODE) {
              this.loading = false;
              this.isSendCode = false;
            } else {
              this.codeFieldShown = true;
              this.loading = false;
              this.isSendCode = true;
            }
          }
          const isError = Boolean(
            response?.data[0]?.ERRORCODE || response.data.STATUS === 500 || response.data.STATUS === 520
          );
          const isErrorList = Boolean(response?.data[0]?.ERRORLIST);

          const isInSystemLogin = response?.data[0]?.MESSAGE_CODE === 201;
          const isExpiredLogin = response?.data[0]?.MESSAGE_CODE === 202;
          const getResponseMessageCode = response?.data[0]?.MESSAGE_CODE;

          if (isError === false) {
            if (
              this.modeType === "REG" &&
              this.loginType === "phone" &&
              (getResponseMessageCode === 201 || getResponseMessageCode === 204)
            ) {
              this.$bvModal
                .msgBoxConfirm(`Личный кабинет с указанным номером телефона уже существует.`, {
                  title: "Номер уже зарегистрирован",
                  size: "md",
                  okVariant: "secondary",
                  cancelVariant: "primary",
                  okTitle: isInSystemLogin ? "Восстановить пароль" : "Обратитесь в техподдержку",
                  cancelTitle: "Обратитесь в техподдержку",
                  footerClass: "p-2",
                  hideHeaderClose: false,
                  centered: true,
                  modalClass: this.myclass,
                  autoFocusButton: "ok",
                })
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
                  if (value === null) {
                    this.changeNumber();
                  }
                  this.loading = false;
                })
                .catch((err) => {
                  console.log(err);
                  this.$LogEvent({
                    formName: "VerifyUser errorMessage",
                    idEventType: this.loginType === "phone" ? 153 : 164,
                    controlName: "VerifyUser.vue",
                    message: `Показало сообщение об ошибке на ${this.loginType === "phone" ? "номере" : "EMAIL"}"`,
                    timeUser: new Date(),
                  });
                });
            } else {
              this.codeFieldShown = true;
              this.loading = false;
              this.isSendCode = true;
              this.$emit("sendCode", true);
            }
          } else if (isErrorList === true) {
            this.$LogEvent({
              formName: "VerifyUser errorMessage",
              idEventType: this.loginType === "phone" ? 153 : 164,
              controlName: "VerifyUser.vue",
              message: `Показало сообщение об ошибке на ${this.loginType === "phone" ? "номере" : "EMAIL"}"`,
              timeUser: new Date(),
            });
            if (response?.data[0]?.ERRORCODE === 106) return;
            this.errorMessage =
              response?.data[0]?.ERRORLIST[0].ERRORTEXT.replace(/^\[|\]$/g, "") ?? "Неизвестная ошибка";
          }
        } else {
          this.isUserDisabled = false;
        }
      } catch (e) {
        console.log(e);
        this.loading = false;
        this.$LogEvent({
          formName: "VerifyUser errorMessage",
          idEventType: this.loginType === "phone" ? 153 : 164,
          controlName: "VerifyUser.vue",
          message: `Показало сообщение об ошибке на ${this.loginType === "phone" ? "номере" : "EMAIL"}"`,
          timeUser: new Date(),
        });
      }
    },

    getCodeParams() {
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
      this.$emit("sendCode", false);
      this.$emit("error", null);
      this.errorMessage = null;
      this.isUserBlured = false;
      // eslint-disable-next-line vue/no-mutating-props
      this.v[this.loginType].$model = "";
      this.$refs.userInput.$el.disabled = false;
      this.$refs.userInput.$el.focus();
      // eslint-disable-next-line vue/no-mutating-props
      this.v.code.$model = null;
      this.isUserDisabled = false;
      this.isPhoneChanged = true;
      this.$emit("isPhoneChangedButtonClicked", this.isPhoneChanged);
      this.isSendCode = false;
      this.$LogEvent({
        formName: "VerifyUser",
        idEventType: this.loginType === "phone" ? 156 : 161,
        controlName: "VerifyUser.vue",
        message: `Нажал на кнопку "Изменить ${this.loginType === "phone" ? "номер" : "EMAIL"}"`,
        timeUser: new Date(),
      });
    },

    validateInput(field) {
      if (field === "code" && this.isCodeError) {
        return false;
      }
      if (this.isCodeFieldValid) {
        return true;
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
    codeModel: {
      get() {
        return this.v.code.$model;
      },
      set(value) {
        // eslint-disable-next-line vue/no-mutating-props
        this.v.code.$model = value;
      },
    },
    propModel: {
      get() {
        return this.v[this.loginType].$model;
      },
      set(value) {
        // eslint-disable-next-line vue/no-mutating-props
        this.v[this.loginType].$model = value;
      },
    },
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
  },
  watch: {
    errorMessage(value) {
      const isPhoneExist = value?.includes("В Личном кабинете отсутствует профиль с данным номером телефона");
      const isMailExist = value?.includes("На указанный e-mail отсутствует зарегистрированная уч.запись");
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
  mounted() {
    if (this.isCodeFieldValid) {
      this.isSendCode = true;
      this.meassageWasSend = true;
    }
  },
};
</script>
