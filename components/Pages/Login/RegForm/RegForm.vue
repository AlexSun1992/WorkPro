<template>
  <div>
    <ConfirmModal
      :conformation="conformation"
      @agree="isRegConfirmed = $event"
    />
    <!-- Алерт ошибки кода регистрации Андрея (на восстановлении у Жени) -->
    <b-alert :show="errorMessage" variant="danger">{{ errorMessage }}</b-alert>
    <!--  -->
    <!-- Алерт ошибки кода регистрации (удалить после восстановления) -->
    <b-alert :show="!!errorMessage" variant="danger">{{
      errorMessage
    }}</b-alert>
    <!--  -->
    <b-form @submit.stop.prevent="onSubmit" inline class="align-items-start">
      <b-form-group label-cols="12" class="col-12">
        <verify-user
          ref="verifyUser"
          :v="$v.form"
          :count="60"
          :context="'registration'"
          :loginType="'phone'"
          :validateState="validateState"
          :disabled="registrationInProcess"
        />
      </b-form-group>
      <b-form-group label="E-mail" label-cols="12" class="col-12 col-md-6">
        <b-form-input
          v-model.lazy="$v.form.email.$model"
          :state="validateState('email')"
          autocomplete="off"
          @blur="$v.form.email.$touch()"
          placeholder="E-mail"
          :disabled="registrationInProcess"
        ></b-form-input>
        <b-form-invalid-feedback
          >Пожалуйста, заполните это поле</b-form-invalid-feedback
        >
      </b-form-group>

      <b-form-group
        label="Дата рождения"
        label-cols="12"
        class="col-12 col-md-6"
      >
        <birthday-picker
          :data="$v.form"
          :state="validateState('birthdate')"
          :disabled="registrationInProcess"
        />
      </b-form-group>
      <div class="d-flex w-100">
        <b-form-group label="Фамилия" label-cols="12" class="col-12 col-md-6">
          <b-form-input
            v-model="$v.form.family.$model"
            :state="validateState('family')"
            @blur="$v.form.family.$touch()"
            placeholder="Фамилия"
            :disabled="registrationInProcess"
          ></b-form-input>
          <b-form-invalid-feedback
            >Пожалуйста, заполните это поле</b-form-invalid-feedback
          >
        </b-form-group>
      </div>
      <b-form-group label="Имя" label-cols="12" class="col-12 col-md-6">
        <b-form-input
          v-model="$v.form.name.$model"
          :state="validateState('name')"
          @blur="$v.form.name.$touch()"
          placeholder="Имя"
          :disabled="registrationInProcess"
        ></b-form-input>
        <b-form-invalid-feedback
          >Пожалуйста, заполните это поле</b-form-invalid-feedback
        >
      </b-form-group>
      <b-form-group label="Отчество" label-cols="12" class="col-12 col-md-6">
        <b-form-input
          v-model="$v.form.patronymic.$model"
          :state="validateState('patronymic')"
          @blur="$v.form.patronymic.$touch()"
          placeholder="Отчество"
          :disabled="registrationInProcess"
        ></b-form-input>
        <b-form-invalid-feedback
          >Пожалуйста, заполните это поле</b-form-invalid-feedback
        >
      </b-form-group>

      <b-form-group label="Номер полиса" label-cols="12" class="col-12">
        <b-form-input
          id="input-3"
          v-model="form.policyNumber"
          placeholder="Номер полиса"
          :disabled="registrationInProcess"
        ></b-form-input>
      </b-form-group>

      <verify-password
        :v="$v.form"
        :validateState="validateState"
        :disabled="registrationInProcess"
      />
      <div class="col-12 m-auto pt-3">
        <b-button
          class="w-100"
          type="submit"
          variant="success"
          :disabled="
            registrationInProcess || !!this.$store.getters.getRegistrationError
          "
        >
          Зарегистрироваться
          <b-spinner
            v-if="registrationInProcess"
            style="width: 1.2rem; height: 1.2rem"
            variant="light"
          ></b-spinner>
        </b-button>
      </div>
    </b-form>
    <recaptcha @error="onError" @success="onSuccess" @expired="onExpired" />
  </div>
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";

import birthdayPicker from "../../../Libs/BirthdatePicker/BirthdatePicker";
import VerifyUser from "../../../Libs/VerifyUser/VerifyUser";
import VerifyPassword from "../../../Libs/VerifyPassword/VerifyPassword";
import ConfirmModal from "./ConfirmModal";

export default {
  components: { birthdayPicker, VerifyUser, VerifyPassword, ConfirmModal },
  mixins: [validationMixin],

  data() {
    return {
      form: {
        phone: "",
        email: "",
        family: "",
        name: "",
        patronymic: "",
        birthdate: "",
        policyNumber: "",
        code: "",
        password: "",
        password2: "",
      },
      conformation: false,
      show: true,
      password2: "",
      registrationInProcess: false,
      captchaToken: null,
      isRegConfirmed: null,
      token: null,
    };
  },
  validations: {
    form: {
      name: {
        required,
      },
      family: {
        required,
      },
      patronymic: {
        required,
      },
      birthdate: {
        required,
      },
      code: {
        required,
        minLength: minLength(4),
      },
      password: {
        required,
      },
      password2: {
        required,
        sameAsPassword: sameAs("password"),
      },
      phone: {
        required,
        minLength: minLength(17),
      },
      email: {
        required,
        email,
      },
    },
  },
  methods: {
    onError(error) {
      console.log("Error:", error);
    },
    onSuccess(token) {
      this.token = token;
      console.log("Succeeded:", token);
    },
    onExpired() {
      console.log("Expired");
    },
    async getCaptcha() {
      try {
        const token = await this.$recaptcha.getResponse();
        await this.$recaptcha.reset();
      } catch (error) {
        console.log("Login error:", error);
      }
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    async setToken(context) {
      this.registrationInProcess = true;
      let params = {
        SECONDNAME: this.$v.form.family.$model,
        FIRSTNAME: this.$v.form.name.$model,
        THIRDNAME: this.$v.form.patronymic.$model,
        BIRTHDATE: this.$v.form.birthdate.$model.toISOString().split("T")[0],
        PHONE: this.$v.form.phone.$model,
        EMAIL: this.$v.form.email.$model,
        CODE: this.$v.form.code.$model,
        POLICY_NUMBER: "",
        PASSWORD: this.$v.form.password.$model,
        PASSWORD_CONFIRM: this.$v.form.password2.$model,
        USER_CONFIRM: this.isRegConfirmed ? "Y" : "N",
      };

      await this.getCaptcha();

      if (!this.token) return;
      params = { ...params, token: this.token };

      const response = await this.$store.dispatch("registerUser", params);
      // Удалить с появлением обработки ошибки
      if (!response) {
        this.registrationInProcess = false;
      }

      if (response && response.MESSAGE_CODE === "510") {
        this.conformation = true;
        return;
      }

      if (response) {
        try {
          await context.$auth.loginWith("local", {
            data: {
              username: context.$v.form.phone.$model,
              password: context.$v.form.password.$model,
              mode: 2,
            },
          });
        } catch (e) {
          if (context.$auth.error?.response.status === 401) {
            context.errorMessage = context.$auth.error.response.data.MESSAGE;
            context.authInProcess = false;
          }
        }
      } else {
        this.$refs.verifyUser.code = null;
      }
    },

    async onSubmit() {
      try {
        this.$refs.verifyUser.loginTouchesCount = 3;
        if (this.$v.form.phone.$model) {
          this.$refs.verifyUser.getCode();
          this.$refs.verifyUser.isPhoneChanged = true;
        }
        this.$v.form.$touch();
        if (this.$v.form.$anyError) {
          return;
        }
        this.setToken(this);
      } catch (e) {
        console.log(e);
      }
    },
  },

  computed: {
    errorMessage() {
      // if (this.$store.getters.getRegistrationError) {
      //   this.registrationInProcess = false;
      //   if (this.$refs.verifyUser) {
      //     this.$refs.verifyUser.$refs.userInput.$el.focus();
      //     this.$refs.verifyUser.resendCount = null;
      //   }
      //   return this.$store.getters.getRegistrationError.toString();
      // }
      //
      // if (
      //   !this.$store.getters.getRegistrationError &&
      //   this.$store.getters.isAuthenticated
      // ) {
      //   //this.$router.push("/cabinet/55/0/701");
      // }
    },
  },

  watch: {
    isRegConfirmed: function (val) {
      if (val) {
        this.setToken(this);
      } else {
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "~/assets/scss/reg.scss";
</style>
