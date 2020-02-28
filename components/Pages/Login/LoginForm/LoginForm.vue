<template>
  <div>
    <b-alert :show="errorMessage" variant="danger">{{ errorMessage }}</b-alert>
    <b-form @submit.prevent="onSubmit">
    <b-form-group label="Телефон">
      <b-form-input
        v-if="!phoneBlured"
        v-model="$v.user.username.$model"
        v-mask="usernameMask"
        :placeholder="placeholder"
        type="tel"
        @blur="phoneFieldValidate"
        @input="checkPhoneInput($v.user.username.$model)"
        autofocus
        class="form-control">
      </b-form-input>
      <b-form-input
        v-if="phoneBlured"
        v-model="$v.user.username.$model"
        v-mask="usernameMask"
        :placeholder="placeholder"
        type="tel"
        :state="validateState('username')"
        @input="checkPhoneInput($v.user.username.$model)"
        @blur="phoneFieldValidate"
        class="form-control">
      </b-form-input>
      <b-form-invalid-feedback>Пожалуйста, введите корректный номер телефона</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Пароль">
      <b-form-input
        v-if="!passwordBlured"
        v-model="$v.user.password.$model"
        placeholder="Пароль"
        type="password"
        @blur="passwordFieldValidate"
        class="form-control">
      </b-form-input>
      <b-form-input
        v-if="passwordBlured"
        v-model="$v.user.password.$model"
        placeholder="Пароль"
        type="password"
        @blur="passwordFieldValidate"
        :state="validateState('password')"
        class="form-control">
      </b-form-input>
      <b-form-invalid-feedback>Пожалуйста, введите пароль</b-form-invalid-feedback>
    </b-form-group>
    <b-button variant="success" type="submit">Авторизоваться</b-button>
  </b-form>
  </div>
</template>

<script>
import { required, minLength, sameAs } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      captcha: null,
      usernameMask: '+7(###)-###-##-##',
      // passwordMask: 'NNNNNN',
      placeholder: '+7(___)-___-__-__',
      phoneBlured: false,
      passwordBlured: false,
      errorMessage: null
    }
  },

  created(){
    this.phoneBlured = true;
    this.passwordBlured = true;
  },
  methods: {
    async login() {
      try {
        // this.captcha = await (this as any).$getCaptcha();
        await this.$auth.loginWith('local', {
          headers: {},
          data: {
            username: this.$v.user.username.$model,
            password: this.$v.user.password.$model,
            mode: 2,
            // captcha: this.captcha
          }
        });
        this.$router.push('/')
      } catch (e) {
        if (this.$auth.error.response.status === 401){
          this.errorMessage = this.$auth.error.response.data.MESSAGE;
        }
      }
    },

    validateState(name) {
      const { $dirty, $error } = this.$v.user[name];
      return $dirty ? !$error : null;
    },

    onSubmit() {
      this.$v.user.$touch();
      if (this.$v.user.$anyError) {
        return;
      }
      this.login();
    },

    phoneFieldValidate() {
      this.phoneBlured = true;
      this.$v.user.username.$touch();
    },

    checkPhoneInput(value) {
      if (value.length > 16) {
        this.phoneBlured = true;
      } else {
        this.phoneBlured = false;
      }
    },

    passwordFieldValidate() {
      this.passwordBlured = true;
      this.$v.user.password.$touch();
    },

    // checkPasswordInput(value) {
    //   if (value.length > 5) {
    //     this.passwordBlured = true;
    //   } else {
    //     this.passwordBlured = false;
    //   }
    // },
  },

  validations: {
    user: {
      username: {
        required,
        minLength: minLength(17)
      },
      password: {
        required
      }
    }
  }
}
</script>

<style scoped>
</style>
