<template>
  <div class="row">
    <div class="col-12 col-lg-4">
      <form-group class="required">
        <legend v-if="loginType === 'phone'">Телефон</legend>
        <b-form-input
          v-if="loginType === 'phone'"
          id="phone"
          ref="userInput"
          v-model="propModel"
          v-mask="changeMask"
          type="tel"
          :autofocus="!formData"
          :state="validateInput(loginType)"
          :placeholder="placeholder"
          :disabled="isSendCode || loading"
          autocomplete="username"
          :tabindex="tabIndex[1]"
          @change="changeField('phone')"
          @blur="debouncedBlurValidate(loginType)"
          @click="loginTouchesCount = 2"
          @input="removeErrorTextMessage"
        ></b-form-input>
        <legend v-if="loginType === 'email'">Почта</legend>
        <b-form-input
          v-if="loginType === 'email'"
          id="email"
          ref="userInput"
          v-model="propModel"
          type="email"
          autofocus
          :state="validateInput(loginType)"
          placeholder="Электронная почта"
          :disabled="isSendCode || loading"
          autocomplete="username"
          :tabindex="tabIndex[0]"
          @blur="debouncedBlurValidate(loginType)"
          @change="changeField('email')"
          @input="removeErrorTextMessage"
          @click="loginTouchesCount = 2"
          @keyup.enter="verifyUser"
        ></b-form-input>

        <div
          v-if="isPhoneEmailBlurError"
          class="invalid-feedback"
        >
          Пожалуйста, заполните это поле
        </div>

        <div
          v-if="v.email && v.email.forbiddenRussianSign.$invalid"
          class="invalid-feedback"
        >
          Русские символы запрещены
        </div>

        <div
          v-if="v.email && v.email.email.$invalid"
          class="invalid-feedback"
        >
          Пожалуйста, введите корректный e-mail
        </div>

        <div
          v-if="v.email && v.email.forbiddenPlusSign.$invalid"
          class="invalid-feedback"
        >
          Знак '+' запрещен
        </div>
      </form-group>
    </div>
    <div
      v-if="isCodeFieldShown"
      class="col-12 col-lg-4 mt-3 mt-lg-0"
    >
      <form-group label="Код подтверждения">
        <b-form-input
          id="sms-confirm"
          ref="codeInput"
          v-model="codeModel"
          v-mask="codeMask"
          type="tel"
          autofocus
          :state="validateInput('code', isCodeBlured)"
          :disabled="disabled"
          autocomplete="off"
          placeholder="Код подтверждения"
          @blur="blurField('code', isCodeBlured)"
          @update="updateField('code')"
          @change="changeField('code')"
          @input="inputTouch(loginType)"
        ></b-form-input>
        <div
          v-if="isCodeBlurError"
          class="invalid-feedback"
        >
          Пожалуйста, заполните это поле
        </div>
        <div
          v-if="v.code.$model && validateInput('code', isCodeBlured) === false"
          class="invalid-feedback"
        >
          Неверный код подтверждения
        </div>
      </form-group>
    </div>
    <div class="col-12 col-lg-4 mt-3 pt-lg-1">
      <button
        v-if="isCodeFieldShown || isCodeFieldValid"
        id="change_phone"
        class="btn-link mt-lg-4 d-table"
        type="button"
        @click="changeNumber"
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
      v-if="errorMessage"
      id="verify-error-message"
      class="col-12 invalid-feedback d-block mt-3"
    >
      {{ errorMessage }}
    </div>
    <div class="col-12 mt-4">
      <button
        v-show="!validateInput('code', isCodeBlured)"
        id="btn_code_verification_lk"
        type="submit"
        :disabled="isDisabledButtonGetCode"
        class="btn btn-primary"
        :tabindex="tabIndex[2]"
        @click="getCode()"
      >
        <span v-if="!isSendCode">Получить код</span>
        <template v-if="isSendCode"
          >Отправить повторно через
          <verify-timer
            :duration="duration"
            @onFinish="stopTimer"
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
import { BFormInput } from "bootstrap-vue";
import VerifyTimer from "@/components/Libs/VerifyUser/VerifyTimer";
import { isCaptchaBecomesHide } from "./captcha.helper";
import { getMessageFromSuccessResponse, isAlertShouldBeShown } from "./verifyUser.helper";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

export default {
  name: "VerifyUser",
  components: {
    VerifyTimer,
    FormGroup,
    BFormInput,
    VueRecaptcha,
  },

  directives: { mask },
  props: {
    count: {
      type: Number,
      default: 0,
    },
    v: {
      type: Object,
      required: true,
    },
    validateState: {
      type: Function,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loginType: {
      type: String,
      default: undefined,
    },
    modeType: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    context: {
      type: Object,
      default: () => ({}),
    },
    textMessage: {
      type: String,
      default: "",
    },
    tabIndex: {
      type: Array,
      default: () => [],
    },
    error: {
      type: String,
      default: "",
    },
    isError: {
      type: Boolean,
      default: false,
    },
    isCodeFieldValid: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: null,
    },
    isValidForm: {
      type: Boolean,
      default: null,
    },
  },

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
      siteKey: process.env.RECAPTCHA_SITE_KEY,
      loading: false,
      isCodeFieldShown: false,
      allHiddenCaptchas: null,
      meassageWasSend: null,
      errorMessage: null,
      debouncedBlurValidate: null,
    };
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
    isPhoneEmailBlurError() {
      return this.v[this.loginType].$model === "" && this.v[this.loginType].$dirty;
    },
    isCodeBlurError() {
      return this.v.code.$model === null && this.v.code.$dirty;
    },
    changeMask() {
      if (this.loginType === "phone") {
        this.placeholder = "+7(___)-___-__-__";
        this.mask = "+7(###)-###-##-##";
        return this.mask;
      }
      this.placeholder = "";
      this.mask = "X".repeat(50);
      return this.mask;
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
      return this.loginType === "phone" ? "Изменить номер" : "Изменить электронную почту";
    },
  },
  watch: {
    errorMessage(value) {
      const isPhoneExist = value?.includes("В Личном кабинете отсутствует профиль с данным номером телефона");
      const isMailExist = value?.includes("На указанную электронную почту отсутствует зарегистрированная уч.запись");
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

  created() {
    this.debouncedBlurValidate = debounce(this.blurField, 100);
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
    sendLog({ idEventType, formName = "VerifyUser errorMessage", controlName = "VerifyUser.vue", message }) {
      this.$LogEvent({
        formName,
        controlName,
        message,
        ...(idEventType ? { idEventType } : {}),
        timeUser: new Date(),
      });
    },
    removeErrorTextMessage() {
      this.errorMessage = null;
    },
    updateField(field) {
      this.$emit("checkCodeFieldValid", this.validateState(field));
    },
    changeField(field) {
      this.isUserBlured = false;
      if (this.validateState(field)) {
        this.sendLog({
          controlName: field,
          formName: "Registration",
          message: `Поле ${field} посещено`,
        });
      }
    },
    async executeRecaptcha() {
      this.loading = true;
      await this.$refs.recaptcha.reset();
      await this.$refs.recaptcha.execute();
      await isCaptchaBecomesHide();
      const visibleCaptcha = Array.from(document.querySelectorAll("body>div"))
        .filter((elem) => elem.querySelector("iframe[title*='reCAPTCHA']"))
        .filter((item) => item.style.visibility === "visible");
      this.sendLog({
        idEventType: this.loginType === "phone" ? 294 : 295,
        message: `Показало капчу через ${this.loginType === "phone" ? "номер" : "электронную почту"}"`,
      });
      if (visibleCaptcha.length === 0) {
        this.loading = false;
      }
    },

    inputTouch() {
      this.isUserBlured = false;

      this.$emit("getLoginType", this.v.code.$invalid === false ? this.loginType : null);
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
            const baseUrl = `/lk/free/v2/${method}`;
            if (this.loginType === "phone") {
              return `${baseUrl}${this.modeType === "RECOVERY" ? `?smstype=recovery` : ``}`;
            }
            if (this.loginType === "email") {
              return baseUrl;
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
      this.sendLog({
        idEventType: this.loginType === "phone" ? 155 : 162,
        message: `Нажал на кнопку Получить код на ${this.loginType === "phone" ? "номере" : "электронную почту"}"`,
      });
      // eslint-disable-next-line vue/no-mutating-props
      this.v.code.$reset();
      this.isCodeFieldShown = false;
      this.isPhoneChanged = false;
      this.$emit("error", null);
      this.errorMessage = null;
      this.$emit("sendingCode", true);

      try {
        let response;
        const isCaptcha = Boolean(token);
        const request = async (p) => await this.getCodeHelper(p);
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
              this.isCodeFieldShown = false;
              this.errorMessage = "В Личном кабинете отсутствует профиль с данным номером телефона";
              this.sendLog({
                idEventType: this.loginType === "phone" ? 153 : 164,
                message: `Показало сообщение об ошибке на ${
                  this.loginType === "phone" ? "номере" : "электронной почте"
                }"`,
              });
              this.isSendCode = false;
              return;
            }

            if (response1.data[0].MESSAGE_CODE === 200) {
              this.isCodeFieldShown = true;
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
              this.isCodeFieldShown = false;
              this.errorMessage = "В Личном кабинете отсутствует профиль с данным номером телефона";
              this.sendLog({
                idEventType: this.loginType === "phone" ? 153 : 164,
                message: `Показало сообщение об ошибке на ${
                  this.loginType === "phone" ? "номере" : "электронной почте"
                }"`,
              });
              this.isSendCode = false;
              return;
            }
            const response2Error =
              response2?.status === 500 || response2?.status === 520 || response2?.data[0]?.ERRORCODE;
            this.loading = false;
            this.isSendCode = !response2Error;
            if (!response2Error) {
              this.isCodeFieldShown = true;
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
                  console.error(err);
                  this.sendLog({
                    idEventType: this.loginType === "phone" ? 153 : 164,
                    message: `Показало сообщение об ошибке на ${
                      this.loginType === "phone" ? "номере" : "электронной почте"
                    }"`,
                  });
                });
            } else {
              this.isCodeFieldShown = true;
              this.loading = false;
              this.isSendCode = true;
              this.$emit("sendCode", true);
            }
          } else if (isErrorList === true) {
            this.sendLog({
              idEventType: this.loginType === "phone" ? 153 : 164,
              message: `Показало сообщение об ошибке на ${
                this.loginType === "phone" ? "номере" : "электронной почте"
              }"`,
            });
            if (response?.data[0]?.ERRORCODE === 106) {
              return;
            }
            this.errorMessage =
              response?.data[0]?.ERRORLIST[0].ERRORTEXT.replace(/^\[|\]$/g, "") ?? "Неизвестная ошибка";
          }
        } else {
          this.isUserDisabled = false;
        }
      } catch (e) {
        console.error(e);
        this.loading = false;
        this.sendLog({
          idEventType: this.loginType === "phone" ? 153 : 164,
          message: `Показало сообщение об ошибке на ${this.loginType === "phone" ? "номере" : "электронной почте"}"`,
        });
      }
    },

    getCodeParams() {
      if (this.loginType === "phone") {
        return {
          PHONE: this.v.phone.$model,
          loginType: "phone",
        };
      }
      return {
        EMAIL: this.v.email.$model,
        loginType: "email",
      };
    },

    async showForm() {
      if (!this.$v.user.$invalid) {
        this.isUserDisabled = true;
      }
    },

    changeNumber() {
      this.isCodeFieldShown = false;
      this.$emit("checkCodeFieldValid", false);
      this.$emit("sendCode", false);
      this.$emit("error", null);
      this.errorMessage = null;
      this.isUserBlured = false;
      // eslint-disable-next-line vue/no-mutating-props
      this.v[this.loginType].$reset();
      this.$refs.userInput.$el.disabled = false;
      this.$refs.userInput.$el.focus();
      // eslint-disable-next-line vue/no-mutating-props
      this.v.code.$model = null;
      this.isUserDisabled = false;
      this.isPhoneChanged = true;
      this.$emit("isPhoneChangedButtonClicked", this.isPhoneChanged);
      this.isSendCode = false;
      this.sendLog({
        formName: "VerifyUser",
        idEventType: this.loginType === "phone" ? 156 : 161,
        message: `Нажал на кнопку "Изменить ${this.loginType === "phone" ? "номер" : "электронную почту"}"`,
      });
    },

    validateInput(field) {
      if (field === "code" && this.isCodeError) {
        return false;
      }
      if (field === "code" && this.isCodeFieldValid) {
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
};
</script>
