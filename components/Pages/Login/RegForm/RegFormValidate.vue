<template>
  <div>
    <b-form @submit.stop.prevent="onSubmit">
      <b-form-group label="Телефон">
        <verify-phone/>
      </b-form-group>
      <b-form-group label="Имя">
        <b-form-input
          v-model="$v.form.name.$model"
          :state="validateState('name')"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Фамилия">
        <b-form-input
          v-model="$v.form.family.$model"
          :state="validateState('family')"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Отчество">
        <b-form-input
          v-model="$v.form.patronymic.$model"
          :state="validateState('patronymic')"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Дата рождения">
        <birthday-picker :data="$v.form" :state="validateState('birthday')"/>
      </b-form-group>
      <b-form-group label="Номер полиса">
        <b-form-input
          id="input-3"
          v-model="form.policyNumber"
          placeholder="Номер полиса"
        ></b-form-input>
      </b-form-group>
      <b-form-group label="Пароль">
        <b-form-input
          type="password"
          v-model="$v.form.password.$model"
          :state="validateState('password')"
          placeholder="Пароль"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Повторите пароль">
        <b-form-input
          type="password"
          v-model="$v.form.password2.$model"
          :state="validateState('password2')"
          placeholder="Повторите пароль"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="primary">Создать аккаунт</b-button>
    </b-form>
  </div>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, minLength } from 'vuelidate/lib/validators'

  import birthdayPicker from '../../../Libs/BirthdayPicker/BirthdayPicker'
  import VerifyPhone from '../../../Libs/VerifyPhone/VerifyPhone'
  import CustomComponent from '../../../Libs/CustomComponent'

  export default {
    components: {CustomComponent, birthdayPicker, VerifyPhone},
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
        password2: '',
        name: ''
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
          required
        },
        password: {
          required
        },
        password2: {
          required
        }
      }
    },
    computed: {
      invalidFeedback () {
        return 'Пожалуйста, заполните это поле'
      }
    },
    methods: {
      validateState (name) {
        const {$dirty, $error} = this.$v.form[name]
        return $dirty ? !$error : null
      },
      onSubmit () {
        this.$v.form.$touch()
        if (this.$v.form.$anyError) {
          return
        }
       console.log(this.form)
      }
    }
  }
</script>
