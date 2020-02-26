<template>
  <div>
    <b-form @submit.stop.prevent="onSubmit">
      <b-form-group label="Телефон">
        <verify-phone :v="$v.form" :count="20" :validateState="validateState"/>
      </b-form-group>
      <b-form-group  label="Имя">
        <b-form-input
          v-model="$v.form.name.$model"
          :state="validateState('name')"
          @blur="$v.form.name.$touch()"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group  label="Фамилия">
        <b-form-input
          v-model="$v.form.family.$model"
          :state="validateState('family')"
          @blur="$v.form.family.$touch()"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group  label="Отчество">
        <b-form-input
          v-model="$v.form.patronymic.$model"
          :state="validateState('patronymic')"
          @blur="$v.form.patronymic.$touch()"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Дата рождения">
        <birthday-picker :data="$v.form" :state="validateState('birthday')"/>
      </b-form-group>
      <b-form-group>
        <b-form-input
          id="input-3"
          v-model="form.policyNumber"
          placeholder="Номер полиса"
        ></b-form-input>
      </b-form-group>
      <verify-password :v="$v.form" :validateState="validateState"/>
      <b-button type="submit" variant="primary">Создать аккаунт</b-button>
    </b-form>
  </div>
</template>

<script>
  import { validationMixin } from "vuelidate";
  import { required, minLength, sameAs } from "vuelidate/lib/validators";

  import birthdayPicker from '../../../Libs/BirthdayPicker/BirthdayPicker'
  import VerifyPhone from '../../../Libs/VerifyPhone/VerifyPhone'
  import VerifyPassword from '../../../Libs/VerifyPassword/VerifyPassword'

  function mustBeVerified (value) {
    return value === '55555';
  }

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
          birthday: '',
          policyNumber: '',
          code: '',
          password: '',
          password2: ''
        },
        show: true,
        password2: ''
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
        birthday: {
          required
        },
        code: {
          required,
          mustBeVerified
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
      }
    },
    methods: {
      validateState(name) {
        const { $dirty, $error } = this.$v.form[name];
        return $dirty ? !$error : null;
      },

      onSubmit() {
        this.$v.form.$touch();
        if (this.$v.form.$anyError) {
          return;
        }
        alert("Form submitted!");
      }
    },

    // validations() {
    //   return {
    //     code: { required, mustBeVerified }
    //   };
    // }
  };
</script>
