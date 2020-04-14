<template>
  <div class="container">
    <b-alert :show="errorMessage" variant="danger">{{ errorMessage }}</b-alert>
    <h5 class="mb-3">Восстановление доступа</h5>
    <b-tabs ref="tabs" content-class="mt-2">
      <b-tab title="Телефон" active>
        <verify-user :label="phoneLabel" :loginType="'phone'" :v="$v.form" :count="60" :validateState="validateState"/>
      </b-tab>
      <b-tab title="Email">
        <verify-user :label="emailLabel" :loginType="'email'" :v="$v.form" :count="60" :validateState="validateState"/>
      </b-tab>
    </b-tabs>
    <UserRecoveryForm v-if="greater180" :v="$v.form" :validateState="validateState"/>
    <b-form-group>
      <b-form-input
        type="password"
        v-model="$v.form.password.$model"
        placeholder="Пароль"
      ></b-form-input>
      <b-form-invalid-feedback>Введите пароль</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group>
      <b-form-input
        type="password"
        v-model="$v.form.password2.$model"
        placeholder="Повторите пароль"
      ></b-form-input>
      <b-form-invalid-feedback>Повторите пароль</b-form-invalid-feedback>
    </b-form-group>
    <div class="mt-2 d-flex justify-content-between">
      <router-link to="/login">
        <b-button variant="outline-secondary">Отмена</b-button>
      </router-link>
      <b-button variant="success" @click="resetPassword" :disabled="disabledReset">Сбросить пароль</b-button>
    </div>
  </div>
</template>

<script>
import VerifyUser from '~/components/Libs/VerifyUser/VerifyUser'
import UserRecoveryForm from '~/components/Pages/Login/PasswordRecovery/UserRecoveryForm'
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";

export default {
  components: {
    VerifyUser,
    UserRecoveryForm
  },
  data() {
    return {
      form: {
        phone: '',
        code: '',
        email: '',
        surname: '',
        name: '',
        patronymic: '',
        birthdate: '',
        password: '',
        password2: ''
      },
      phoneLabel: 'Введите номер телефона указанный при регистрации',
      emailLabel: 'Введите email указанный при регистрации',
      isEmailValid: false,
      errorMessage: null,
      greater180: null
    }
  },

  methods: {

    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    async resetPassword() {
      let params;
      if (this.$refs['tabs'].currentTab == 0) {
        params = {
          "TYPE": 1,
          "PHONE": this.$v.form.phone.$model,
          "SMSCODE": this.$v.form.code.$model,
          "PASSWORD": this.$v.form.password.$model,
          "PASSWORD_CONFIRM": this.$v.form.password2.$model
        };
      }
      if (this.$refs['tabs'].currentTab == 1) {
        params = {
          "TYPE": 2,
          "EMAIL": this.$v.form.email.$model,
          "EMAILCODE": this.$v.form.code.$model,
          "PASSWORD": this.$v.form.password.$model,
          "PASSWORD_CONFIRM": this.$v.form.password2.$model
        };
      }
      // Исправить с появлением метода (> 180)
      let response;
      if (!this.greater180) {
        let response = await this.$store.dispatch('resetPassword', params);
        if (response.data[0].MESSAGE_CODE === '200') {
          this.$router.push('/login');
        } else {
          this.greater180 = true;
        }
      } else {
        const additionalParams = {
          "SURNAME" : this.$v.form.surname.$model,
          "FIRSTNAME" : this.$v.form.name.$model,
          "PATRONYMIC" : this.$v.form.patronymic.$model,
          "BIRTHDATE" : this.$v.form.birthdate.$model ? this.$v.form.birthdate.$model.toISOString().split('T')[0] : null
        }
        params = {
          ...params,
          ...additionalParams
        }
        response = await this.$store.dispatch('resetPassword', params);
        if (response.data[0].MESSAGE_CODE === '200') {
          this.$router.push('/login');
        }
      }
    }
  },

  computed: {
    disabledReset() {
      if (!this.greater180) {
        return this.$v.form.password2.$invalid;
      } else {
        return this.$v.form.name.$invalid || 
        this.$v.form.surname.$invalid || this.$v.form.patronymic.$invalid || this.$v.form.birthdate.$invalid;
      }
    }
  },

  validations: {
    form: {
      phone: {
        required,
        minLength: minLength(17)
      },
      email: {
        required,
        email
      },
      name: {
        required
      },
      surname: {
        required
      },
      patronymic: {
        required
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
      birthdate: {
        required
      }
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

  .tabs >>> .tab-content {
    border: none;
  }

  .tabs >>> .nav-tabs {
    display: flex;
    justify-content: center;
    border-bottom: none;
  }

  .tabs >>> .nav-tabs .nav-link {
    border: none;
  }

  .tabs >>> .nav-tabs .nav-link.active {
    border-bottom: 2px solid green; /**Заменить на глобальные цвета */
  }

  .tabs >>> .nav-tabs .nav-link.active:focus {
    border-bottom: 2px solid green; /**Заменить на глобальные цвета */
  }

  .tabs >>> .tab-pane {
    padding-left: 0;
  }
</style>
