<template>
  <div>
    <b-alert :show="errorMessage" variant="danger">{{ errorMessage }}</b-alert>
    <b-form @submit.stop.prevent="onSubmit">
      <b-form-group label="Телефон">
        <verify-phone ref="verifyPhone" :v="$v.form" :count="20" :validateState="validateState" :disabled="registrationInProcess"/>
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
      <b-button type="submit" variant="success" :disabled="registrationInProcess">
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
  import VerifyPhone from '../../../Libs/VerifyPhone/VerifyPhone'
  import VerifyPassword from '../../../Libs/VerifyPassword/VerifyPassword'

  export default {
    components: {birthdayPicker, VerifyPhone, VerifyPassword},
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
        show: true,
        password2: '',
        registrationInProcess: false
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
        const response = await this.$store.dispatch("registerUser", this.form)
        if (response && response.status === 200) {
          this.$auth.setUserToken(response.data[0].ACCESS_TOKEN);
        }
        this.registrationInProcess = false;
      },

      onSubmit() {
        try {
          if (this.$v.form.phone.$model) {
            this.$refs['verifyPhone'].getCode();
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
          return 'При регистрации пользователя произошла ошибка'
          // return this.$store.getters.getRegistrationError.toString();
        }

        if (!this.$store.getters.getRegistrationError && this.$store.getters.isAuthenticated) {
          this.$router.push("/")
        }
      }
    }
  };
</script>
