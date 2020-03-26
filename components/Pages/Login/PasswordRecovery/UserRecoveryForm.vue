<template>
  <div>
    <b-form @submit.prevent="onSubmit">
      <b-form-group label="Фамилия">
        <b-form-input
          v-model="v.surname.$model"
          placeholder="Фамилия"
          class="form-control"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, введите фамилию</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Имя">
        <b-form-input
          v-model="v.name.$model"
          placeholder="Имя"
          class="form-control"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, введите имя</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Отчество">
        <b-form-input
          v-model="v.patronymic.$model"
          placeholder="Отчество"
          class="form-control"
        ></b-form-input>
        <b-form-invalid-feedback>Пожалуйста, введите отчество</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Дата рождения">
        <birthday-picker :data="v" :state="{}"/>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";
import birthdayPicker from '../../../Libs/BirthdatePicker/BirthdatePicker'

export default {
  props: ["v"],
  components: {
    birthdayPicker
  }
};
</script>
