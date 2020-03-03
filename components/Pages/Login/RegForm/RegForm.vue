<template>
  <div>
    <b-form @submit.stop.prevent="onSubmit">
      <b-form-group label="Телефон">
        <verify-phone ref="verifyPhone" :v="$v.form" :count="20" :validateState="validateState"/>
      </b-form-group>
      <b-form-group  label="E-mail">
        <b-form-input
          v-model.lazy="$v.form.email.$model"
          :state="validateState('email')"
          @blur="$v.form.email.$touch()"
          placeholder="E-mail"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group  label="Имя">
        <b-form-input
          v-model="$v.form.name.$model"
          :state="validateState('name')"
          @blur="$v.form.name.$touch()"
          placeholder="Имя"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group  label="Фамилия">
        <b-form-input
          v-model="$v.form.family.$model"
          :state="validateState('family')"
          @blur="$v.form.family.$touch()"
          placeholder="Фамилия"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group  label="Отчество">
        <b-form-input
          v-model="$v.form.patronymic.$model"
          :state="validateState('patronymic')"
          @blur="$v.form.patronymic.$touch()"
          placeholder="Отчество"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Дата рождения">
        <birthday-picker :data="$v.form" :state="validateState('birthdate')"/>
      </b-form-group>
      <b-form-group label="Номер полиса">
        <b-form-input
          id="input-3"
          v-model="form.policyNumber"
          placeholder="Номер полиса"
        ></b-form-input>
      </b-form-group>
      <verify-password :v="$v.form" :validateState="validateState"/>
      <b-button type="submit"  variant="success">Зарегистрироваться</b-button>
    </b-form>
  </div>
</template>

<script>
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

      onSubmit() {
        if (this.$v.form.phone.$model) {
          this.$refs['verifyPhone'].getCode();
        }
        this.$v.form.$touch();
        if (this.$v.form.$anyError) {
          return;
        }
        alert(JSON.stringify(this.form, null, ' '));
      }
    }
  };
</script>
