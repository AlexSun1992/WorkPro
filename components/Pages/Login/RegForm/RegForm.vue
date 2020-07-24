<template>
  <div>
    <ConfirmModal :conformation="conformation" @agree="isRegConfirmed=$event"/>
    <b-alert :show="errorMessage" variant="danger">{{ errorMessage }}</b-alert>
    <b-form @submit.stop.prevent="onSubmit">
      <b-form-group label="Телефон">
        <verify-user ref="verifyUser" :v="$v.form" :count="60" :context="'registration'" :loginType="'phone'" :validateState="validateState" :disabled="registrationInProcess"/>
      </b-form-group>
      <b-form-group  label="E-mail">
        <b-form-input
          v-model.lazy="$v.form.email.$model"
          :state="validateState('email')"
          @blur="$v.form.email.$touch()"
          placeholder="E-mail"
          :disabled="registrationInProcess"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group  label="Имя">
        <b-form-input
          v-model="$v.form.name.$model"
          :state="validateState('name')"
          @blur="$v.form.name.$touch()"
          placeholder="Имя"
          :disabled="registrationInProcess"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group  label="Фамилия">
        <b-form-input
          v-model="$v.form.family.$model"
          :state="validateState('family')"
          @blur="$v.form.family.$touch()"
          placeholder="Фамилия"
          :disabled="registrationInProcess"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group  label="Отчество">
        <b-form-input
          v-model="$v.form.patronymic.$model"
          :state="validateState('patronymic')"
          @blur="$v.form.patronymic.$touch()"
          placeholder="Отчество"
          :disabled="registrationInProcess"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Дата рождения">
        <birthday-picker :data="$v.form" :state="validateState('birthdate')" :disabled="registrationInProcess"/>
      </b-form-group>
      <b-form-group label="Номер полиса">
        <b-form-input
          id="input-3"
          v-model="form.policyNumber"
          placeholder="Номер полиса"
          :disabled="registrationInProcess"
        ></b-form-input>
      </b-form-group>
      <verify-password :v="$v.form" :validateState="validateState" :disabled="registrationInProcess"/>
      <b-button type="submit" variant="success" :disabled="registrationInProcess || !!this.$store.getters.getRegistrationError">
        Зарегистрироваться
        <b-spinner v-if="registrationInProcess" style="width: 1.2rem; height: 1.2rem;" variant="light"></b-spinner>
      </b-button>
    </b-form>
  </div>
</template>

<script>
  import axios from 'axios'
  import { validationMixin } from "vuelidate";
  import { required, email, minLength, sameAs } from "vuelidate/lib/validators";

  import birthdayPicker from '../../../Libs/BirthdatePicker/BirthdatePicker'
  import VerifyUser from '../../../Libs/VerifyUser/VerifyUser'
  import VerifyPassword from '../../../Libs/VerifyPassword/VerifyPassword'
  import ConfirmModal from './ConfirmModal'

  export default {
    components: {birthdayPicker, VerifyUser, VerifyPassword, ConfirmModal},
    mixins: [validationMixin],

    data () {
      return {
        form: {
          phone: '',
          email: '',
          family: '',
          name: '',
          patronymic: '',
          birthdate: '',
          policyNumber: '',
          code: '',
          password: '',
          password2: ''
        },
        conformation: false,
        show: true,
        password2: '',
        registrationInProcess: false,
        captchaToken: null,
        isRegConfirmed: null
      }
    },
    validations: {
      form: {
        name: {
          required
        },
        family: {
          required
        },
        patronymic: {
          required
        },
        birthdate: {
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
        phone: {
          required,
          minLength: minLength(17)
        },
        email: {
          required, email
        },
      }
    },
    methods: {
      validateState(name) {
        const { $dirty, $error } = this.$v.form[name];
        return $dirty ? !$error : null;
      },

      async setToken() {
        this.registrationInProcess = true;
        // this.captchaToken = this.$getCaptcha();
        const params = {
          SECONDNAME: this.$v.form.family.$model,
          FIRSTNAME: this.$v.form.name.$model,
          THIRDNAME: this.$v.form.patronymic.$model,
          BIRTHDATE: this.$v.form.birthdate.$model.toISOString().split('T')[0],
          PHONE: this.$v.form.phone.$model,
          EMAIL: this.$v.form.email.$model,
          CODE: this.$v.form.code.$model,
          POLICY_NUMBER: "",
          PASSWORD: this.$v.form.password.$model,
          PASSWORD_CONFIRM: this.$v.form.password2.$model,
          USER_CONFIRM: this.isRegConfirmed ? "Y" : "N"
        }

        const response = await this.$store.dispatch("registerUser", params);

        // Удалить с появлением обработки ошибки
        if (!response) {
          this.registrationInProcess = false;
        }

        if (response && response.MESSAGE_CODE === '510') {
          this.conformation = true;
          return;
        }

        if (response) {
          this.$auth.setUserToken(response.ACCESS_TOKEN);
          if (this.$store.getters.getRegistrationError) {
            this.$router.push('/');
          }
        } else {
          this.$refs['verifyUser'].code = null;
        }
      },

      async onSubmit() {
        try {
          this.$refs['verifyUser'].loginTouchesCount = 3;
          if (this.$v.form.phone.$model) {
            this.$refs['verifyUser'].getCode();
            this.$refs['verifyUser'].isPhoneChanged = true;
          }
          this.$v.form.$touch();
          if (this.$v.form.$anyError) {
            return;
          }
          this.setToken();
        } catch (e) {
          console.log(e);
        }
      }
    },

    computed: {
      errorMessage() {
        if (this.$store.getters.getRegistrationError) {
          this.registrationInProcess = false;
          if (this.$refs['verifyUser']) {
            this.$refs['verifyUser'].$refs["userInput"].$el.focus();
            this.$refs['verifyUser'].resendCount = null;
          }
          return this.$store.getters.getRegistrationError.toString();
        }

        if (!this.$store.getters.getRegistrationError && this.$store.getters.isAuthenticated) {
          this.$router.push("/cabinet/55/0/701")
        }
      }
    },

    watch: {
      isRegConfirmed: function(val) {
        if (val) {
          this.setToken();
        } else {
          this.$router.push('/login');
        }
      }
    }
  };
</script>
