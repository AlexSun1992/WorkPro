<template>
  <div class="container">
    <!-- <b-alert :show="errorMessage" variant="danger">{{ errorMessage }}</b-alert> -->
    <h5 class="mb-3">{{ !isCodeValid ? "Восстановление доступа" : "Изменение пароля" }}</h5>
    <verify-phone v-if="!isCodeValid" :v="$v.form" :count="20" :validateState="validateState"/>
    <verify-password :recovery="true" v-else :v="$v.form" :validateState="validateState"/>
    <div class="mt-2 d-flex justify-content-between">
      <router-link to="/login">
        <b-button variant="outline-secondary">Отмена</b-button>
      </router-link>
      <b-button variant="success" v-if="!changePasswordActive" @click="validateCode" :disabled="$v.form.code.$invalid">Далее</b-button>
      <b-button variant="success" v-if="changePasswordActive" @click="savePassword" :disabled="$v.form.password2.$invalid">Сохранить</b-button>
    </div>
  </div>
</template>

<script>
import VerifyPhone from '~/components/Libs/VerifyPhone/VerifyPhone'
import VerifyPassword from '~/components/Libs/VerifyPassword/VerifyPassword'
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";


export default {
  components: {
    VerifyPhone,
    VerifyPassword
  },
  data() {
    return {
      isCodeValid: false,
      captchaToken: '',
      errorMessage: null,
      form: {
        phone: '',
        code: '',
        password: '',
        password2: ''
      },
      changePasswordActive: false
    }
  },

  methods: {

    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    async validateCode() {
      this.captchaToken = await this.$getCaptcha();
      const params = {
        code: this.$v.form.code.$model,
        RECAPTCHA: this.captchaToken
      }
      // const response = this.$store.dispatch('validateCode', params)
      // this.errorMessage = 'Неправильный код, попробуйте ещё раз'
      this.isCodeValid = true; // Удалить с появлением метода validateCode
      this.changePasswordActive = true;
    },

    async savePassword() {
      this.captchaToken = await this.$getCaptcha();
      const params = {
        password: this.$v.form.password.$model,
        RECAPTCHA: this.captchaToken
      }
      // const response = this.$store.dispach('resetPassword', params)
      const response = true; // Удалить с появлением метода resetPassword
      if (response) {
        this.$router.push('/login')
      } else {
        this.errorMessage = "При изменении пароля произошла ошибка, попробуйте ещё раз";
      }
    },
  },

  validations: {
    form: {
      phone: {
        required,
        minLength: minLength(17)
      },
      code: {
        required,
        minLength: minLength(5)
      },
      password: {
        required
      },
      password2: {
        required,
        sameAsPassword: sameAs('password')
      },
    }
  }
  
};
</script>

<style scoped>
  .container {
    max-width: 540px;
    padding: 1rem;
    border: 1px solid #a4b7c1;
  }
</style>
