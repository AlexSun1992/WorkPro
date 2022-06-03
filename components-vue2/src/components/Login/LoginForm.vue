<template>
  <div class="login-form-content">
    <div class="row justify-content-center">
      <div class="mb-5 col-md-10 col-lg-7">
        <div class="block-registration px-2 px-md-4 pb-3 mt-3">
          <b-nav card-header tabs>
            <b-nav-item active>Вход</b-nav-item>
            <b-nav-item
              href="/login/registration"
              class="d-none d-lg-inline-block"
              >Регистрация</b-nav-item
            >
          </b-nav>
          <div>{{ errorMessage }}</div>
          <b-form @submit.prevent="onSubmit">
            <b-form-group label="Телефон" label-cols="12">
              <b-form-input
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
          <a href="/login/registration" class="login-btn-mobile d-lg-none mt-3"
            >Регистрация</a
          >
          <div class="mt-3 text-center">
            <span class="forgot-password">Забыли пароль?&nbsp;&nbsp;</span>
            <a href="/login/password-recovery" id="btn_recovery-password_lk"
              >Восстановить</a
            >
          </div>
        </div>
      </div>
    </div>
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
  BNav,
  BNavItem,
} from "bootstrap-vue";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import _ from "lodash";
import Cookies from "js-cookie";

//const COOKIE_NAME = "url";

export default {
  components: {
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BSpinner,
    BButton,
    BNav,
    BNavItem,
  },
  mixins: [validationMixin],
  directives: { mask },
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      isUsernameBlured: true,
      isPasswordBlured: true,
      autofocus: true,
      usernameMask: "+7(###)-###-##-##",
      placeholder: "+7(___)-___-__-__",
      errorMessage: null,
      authInProcess: false,
      captchaToken: null,
      loginTouchesCount: 0,
    };
  },

  created() {
    this.debouncedUpdate = _.debounce(this.blurField, 100);
    this.initialCount = this.count;
    this.resendCount = this.count;
  },

  methods: {
    async fetchToken() {
      try {
        this.authInProcess = true;
        let {
          data: { ACCESS_TOKEN, REFRESH_TOKEN },
        } = await axios.post("/am/auth/v2/authorize", {
          mode: 2,
          password: this.$v.user.password.$model,
          username: this.$v.user.username.$model,
        });
        document.cookie = `auth.strategy=local;`;
        document.cookie = `auth._token.local=Bearer%20${ACCESS_TOKEN};`;
        document.cookie = `auth._refresh_token.local=${REFRESH_TOKEN};`;
        window.location.href = "/cabinet/55/0/701";

        const attempt = new URL(window.location.href);

        if (attempt.searchParams.has("ref")) {
          window.location.href = `${attempt.searchParams.get("ref")}`;
        }
      } catch (e) {
        this.errorMessage = "Неверный телефон или пароль";
        this.authInProcess = false;
        console.log(e);
      }
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
  },

  validations: {
    user: {
      username: {
        required,
        minLength: minLength(17),
      },
      password: {
        required,
      },
    },
  },
};
</script>

<style></style>
