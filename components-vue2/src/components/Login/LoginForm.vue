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
      <b-form-group label="Авторизация с помощью">
        <autocomplete
          ref="authChoosenType"
          :search="getDataForAuth"
          @click="getDataForAuth"
          :get-result-value="getResultValue"
          :default-value="dataNeededForAuth[0]"
        />
      </b-form-group>
      <div>
        <b-form-group
          label="Телефон или email"
          label-cols="12"
          v-if="this.revealAuthType === 'Номер телефона'"
        >
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

      <div>
        <b-form-group
          class="required"
          label="Телефон или email"
          label-cols="12"
          v-if="this.revealAuthType === 'email'"
        >
          <autocomplete
            ref="email"
            placeholder="email"
            :search="getSuggestionsEmail"
            :get-result-value="getResultValueEmail"
            :disabled="authInProcess"
            :class="emailClassHub"
            @blur="handleBlur('email')"
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

      <div>
        <b-form-group label="Пароль" label-cols="12" class="mt-3">
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
      <div class="mt-3 text-center">
        <a href="/login/password-recovery" id="btn_recovery-password_lk"
          >Не помните пароль?</a
        >
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
import VerifyTimer from "./Libs/VerifyUser/VerifyTimer";

const alpha = helpers.regex(
  "alpha",
  /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/
);

const regex =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

export default {
  name: "LoginForm",
  components: {
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
      dataNeededForAuth: ["Номер телефона", "email"],
      isRefsAvailable: false,
      choosenTypeOfAuth: "",
      emailHub: [],
      //
      isEmailTouch: false,
      // classes
      emailClassHub: [],
      // error
      isEmailErrorMessage: true,
      isEmailValidSignsErrorMessage: true,
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

  mounted() {
    if (this.$refs.authChoosenType.value) {
      this.isRefsAvailable = true;
    }
  },

  computed: {
    revealAuthType() {
      if (this.isRefsAvailable === true) {
        return this.$refs.authChoosenType.value;
      }
      return null;
    },
    email() {
      return this.$refs.email.value;
    },
    emailClass() {
      return this.emailClass;
    },
  },

  watch: {
    revealAuthType(value) {
      if (value === "email") {
        this.choosenTypeOfAuth = "email";
      }

      if (value === "Номер телефона") {
        this.choosenTypeOfAuth = "телефон";
      }
      if (value === "") {
        this.choosenTypeOfAuth = "телефон";
      }
    },
  },

  methods: {
    checkInputValue(input) {
      const checkInputValue = isEmailRight(regex, input.value);
      if (checkInputValue === true) {
        getArrayWithClass(this.emailClassHub, "is-valid");
      }
    },
    handleBlur(field) {
      if (field === "email" && this.email === "") {
        this.isEmailErrorMessage = false;
        this.emailClassHub.push("is-invalid");
      }

      const isInputValid = isEmailRight(regex, this.email);

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

    getDataForAuth() {
      return this.dataNeededForAuth;
    },

    getResultValueEmail(item) {
      return item.value;
    },

    async getSuggestionsEmail(input) {
      this.emailHub = [];
      const isInputValid = isEmailRight(regex, this.email);

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

    getResultValue(item) {
      return item;
    },
    async fetchToken() {
      try {
        this.authInProcess = true;
        let body = {
          mode: 2,
          password: this.$v.user.password.$model,
          username:
            this.revealAuthTyp === "Номер телефона"
              ? this.$v.user.username.$model
              : this.$v.user.useremail.$model,
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
        const isInputValid = isEmailRight(regex, this.email);
        if (isInputValid === false && this.choosenTypeOfAuth === "email") {
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

<style></style>
