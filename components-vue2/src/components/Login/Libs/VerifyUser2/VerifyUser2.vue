<template>
  <div class="row">
    <div class="col-12 col-lg-4">
      <b-form-group class="required">
        <legend v-if="loginType === 'phone'">Телефон</legend>
        <b-form-input
          id="phone"
          v-if="loginType === 'phone'"
          ref="userInput"
          v-model="propModel"
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
    <div
      class="col-12 col-lg-4 mt-3 mt-lg-0"
      v-if="codeFieldShown"
    >
      <b-form-group label="Код подтверждения">
        <b-form-input
          id="sms-confirm"
          autofocus
          ref="codeInput"
          v-model="codeModel"
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
        <b-form-invalid-feedback v-if="!v.code.$model">Пожалуйста, заполните это поле</b-form-invalid-feedback>
        <b-form-invalid-feedback v-else>Неверный код подтверждения</b-form-invalid-feedback>
      </b-form-group>
    </div>
    <div class="col-12 col-lg-4 mt-3 mt-lg-btn-small_hl">
      <button
        type="submit"
        :disabled="isDisabledButtonGetCode"
        @click="getCode()"
        class="btn btn-secondary btn-small w-100 p-0"
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
    <div v-if="successMessage && codeFieldShown">
      <div
        id="verify-success-message"
        class="success-feedback mt-3"
      >
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
import debounce from "lodash.debounce";
import { mask } from "vue-the-mask";
import VueRecaptcha from "vue-recaptcha";
import { BFormGroup, BFormInput, BFormInvalidFeedback } from "bootstrap-vue";
import VerifyTimer from "../VerifyUser/VerifyTimer.vue";
import { isCaptchaBecomesHide } from "../VerifyUser/captcha.helper";
import { getMessageFromSuccessResponse, isAlertShouldBeShown } from "../VerifyUser/verifyUser.helper";

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
        if (this.loginType !== undefined && (this.modeType === "REG" || this.modeType === "RECOVERY")) {
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
              return `/am/free/v2/${method}${this.modeType === "RECOVERY" ? `?smstype=recovery` : ``}`;
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
            const getResponseMessageCodeErr = response?.data[0]?.ERRORCODE;
            const isAlertShown = isAlertShouldBeShown(this.modeType, this.loginType, getResponseMessageCodeErr);
            if (isAlertShown) {
              this.errorMessage =
                response?.data[0]?.ERRORLIST[0].ERRORTEXT.replace(/^\[|\]$/g, "") ?? "Неизвестная ошибка";
              this.isSendCode = false;
              this.$LogEvent({
                formName: "VerifyUser errorMessage",
                idEventType: this.loginType === "phone" ? 153 : 164,
                controlName: "VerifyUser.vue",
                message: `Показало сообщение об ошибке на ${
                  this.loginType === "phone" ? "номере" : "электронной почте"
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

            if (response1.data.STATUS === 500 || response1.data.STATUS === 520) {
              this.loading = false;
              this.isSendCode = false;
              this.errorMessage = response1.data?.INFO ?? "Неизвестная ошибка";
              this.$LogEvent({
                formName: "VerifyUser errorMessage",
                idEventType: this.loginType === "phone" ? 153 : 164,
                controlName: "VerifyUser.vue",
                message: `Показало сообщение об ошибке на ${
                  this.loginType === "phone" ? "номере" : "электронной почте"
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

            const isAlertShown = isAlertShouldBeShown(this.modeType, this.loginType, getResponseMessageCodeErr);
            if (isAlertShown) {
              this.errorMessage =
                response?.data[0]?.ERRORLIST[0].ERRORTEXT.replace(/^\[|\]$/g, "") ?? "Неизвестная ошибка";
              this.isSendCode = false;
              this.$LogEvent({
                formName: "VerifyUser errorMessage",
                idEventType: this.loginType === "phone" ? 153 : 164,
                controlName: "VerifyUser.vue",
                message: `Показало сообщение об ошибке на ${
                  this.loginType === "phone" ? "номере" : "электронной почте"
                }"`,
                timeUser: new Date(),
              });
              return;
            }
            if (response2?.status === 500 || response2?.status === 520 || response2?.data[0]?.ERRORCODE) {
              this.loading = false;
              this.isSendCode = false;
            } else {
              this.loading = false;
              this.isSendCode = true;
              this.successMessage = response?.data[0]?.MESSAGE;
            }
          }
          const isError = Boolean(
            response?.data[0]?.ERRORCODE || response.data.STATUS === 500 || response.data.STATUS === 520
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
                .msgBoxConfirm("Введённый вами мобильный номер уже есть в системе.", {
                  title: "Номер уже зарегистрирован",
                  size: "md",
                  okVariant: "secondary",
                  cancelVariant: "primary",
                  okTitle: isInSystemLogin ? "Войти в систему" : "Восстановить пароль",
                  cancelTitle: "Восстановить пароль",
                  footerClass: "p-2",
                  hideHeaderClose: false,
                  centered: true,
                  modalClass: this.myclass,
                  autoFocusButton: "ok",
                })
                .then((value) => {
                  if (value === true) {
                    if (isInSystemLogin) {
                      window.location.href = "/login";
                    }
                    if (isExpiredLogin) {
                      this.isSendCode = true;
                    }
                  }
                  if (value === false) {
                    window.location.href = "/login/password-recovery";
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
              response?.data[0]?.ERRORLIST[0].ERRORTEXT.replace(/^\[|\]$/g, "") ?? "Неизвестная ошибка";
            this.$LogEvent({
              formName: "VerifyUser errorMessage",
              iidEventType: this.loginType === "phone" ? 153 : 164,
              controlName: "VerifyUser.vue",
              message: `Показало сообщение об ошибке на ${
                this.loginType === "phone" ? "номере" : "электронной почте"
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
        formName: "RegForm",
        idEventType: 13,
        controlName: "VerifyUser.vue",
        message: `Нажал на кнопку «Получить код» при регистрации`,
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
      // eslint-disable-next-line vue/no-mutating-props
      this.v.phone.$model = "";
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
        message: `Нажал на кнопку "Изменить ${this.loginType === "phone" ? "номер" : "электронную почту"}"`,
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
    propModel: {
      get() {
        return this.v[this.loginType].$model;
      },
      set(value) {
        // eslint-disable-next-line vue/no-mutating-props
        this.v[this.loginType].$model = value;
      },
    },
    codeModel: {
      get() {
        return this.v.code.$model;
      },
      set(value) {
        // eslint-disable-next-line vue/no-mutating-props
        this.v.code.$model = value;
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
        this.mask = "+7(9##)-###-##-##";
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
    codeFieldShown() {
      return Boolean(this.formData?.GUID);
    },
  },
  watch: {
    errorMessage(value) {
      const isPhoneExist = value.includes("В Личном кабинете отсутствует профиль с данным номером телефона");
      this.$LogEvent({
        formName: "VerifyUser errorMessage",
        idEventType: this.loginType === "phone" ? 153 : 164,
        controlName: "VerifyUser.vue",
        message: `Показало сообщение об ошибке на ${this.loginType === "phone" ? "номере" : "электронной почте"}"`,
        timeUser: new Date(),
      });
      const isMailExist = value.includes("На указанную электронную почту отсутствует зарегистрированная уч.запись");
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
