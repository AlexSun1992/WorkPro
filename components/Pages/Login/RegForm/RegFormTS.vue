<template>
  <b-form @submit="onSubmit" v-if="show">
    <b-form-group>
      <verify-phone/>
    </b-form-group>
    <b-form-group>
      <b-form-input
        v-model="form.email"
        v-validate="'required|email'"
        required
        placeholder="E-mail"
      ></b-form-input>
      <span>{{ veeErrors.first('email') }}</span>
    </b-form-group>
    <b-form-group>
      <b-form-input
        v-model="form.name"
        required
        placeholder="Имя"
      ></b-form-input>
    </b-form-group>
    <b-form-group>
      <b-form-input
        v-model="form.patronymic"
        required
        placeholder="Отчество"
      ></b-form-input>
    </b-form-group>
    <b-form-group>
      <birthday-picker/>
    </b-form-group>
    <b-form-group>
      <b-form-input
        id="input-3"
        v-model="form.policy"
        placeholder="Номер полиса"
      ></b-form-input>
    </b-form-group>
    <b-form-group>
      <b-form-input
        type="password"
        v-model="form.password"
        placeholder="Пароль"
        required
      ></b-form-input>
    </b-form-group>
    <b-form-group>
      <b-form-input
        type="password"
        v-model="form.repassword"
        placeholder="Повторите пароль"
        required
      ></b-form-input>
    </b-form-group>
    <b-form-group id="input-group-4">
      <b-form-checkbox-group v-model="form.checked" id="checkboxes-4">
        <b-form-checkbox required value="true" unchecked-value="false">Я согласен на обработку персональных
          данных
        </b-form-checkbox>
      </b-form-checkbox-group>
    </b-form-group>
    <b-button :disabled="form.checked === 'true'" type="submit" variant="primary">Зарегистрироваться</b-button>
  </b-form>
</template>

<script lang="ts">
  import {Vue, Component, Prop} from 'vue-property-decorator'
  import birthdayPickerComponent from '../../../Libs/BirthdayPicker/BirthdayPicker.vue'
  import VerifyPhone from '../../../Libs/VerifyPhone/VerifyPhone.vue'

  import { validationMixin } from "vuelidate";
  import { required, minLength } from "vuelidate/lib/validators";

  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im

  @Component({
    components: {
      birthdayPicker: birthdayPickerComponent,
      VerifyPhone: VerifyPhone
    }
  })

  export default class YourComponent extends Vue {

    form: {
      phone: string,
      email: string,
      family: string,
      name: string,
      patronymic: string,
      birthday: string,
      policyNumber: string,
      code: string
    } = {} as any

    show: boolean = true

    isPhoneCodeInputConfirm: boolean = false

    onSubmit(evt) {
      evt.preventDefault()
      alert(JSON.stringify(this.form))
    }

    phoneConfirm() {
      this.isPhoneCodeInputConfirm = true
    }

    changePhone() {
      this.isPhoneCodeInputConfirm = false
      this.form.phone = ''
      this.form.code = ''
    }

    get isPhoneButtonConfirm(): boolean {
      return regex.test(this.form.phone) && !this.isPhoneCodeInputConfirm
    }

    get isDisabledPhone(): boolean {
      return this.isPhoneCodeInputConfirm
    }

  }
</script>

<style scoped>

</style>
