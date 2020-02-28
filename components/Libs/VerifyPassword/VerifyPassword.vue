<template>
  <div>
    <b-row>
      <b-col sm="6">
        <b-form-group label="Пароль">
          <b-form-input
            type="password"
            v-model="v.password.$model"
            :state="validateState('password')"
            placeholder="Пароль"
            @blur="v.password.$touch()"
          ></b-form-input>
          <b-form-invalid-feedback>Введите пароль</b-form-invalid-feedback>
        </b-form-group>
      </b-col>
      <b-col class="password-repeat" sm="6">
        <b-form-group>
          <b-form-input
            type="password"
            v-model="v.password2.$model"
            :state="validateState('password2')"
            placeholder="Повторите пароль"
            @blur="v.password2.$touch()"
          ></b-form-input>
          <b-form-invalid-feedback>Повторите пароль</b-form-invalid-feedback>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: ["v", "validateState"],
  data() {
    return {
      password: "",
      password2: ""
    };
  }
};
</script>

<style scoped>
  .password-repeat {
    margin-top: 28px;
  }
</style>
