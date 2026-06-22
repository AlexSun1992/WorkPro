<template>
  <div class="row">
    <ControlModal
      :is-open="isVisibleModal"
      :data="{ label: 'Номер уже зарегистрирован', value: '' }"
      :close-on-out-side-click="true"
      :close-on-esc="true"
      :show-close="true"
      :show-ok="false"
      :show-cancel="false"
      :has-header="true"
      :has-footer="true"
      @close="onClose"
      @cancel="onClose"
    >
      <template #default>
        <div v-if="isVisibleModal">Введённый вами мобильный номер уже есть в системе.</div>
      </template>
      <template #footer>
        <button
          class="btn-primary d-block w-100 w-lg-auto"
          type="button"
          @click="onHidden"
        >
          Восстановить пароль
        </button>
        <button
          class="btn-secondary d-block mt-3 w-100 w-lg-auto"
          type="button"
          @click="onOk"
        >
          {{ isInSystemLogin ? "Войти в систему" : "Восстановить пароль" }}
        </button>
      </template>
    </ControlModal>
    <div class="col-12 col-lg-4">
      <form-group class="required">
        <legend v-if="loginType === 'phone'">Телефон</legend>
        <b-form-input
          v-if="loginType === 'phone'"
          id="phone"
          ref="userInput"
          v-model="propModel"
          v-mask="changeMask"
          :autofocus="!formData"
          :state="validateInput(loginType, isUserBlured)"
          :placeholder="placeholder"
          :disabled="disabled"
          autocomplete="off"
          :tabindex="tabIndex[0]"
          @change="changeField('phone')"
          @click="loginTouchesCount = 2"
        ></b-form-input>
        <div
          v-if="validateInput(loginType, isUserBlured) === false"
          class="invalid-feedback"
        >
          Обязательное поле
        </div>
      </form-group>
    </div>
    <div
      v-if="codeFieldShown"
      class="col-12 col-lg-4 mt-3 mt-lg-0"
    >
      <form-group label="Код подтверждения">
        <b-form-input
          id="sms-confirm"
          ref="codeInput"
          v-model="codeModel"
          v-mask="codeMask"
          autofocus
          :state="validateInput('code', isCodeBlured)"
          :disabled="loading"
          autocomplete="off"
          placeholder="Код подтверждения"
          @blur="blurField('code', isCodeBlured)"
          @update="updateField('code')"
          @change="changeField('code')"
          @input="inputTouch(loginType)"
        ></b-form-input>
        <div
          v-if="!v.code.$model"
          class="invalid-feedback"
        >
          Пожалуйста, заполните это поле
        </div>
        <div
          v-if="validateInput('code', isCodeBlured) === false && v.code.$model"
          class="invalid-feedback"
        >
          Неверный код подтверждения
        </div>
      </form-group>
    </div>
    <div class="col-12 col-lg-4 mt-3 mt-lg-btn-small_hl">
      <button
        id="btn_code_verification_lk"
        type="submit"
        :disabled="isDisabledButtonGetCode"
        class="btn btn-secondary btn-small w-100 p-0"
        @click="getCode()"
      >
        <span v-if="!isSendCode">Получить код</span>
        <template v-if="isSendCode"
          >Получить код (<verify-timer
            :duration="duration"
            @onFinish="stopTimer"
          />
          с)</template
        >
      </button>
    </div>
    <ControlYandexCaptcha
      ref="yandexCaptcha"
      :data="{ value: null }"
      :invisible="true"
      @captcha-updated="captchaUpdated"
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
      v-if="errorMessage"
      id="verify-error-message"
      class="col-12 invalid-feedback mt-3"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import axios from "axios";
import debounce from "lodash.debounce";
import { mask } from "vue-the-mask";
import { BFormInput } from "bootstrap-vue";
import VerifyTimer from "@/components/Libs/VerifyUser/VerifyTimer";
import { getMessageFromSuccessResponse, isAlertShouldBeShown } from "../VerifyUser/verifyUser.helper";
import ControlYandexCaptcha from "@/components/Libs/Controls/ControlYandexCaptcha/ControlYandexCaptcha";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";
import ControlModal from "@/components/Libs/Controls/AsyncModalAction/ControlModal";

export default {
  name: "VerifyUser2",
  components: {
    ControlYandexCaptcha,
    FormGroup,
    VerifyTimer,
    BFormInput,
    ControlModal,
  },

  directives: { mask },
  props: {
    v: {
      type: Object,
      required: true,
    },
    tabIndex: {
      type: Array,
      default: () => [],
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
    textMessage: {
      type: String,
      default: "",
    },
    error: {
      type: String,
      default: "",
    },
    isError: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: undefined,
    },
    isValidForm: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      isInSystemLogin: null,
      isExpiredLogin: null,
      isVisibleModal: false,
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
      duration: 60,
      loading: false,
      allHiddenCaptchas: null,
      meassageWasSend: null,
      errorMessage: null,
      successMessage: null,
    };
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
      return this.error ? this.error?.includes("код подтверждения") : false;
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
      const isInvalid = this.loginType === "phone" ? !this.v.phone.$invalid : !this.v.email.$invalid;
      return isInvalid && this.isSendCode;
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
    codeFieldShown() {
      return Boolean(this.formData?.GUID);
    },
  },
  watch: {
    errorMessage(value) {
      const isPhoneExist = value.includes("В Личном кабинете отсутствует профиль с данным номером телефона");
      const id = this.loginType === "phone" ? 153 : 164;
      const message = `Показало сообщение об ошибке на ${this.loginType === "phone" ? "номере" : "электронной почте"}"`;
      this.sendLog({ id, message, controlName: "VerifyUser.vue" });

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

  created() {
    this.debouncedUpdate = debounce(this.blurField, 100);
    this.debouncedGetCode = debounce(this.getCode, 100);
  },

  updated() {
    const hasValue = this.$refs.userInput.vModelValue.length === 4;
    const children = document.querySelector(".app_body")?.children;
    if (hasValue && children) {
      this.allHiddenCaptchas = Array.from(children).filter((item) => item.style.visibility === "hidden");
    }
  },
  unmounted() {
    this.isSendCode = false;
  },

  methods: {
    sendLog({ idEventType, message, controlName = "VerifyUser.vue", formName = "VerifyUser errorMessage" }) {
      this.$LogEvent({
        formName,
        ...(idEventType ? { idEventType } : {}),
        controlName,
        message,
        timeUser: new Date(),
      });
    },
    removeErrorTextMessage() {
      this.errorMessage = null;
    },
    captchaUpdated(value) {
      if (value) {
        this.getCode(value);
      }
    },
    updateYandexCaptcha(callBack) {
      this.$refs.yandexCaptcha.updateCaptcha(callBack);
    },
    destroyCaptcha() {
      this.$refs.yandexCaptcha.destroyCaptcha();
    },
    updateField(field) {
      this.$emit("checkCodeFieldValid", this.validateState(field));
    },
    changeField(field) {
      this.isUserBlured = false;
      if (this.validateState(field)) {
        this.sendLog({
          formName: "Registration",
          controlName: field,
          message: `Поле ${field} посещено`,
        });
      }
    },

    inputTouch() {
      this.isUserBlured = false;

      this.$emit("getLoginType", this.v.code.$invalid === false ? this.loginType : null);
    },

    getUrl(error) {
      if (this.loginType === "phone") {
        const method = error ? "registerUser1captcha" : "registerUser1";

        return `/lk/free/v2/${method}${this.modeType === "RECOVERY" ? "?smstype=recovery" : ""}`;
      }
      return null;
    },
    async getCodeHelper(params) {
      try {
        const headers = {
          headers: { recaptcha: params.token, "X-Application": "VueJS" },
        };
        if (this.loginType !== undefined && (this.modeType === "REG" || this.modeType === "RECOVERY")) {
          const url = this.getURL(params.error);
          const response = await axios.post(url, params, headers);

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
            const getResponseMessageCodeErr = response?.data[0]?.ERRORCODE;
            const isAlertShown = isAlertShouldBeShown(this.modeType, this.loginType, getResponseMessageCodeErr);
            if (isAlertShown) {
              this.errorMessage =
                response?.data[0]?.ERRORLIST[0].ERRORTEXT.replace(/^\[|\]$/g, "") ?? "Неизвестная ошибка";
              this.isSendCode = false;
              this.sendLog({
                idEventType: this.loginType === "phone" ? 153 : 164,
                message: `Показало сообщение об ошибке на ${
                  this.loginType === "phone" ? "номере" : "электронной почте"
                }"`,
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
              this.sendLog({
                idEventType: this.loginType === "phone" ? 153 : 164,
                message: `Показало сообщение об ошибке на ${
                  this.loginType === "phone" ? "номере" : "электронной почте"
                }"`,
              });
              return;
            }

            if (response1?.data[0]?.ERRORCODE === 106) {
              const fn = function updateCode() {
                this.updateSendCodeState(false);
              };
              this.updateYandexCaptcha(fn.bind(this));
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
              this.sendLog({
                idEventType: this.loginType === "phone" ? 153 : 164,
                message: `Показало сообщение об ошибке на ${
                  this.loginType === "phone" ? "номере" : "электронной почте"
                }"`,
              });
              return;
            }
            const response2Error =
              response2?.status === 500 || response2?.status === 520 || response2?.data[0]?.ERRORCODE;

            this.loading = false;
            this.isSendCode = !response2Error;
            if (!response2Error) {
              this.successMessage = response?.data[0]?.MESSAGE;
            }
          }
          const isError = Boolean(
            response?.data[0]?.ERRORCODE || response.data.STATUS === 500 || response.data.STATUS === 520
          );
          const isErrorList = Boolean(response?.data[0]?.ERRORLIST);

          this.isInSystemLogin = response?.data[0]?.MESSAGE_CODE === 201;
          this.isExpiredLogin = response?.data[0]?.MESSAGE_CODE === 202;
          const getResponseMessageCode = response?.data[0]?.MESSAGE_CODE;
          const codeToken = response?.data[0]?.GUID;

          if (isError === false) {
            if (
              this.modeType === "REG" &&
              this.loginType === "phone" &&
              (getResponseMessageCode === 201 || getResponseMessageCode === 204)
            ) {
              this.isVisibleModal = true;
            } else {
              this.loading = false;
              this.isSendCode = true;
              if (codeToken) {
                this.$emit("sendCode", codeToken);
              }
            }
          } else if (isErrorList === true) {
            if (response?.data[0]?.ERRORCODE === 106) {
              return;
            }
            this.errorMessage =
              response?.data[0]?.ERRORLIST[0].ERRORTEXT.replace(/^\[|\]$/g, "") ?? "Неизвестная ошибка";
            this.sendLog({
              iidEventType: this.loginType === "phone" ? 153 : 164,
              message: `Показало сообщение об ошибке на ${
                this.loginType === "phone" ? "номере" : "электронной почте"
              }"`,
            });
          }
        } else {
          this.isUserDisabled = false;
        }
      } catch (e) {
        this.updateSendCodeState(false);
        console.error(e);
      }

      this.sendLog({
        formName: "RegForm",
        idEventType: 13,
        message: `Нажал на кнопку «Получить код» при регистрации`,
      });
    },

    updateSendCodeState(state) {
      this.loading = state;
      this.$emit("sendingCode", state);
    },

    getCodeParams() {
      if (this.loginType === "phone") {
        return {
          ...this.formData,
          PHONE: this.v.phone.$model,
          loginType: "phone",
        };
      }
      return {
        EMAIL: this.v.email.$model,
        loginType: "email",
      };
    },

    showForm() {
      if (!this.$v.user.$invalid) {
        this.isUserDisabled = true;
      }
    },
    onHidden() {
      this.isInSystemLogin = null;
      this.isExpiredLogin = null;
      window.location.href = "/login/password-recovery";
      this.isVisibleModal = false;
      this.loading = false;
    },

    onOk() {
      if (this.isInSystemLogin) {
        window.location.href = "/login";
      }
      if (this.isExpiredLogin) {
        this.isSendCode = true;
      }
      this.isVisibleModal = false;
      this.loading = false;
    },
    onClose() {
      this.isInSystemLogin = null;
      this.isExpiredLogin = null;
      this.$emit("hidden");
      this.isVisibleModal = false;
      this.loading = false;
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
