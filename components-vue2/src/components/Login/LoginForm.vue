<template>
  <div>
    <b-modal
      id="sms-confirm"
      hide-footer
      @shown="setFocusSMSCode()"
      @hidden="closeModalConfirmSMSCode"
      :centered="true"
    >
      <div class="d-block text-center">
        <h4>Введите код</h4>
        На номер телефона {{ hideTelephoneMessage }} был отправлен код
        подверждения.
        <b-form @submit.prevent="onSubmitWithCodeSMS">
          <b-form-input
            ref="focusCodeSMS"
            autocomplete="off"
            placeholder="12345"
            type="number"
            :disabled="authInProcess"
            v-model="$v.user.code.$model"
            :state="isValidStateCodeSMS"
            @focus="isValidStateCodeSMS = null"
            class="form-control mt-3"
          ></b-form-input>
          <b-form-invalid-feedback
            >Неверный код. Попробуйте еще раз.
          </b-form-invalid-feedback>
          <b-row v-if="isRetrySendCodeSMS">
            <b-button @click="retrySendCodeSMS()" class="mt-3" block
              >Отправить повторно</b-button
            >
          </b-row>
          <div v-else class="mt-3">
            Отправить повторно можно через
            <verify-timer
              @onFinish="isRetrySendCodeSMS = true"
              :duration="duration"
              class="mt-3"
            />
            сек.
          </div>
          <b-row>
            <div
              v-if="isCaptchaNeeded && !authInProcess"
              class="col-12 col-lg-12"
            >
              <captcha
                @update="setIdCaptcha($event)"
                @updateCode="setCodeCaptcha($event)"
              />
            </div>
            <b-button
              :disabled="
                authInProcess ||
                user.code === '' ||
                (isCaptchaNeeded && !user.cap)
              "
              variant="primary"
              class="mt-3"
              block
              @click="fetchToken()"
              >Продолжить
              <b-spinner v-if="authInProcess" variant="light"></b-spinner
            ></b-button>
          </b-row>
        </b-form>
      </div>
    </b-modal>

    <b-form @submit.prevent="onSubmit">
      <div class="tab-mobile-block">Вход</div>
      <div class="row">
        <div class="col-12 col-lg-4">
          <b-form-group label="Телефон или email" label-cols="12">
            <b-form-input
              autofocus
              id="phone"
              ref="phoneInput"
              v-model="$v.user.username.$model"
              :placeholder="placeholder"
              type="tel"
              :state="wrongAuthData ? false : validateState('username')"
              @blur="$v.user.username.$touch()"
              @input="wrongAuthData = false"
              :disabled="authInProcess"
              class="form-control"
            >
            </b-form-input>

            <b-form-invalid-feedback v-if="$v.user.username.$model === ''"
              >Пожалуйста, заполните это поле</b-form-invalid-feedback
            >
          </b-form-group>
        </div>

        <div class="col-12 col-lg-4 mt-3 mt-lg-0">
          <b-form-group label="Пароль" label-cols="12">
            <b-form-input
              v-model="$v.user.password.$model"
              placeholder="Пароль"
              type="password"
              :state="wrongAuthData ? false : validateState('password')"
              @blur="$v.user.password.$touch()"
              @input="wrongAuthData = null"
              class="form-control"
              :disabled="authInProcess"
            ></b-form-input>
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
          v-if="isCaptchaNeeded && !authInProcess && wrongAuthData === true"
          class="col-12 mt-3 mt-lg-0"
        >
          <captcha
            @update="setIdCaptcha($event)"
            @updateCode="setCodeCaptcha($event)"
            :isCaptchaValid="this.captchaMessage"
          />

          <!-- <div class="col-12 invalid-feedback d-block" v-if="wrongAuthData">
            {{ this.captchaMessage }}
          </div> -->
        </div>
      </div>
      <b-button
        v-on:enter="fetchToken()"
        variant="primary"
        type="submit"
        :disabled="authInProcess"
        class="mt-4"
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
      hideTelephoneMessage: null,
      duration: 60,
      isUsernameBlured: true,
      isPasswordBlured: true,
      isValidStateCodeSMS: null,
      isValidStateCodeCaptcha: null,
      isRetrySendCodeSMS: false,
      isSendingCodeSMS: false,
      isCaptchaNeeded: false,
      autofocus: true,
      placeholder: "Телефон или почта",
      errorMessage: null,
      authInProcess: false,
      captchaToken: null,
      loginTouchesCount: 0,
      isDropDownShown: false,
    };
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

  methods: {
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
          body = { ...body, code: this.$v.user.code.$model };
        }

        const {
          data: { ACCESS_TOKEN, REFRESH_TOKEN },
        } = await axios.post("/am/authw/v2/authorize", body);

        this.$bvModal.hide("sms-confirm");
        document.cookie = `auth.strategy=local;`;
        document.cookie = `auth._token.local=Bearer%20${ACCESS_TOKEN};`;
        document.cookie = `auth._refresh_token.local=${REFRESH_TOKEN};`;
        window.location.href = "/cabinet/55/0/701";

        const attempt = new URL(window.location.href);

        if (attempt.searchParams.has("ref")) {
          window.location.href = `${attempt.searchParams.get("ref")}`;
        }
      } catch (e) {
        this.authInProcess = false;
        if (e?.response?.data.STATUS === 401) {
          this.hideTelephoneMessage = e.response.data.SMSPHONE;
          this.wrongAuthData = true;
        }
        // Выведение сообщения при наличии капчи
        if (e?.response?.data.NEEDCAPTCHA) {
          this.captchaMessage = e.response.data.MESSAGE;
        }
        if (e?.response?.data.NEEDCAPTCHA === false) {
          this.captchaMessage = null;
        }
        //
        if (e?.response?.data.CODE === 105) {
          this.isValidStateCodeSMS = false;
          this.user.code = "";
          return;
        }
        if (
          e?.response?.data.STATUS === 500 ||
          e?.response?.data.CODE === 104
        ) {
          this.user.cap = null;
          this.user.capid = null;
          this.$bvModal.show("sms-confirm");
          return;
        }

        if (
          e?.response?.data.STATUS === 403 ||
          e?.response?.data.CODE === 106
        ) {
          this.isCaptchaNeeded = true;
          return;
        }

        this.errorMessage = `Неверный номер или пароль`;
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
