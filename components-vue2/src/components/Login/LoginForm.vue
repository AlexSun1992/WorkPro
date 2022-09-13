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
        На номер телефона {{ user.username }} был отправлен код подверждения
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
            <b-button
              :disabled="authInProcess || user.code === ''"
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
      <div class="row">
        <div class="col-12 col-lg-6">
          <legend>Авторизация с помощью</legend>
          <b-dropdown
            id="dropdown-1"
            :text="!isEmailTypeRegistrationChoosen ? 'Номер телефона' : 'Email'"
            variant="dropdown-select"
            class="dropdown-select"
          >
            <!--<b-dropdown-item
              v-for="item in dropDownData"
              :key="item.id"
              @click="toggleAuthType()"
            >
              {{ item }}
            </b-dropdown-item>-->
            <b-dropdown-item-button
              @click="toggleAuthType()"
              v-if="isEmailTypeRegistrationChoosen"
              >Номер телефона</b-dropdown-item-button
            >
            <b-dropdown-item-button
              @click="toggleAuthType()"
              v-if="!isEmailTypeRegistrationChoosen"
              >Email</b-dropdown-item-button
            >
          </b-dropdown>
        </div>

        <div
          class="col-12 col-lg-6 mt-3 mt-lg-0"
          v-if="isEmailTypeRegistrationChoosen === false"
        >
          <b-form-group label="Телефон или email" label-cols="12">
            <b-form-input
              id="phone"
              ref="phoneInput"
              v-model="$v.user.username.$model"
              v-mask="usernameMask"
              :placeholder="placeholder"
              autofocus
              type="tel"
              :state="validateInput('username', isUsernameBlured)"
              @blur="debouncedUpdate('username', isUsernameBlured)"
              @input="isUsernameBlured = false"
              @click="loginTouchesCount = 2"
              @paste="checkPastedValue"
              :disabled="authInProcess"
              class="form-control"
            >
            </b-form-input>

            <b-form-invalid-feedback
              >Пожалуйста, введите корректный номер
              телефона</b-form-invalid-feedback
            >
          </b-form-group>
        </div>

        <div
          class="col-12 col-lg-6 mt-3 mt-lg-0"
          v-if="isEmailTypeRegistrationChoosen"
        >
          <b-form-group
            class="required"
            label="Телефон или email"
            label-cols="12"
          >
            <autocomplete
              ref="Email"
              placeholder="Email"
              :search="getSuggestionsEmail"
              :get-result-value="getResultValueEmail"
              :disabled="authInProcess"
              :class="emailClassHub"
              @blur="handleBlur('Email')"
              @submit="checkInputValue"
            />

            <b-form-invalid-feedback :state="isEmailErrorMessage"
              >Пожалуйста, заполните это поле</b-form-invalid-feedback
            >
            <b-form-invalid-feedback :state="isEmailValidSignsErrorMessage"
              >Просьба корректно указать email</b-form-invalid-feedback
            >
          </b-form-group>
        </div>

        <div class="col-12 col-lg-6 mt-3">
          <b-form-group label="Пароль" label-cols="12">
            <b-form-input
              v-model="$v.user.password.$model"
              placeholder="Пароль"
              type="password"
              :state="validateInput('password', isPasswordBlured)"
              @blur="blurField('password', isPasswordBlured)"
              @input="isPasswordBlured = false"
              class="form-control"
              :disabled="authInProcess"
            ></b-form-input>
            <b-form-invalid-feedback
              >Пожалуйста, введите пароль
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
        <div class="col-12 col-lg-6 mt-3 mt-lg-4 pt-lg-2">
          <a
            href="/login/password-recovery"
            id="btn_recovery-password_lk"
            class="mt-lg-4 d-table"
            >Не помните пароль?</a
          >
        </div>
      </div>
      <b-button
        v-on:enter="fetchToken()"
        variant="primary"
        type="submit"
        :disabled="authInProcess"
        class="w-100 mt-3"
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
import { mask } from "vue-the-mask";
import {
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BSpinner,
  BButton,
  BModal,
  BDropdown,
} from "bootstrap-vue";

import {
  fetchEmail,
  getSuggestions,
  getArrayWithClass,
  isEmailRight,
} from "./RegForm/dadata.helper";
import Autocomplete from "@trevoreyre/autocomplete-vue";
import { validationMixin } from "vuelidate";
import { required, minLength, helpers, email } from "vuelidate/lib/validators";
import _ from "lodash";
import Cookies from "js-cookie";
import {
  isPhoneNumberValid,
  getRestructuredPhoneNumber,
} from "./loginForm.helper";
import VerifyTimer from "./Libs/VerifyUser/VerifyTimer";

const alpha = helpers.regex(
  "alpha",
  /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/
);

export default {
  name: "LoginForm",
  components: {
    BDropdown,
    Autocomplete,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BSpinner,
    BButton,
    BModal,
    VerifyTimer,
  },
  mixins: [validationMixin],
  directives: { mask },
  data() {
    return {
      user: {
        username: "",
        useremail: "",
        password: "",
        code: "",
      },
      duration: 60,
      isUsernameBlured: true,
      isPasswordBlured: true,
      isEmailBlured: true,
      isValidStateCodeSMS: null,
      isRetrySendCodeSMS: false,
      isSendingCodeSMS: false,
      autofocus: true,
      usernameMask: "+7(###)-###-##-##",
      placeholder: "+7(___)-___-__-__",
      errorMessage: null,
      authInProcess: false,
      captchaToken: null,
      loginTouchesCount: 0,
      emailHub: [],
      isEmailTouch: false,
      emailClassHub: [],
      isEmailErrorMessage: true,
      isEmailValidSignsErrorMessage: true,
      isDropDownShown: false,
      dropDownData: ["Номер телефона", "Email"],
      isEmailTypeRegistrationChoosen: false,
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

  computed: {
    email() {
      if (this.isEmailTypeRegistrationChoosen === true) {
        return this.$refs.Email.value;
      }
      return null;
    },
  },

  methods: {
    toggleAuthType() {
      this.isEmailTypeRegistrationChoosen =
        !this.isEmailTypeRegistrationChoosen;
    },

    checkPastedValue(event) {
      const pastedValue = event.clipboardData.getData("text");

      const isPhoneValid = isPhoneNumberValid(pastedValue);

      if (isPhoneValid) {
        const reStructureNumber = getRestructuredPhoneNumber(pastedValue);
        this.$v.user.username.$model = reStructureNumber;
      }
    },

    checkInputValue(input) {
      const checkInputValue = isEmailRight(input.value);
      if (checkInputValue === true) {
        getArrayWithClass(this.emailClassHub, "is-valid");
      }
    },
    handleBlur(field) {
      if (field === "email" && this.email === "") {
        this.isEmailErrorMessage = false;
        this.emailClassHub.push("is-invalid");
      }

      const isInputValid = isEmailRight(this.email);

      if (isInputValid === false && this.email !== "") {
        this.isEmailValidSignsErrorMessage = false;
        this.isEmailErrorMessage = true;
        getArrayWithClass(this.emailClassHub, "is-invalid");
      }

      if (isInputValid === false && this.email === "") {
        this.isEmailValidSignsErrorMessage = true;
        this.isEmailErrorMessage = false;
        getArrayWithClass(this.emailClassHub, "is-invalid");
      }

      if (isInputValid) {
        this.isEmailValidSignsErrorMessage = true;
        this.isEmailErrorMessage = true;
        getArrayWithClass(this.emailClassHub, "is-valid");
      }
    },

    getResultValueEmail(item) {
      return item.value;
    },

    async getSuggestionsEmail(input) {
      this.emailHub = [];
      const isInputValid = isEmailRight(this.email);

      if (input.length > 0) {
        this.isEmailTouch = true;
        this.isEmailErrorMessage = true;
        this.isEmailValidSignsErrorMessage = true;
        if (isInputValid === false) {
          this.emailClassHub = [];
        }

        if (isInputValid === true) {
          this.isEmailErrorMessage = true;
          getArrayWithClass(this.emailClassHub, "is-valid");
        }
      }

      if (this.isEmailTouch && input === "") {
        this.isEmailErrorMessage = false;
        this.isEmailValidSignsErrorMessage = true;
        getArrayWithClass(this.emailClassHub, "is-invalid");
      }

      const getDataEmail = await fetchEmail(input);
      const fetchedEmail = getSuggestions(
        getDataEmail,
        this.emailHub,
        this.email
      );

      return fetchedEmail;
    },

    async fetchToken() {
      try {
        this.authInProcess = true;
        let body = {
          mode: 2,
          password: this.$v.user.password.$model,
          username:
            this.isEmailTypeRegistrationChoosen === true
              ? this.email
              : this.$v.user.username.$model,
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
        if (e?.response?.data.CODE === 105 || e?.response?.data.CODE === 106) {
          this.isValidStateCodeSMS = false;
          this.user.code = "";
          return;
        }
        if (
          e?.response?.data.STATUS === 500 ||
          e?.response?.data.CODE === 104
        ) {
          this.$bvModal.show("sms-confirm");
          return;
        }

        this.errorMessage = `Неверный ${this.choosenTypeOfAuth} или пароль`;
        if (this.email === "") {
          this.isEmailErrorMessage = false;
          getArrayWithClass(this.emailClassHub, "is-invalid");
          return;
        }
        const isInputValid = isEmailRight(this.email);
        if (isInputValid === false && this.choosenTypeOfAuth === "Email") {
          this.isEmailValidSignsErrorMessage = false;
          getArrayWithClass(this.emailClassHub, "is-invalid");
          return;
        }
      }
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
    validateInput(field, bluredField) {
      if (this.errorMessage) {
        return false;
      }
      if (
        field === "username" &&
        this.loginTouchesCount <= 2 &&
        this.isUsernameBlured &&
        !this.$v.user[field].$model
      )
        return;
      if (
        (this.$v.user[field].$model &&
          this.$v.user[field].$params.minLength &&
          this.$v.user[field].$model.length ===
            this.$v.user[field].$params.minLength.min) ||
        bluredField
      ) {
        return this.validateState(field);
      }
    },

    blurField(field) {
      if (field === "username") {
        this.loginTouchesCount++;
        this.isUsernameBlured = true;
      } else if (field === "password") {
        this.isPasswordBlured = true;
      } else if (field === "useremail") {
        this.isEmailBlured = true;
      }
      this.$v.user[field].$touch();
    },

    validateState(name) {
      const { $dirty, $error } = this.$v.user[name];
      return $dirty ? !$error : null;
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
        minLength: minLength(17),
      },
      useremail: {
        required,
        alpha,
        email,
      },
      password: {
        required,
      },
      code: {
        required,
        minLength: minLength(5),
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

.dropdown-menu.show li:hover {
  background: #f4f7f5;
}
@media (max-width: 992px) {
  .btn-dropdown-select {
    height: 50px;
  }
}
</style>
