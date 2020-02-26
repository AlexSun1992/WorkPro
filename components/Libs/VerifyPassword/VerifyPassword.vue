<template>
  <div>
    <b-form-group>
      <b-form-input
        type="password"
        v-model="v.password.$model"
        :state="validateState('password')"
        placeholder="Пароль"
      ></b-form-input>
      <b-form-invalid-feedback>Введите пароль</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group>
      <b-form-input
        type="password"
        v-model="v.password2.$model"
        :state="validateState('password2')"
        placeholder="Повторите пароль"
      ></b-form-input>
      <b-form-invalid-feedback>Повторите пароль</b-form-invalid-feedback>
    </b-form-group>
  </div>
</template>

<script>

export default {
  props: ['v', 'validateState'],
  data() {
    return {
      password: "",
      password2: ""
    };
  }
};
</script>
