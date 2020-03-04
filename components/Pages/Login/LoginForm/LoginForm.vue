<template>
  <div>
    <b-alert :show="errorMessage" variant="danger">{{ errorMessage }}</b-alert>
    <b-form @submit.prevent="onSubmit">
      <b-form-group label="Телефон">
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
          class="form-control"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, введите корректный номер телефона</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Пароль">
        <b-form-input
          v-model="$v.user.password.$model"
          placeholder="Пароль"
          type="password"
          :state="validateInput('password', isPasswordBlured)"
          @blur="blurField('password', isPasswordBlured)"
          @input="isPasswordBlured = false"
          class="form-control"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, введите пароль</b-form-invalid-feedback>
      </b-form-group>
      <b-button variant="success" type="submit">Авторизоваться</b-button>
    </b-form>
  </div>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";
import _ from 'lodash'

export default {
  data() {
    return {
      user: {
        username: "",
        password: ""
      },
      isUsernameBlured: true,
      isPasswordBlured: true,
      usernameMask: "+7(###)-###-##-##",
      placeholder: "+7(___)-___-__-__",
      errorMessage: null
    };
  },

  created() {
    this.debouncedUpdate = _.debounce(this.blurField, 100)
    this.initialCount = this.count;
    this.resendCount = this.count;
  },

  methods: {
    async login() {
      try {
        await this.$auth.loginWith("local", {
          headers: {},
          data: {
            username: this.$v.user.username.$model,
            password: this.$v.user.password.$model,
            mode: 2
          }
        });
        this.$router.push("/");
      } catch (e) {
        if (this.$auth.error.response.status === 401) {
          this.errorMessage = this.$auth.error.response.data.MESSAGE;
        }
      }
    },

    validateInput(field, bluredField) {
      if (this.$v.user[field].$model && 
          this.$v.user[field].$params.minLength && 
          (this.$v.user[field].$model.length === this.$v.user[field].$params.minLength.min) || bluredField) {
        return this.validateState(field);
      }
    },

    blurField(field, bluredField) {
      if (field === 'username') {
        this.isUsernameBlured = true;
      } else if (field === 'password') {
        this.isPasswordBlured = true;
      }
      this.$v.user[field].$touch();  
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
    }
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
};
</script>

<style scoped>
</style>
