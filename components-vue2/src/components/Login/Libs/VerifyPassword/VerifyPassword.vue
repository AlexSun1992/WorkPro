<template>
  <div class="row mt-3">
    <b-col sm="12" md="6">
      <b-form-group :label="showLabel" label-cols="12" class="required">
        <b-form-input
          :id="Math.random().toString()"
          type="password"
          v-model="v.password.$model"
          :state="validateState('password')"
          placeholder="Пароль"
          @blur="v.password.$touch()"
          autocomplete="new-password"
          :disabled="disabled"
          @change="changeField('password')"
        ></b-form-input>
        <b-form-invalid-feedback>Введите пароль.</b-form-invalid-feedback>
      </b-form-group>
    </b-col>
    <b-col sm="12" md="6" v-if="recovery"></b-col>
    <b-col
      class="password-repeat mt-3 mt-lg-0"
      :class="{ 'mt-0': recovery }"
      sm="12"
      md="6"
    >
      <b-form-group
        :label="'Повторите пароль'"
        label-cols="12"
        class="required"
      >
        <b-form-input
          :id="Math.random().toString()"
          type="password"
          autocomplete="new-password"
          v-model="v.password2.$model"
          :state="validateState('password2')"
          placeholder="Повторите пароль"
          @blur="v.password2.$touch()"
          :disabled="disabled"
          @change="changeField('password2')"
        ></b-form-input>
        <b-form-invalid-feedback>Пароли не совпадают</b-form-invalid-feedback>
      </b-form-group>
    </b-col>
    <b-col sm="12" v-if="recovery"></b-col>
  </div>
</template>

<script>
import {
  BFormInvalidFeedback,
  BFormInput,
  BFormGroup,
  BCol,
  BRow,
} from "bootstrap-vue";

export default {
  props: [
    "v",
    "validateState",
    "disabled",
    "recovery",
    "tabIndex",
    "isValid",
    "logParams",
  ],
  data() {
    return {
      password: "",
      password2: "",
    };
  },
  methods: {
    changeField(field) {
      this.$LogEvent({
        ...this.logParams,
        message: `Поле ${field} заполнено`,
        timeUser: new Date(),
      });
      console.log(field, this.v[field].$model);
    },
  },
  components: {
    BFormInvalidFeedback,
    BFormInput,
    BFormGroup,
    BCol,
    BRow,
  },
  computed: {
    showLabel() {
      return this.recovery ? "Придумайте новый пароль" : "Пароль";
    },
  },
};
</script>

<style scoped></style>
