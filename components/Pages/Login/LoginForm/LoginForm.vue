<template>
  <b-form @submit.prevent="onSubmit">
    <b-form-group label="Телефон">
      <b-form-input
        v-model="$v.user.username.$model"
        v-mask="usernameMask"
        :placeholder="placeholder"
        type="tel"
        :state="validateState('username')"
        class="form-control">
      </b-form-input>
      <b-form-invalid-feedback>Пожалуйста, введите корректный номер телефона</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Пароль">
      <b-form-input
        v-model="$v.user.password.$model"
        placeholder="Пароль"
        v-mask="passwordMask"
        type="password"
        :state="validateState('password')"
        class="form-control">
      </b-form-input>
      <b-form-invalid-feedback>Пожалуйста, введите пароль</b-form-invalid-feedback>
    </b-form-group>
    <b-button variant="success" type="submit">Авторизоваться</b-button>
  </b-form>
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
      passwordMask: 'NNNNNN',
      placeholder: '+7(___)-___-__-__'
    }
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
            captcha: this.captcha
          }
        });
        this.$router.push('/')
      } catch (e) {
        console.log(e)
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
    }
  },

  validations: {
    user: {
      username: {
        required,
        minLength: minLength(17)
      },
      password: {
        required,
        minLength: minLength(6)
      }
    }
  }
}
</script>

<style scoped>
</style>
